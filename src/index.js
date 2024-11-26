const soap = require('strong-soap').soap;
import cron from 'node-cron';
import consola from 'consola';
import { POS, DICTIONARY } from './libs/dictionary';

let keys;

function checkRequest() {
    const url = "./pos.wsdl";
    const username = "vpm_abap";
    const password = "V@nessit@ntoni@3";
    const requestArgs = {
      POSID: "IT205078",
      VKORG: "0110",
      WERKS: "0102",
    };
    
    const options = {};
  
    soap.createClient(url, options, (err, client) => {
      if (err) {
        console.error("Error creando cliente SOAP:", err);
        return;
      }
  
      client.setSecurity(new soap.BasicAuthSecurity(username, password));
  
      function processData(
        posResult,
        { WERKS, VKORG, UNAME, POSID, DATUM, UZEIT, FUNC }
      ) {
        let values = "";
  
        Object.keys(posResult).forEach((key) => {
          values = values.toString().concat(`${posResult[key]}|`);
        });
  
        const args = {
          RESPONSE: {
            item: [
              {
                WERKS,
                VKORG,
                UNAME,
                POSID,
                DATUM,
                UZEIT,
                FUNC,
                TOPER: "R",
                RESPONSE: `${values}`,
              },
            ],
          },
        };
  
        console.log("args__", args);
  
        client.ZRFC_POS_TBK_RESPONSE(requestArgs, async (err, _) => {
          if (err) {
            consola.error("Error en ZRFC_POS_TBK_RESPONSE:", err);
            return;
          }
          consola.success("ZRFC_POS_TBK_RESPONSE exitoso");
        });
      }
  
      client.ZRFC_POS_TBK_REQUEST(requestArgs, async (err, result) => {
        if (err) {
          consola.error("Error en ZRFC_POS_TBK_REQUEST:", err);
          return;
        }
        consola.success("ZRFC_POS_TBK_REQUEST exitoso", result);
  
        const { REQUEST, SUBRC } = result;
  
        if (SUBRC !== 0) return;
  
        const posResult = await DICTIONARY[REQUEST.FUNC]();
  
        consola.log("___POS_RESULT___", posResult);
  
        processData(posResult, REQUEST);
      });
    });
  }
  
  
function startCron(keys) {
    cron.schedule("* * * * *", () => {
        checkRequest(keys);
        consola.info("CRON ejecutado:", new Date().toISOString());
        });
}

function startApp() {
  POS.setDebug(true);
  POS
    .autoconnect()
    .then(async (port) => {
      if (port === false) {
        consola.error("No se encontró ningún POS conectado");
      } else {
        consola.success("Connected to PORT:", port.path);
        keys = await POS.loadKeys();
        startCron(keys);
      }
    })
    .catch((err) => {
      consola.error(`Ocurrió un error inesperado. POS: ${err.message}`);
    });
}

startApp();
