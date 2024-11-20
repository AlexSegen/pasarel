const soap = require('strong-soap').soap;
const cron = require('node-cron');
const consola = require("consola");
const { POSIntegrado } = require("transbank-pos-sdk");

let keys;
const pos = new POSIntegrado();

// Dictionary
const DICTIONARY = {
  "0250": () => pos.getLastSale(),
  "0700": () => pos.getTotals(),
  "0260": ({ printOnPos }) => pos.salesDetail(printOnPos),
};

function checkRequest(keys) {
  consola.log('___KEYS___', keys);
  const username = 'vpm_abap';
  const password = 'V@nessit@ntoni@3';
  const requestArgs = {
    POSID: "IT205078",
    VKORG: "0110",
    WERKS: "0102",
  };
  const options = {};

  soap.createClient(url, options, (err, client) => {
    if (err) {
      console.error('Error creando cliente SOAP:', err);
      return;
    }
  
    client.setSecurity(new soap.BasicAuthSecurity(username, password));
  
    client.ZRFC_POS_TBK_REQUEST(requestArgs, async (err, result) => {
      if (err) {
        console.error('Error invocando método SOAP:', err);
        return;
      }
      console.log('Resultado del método:', result);
      const { REQUEST } = result;

      const posResult = await DICTIONARY[REQUEST.FUNC]();
      
      consola.log('___POS_RESULT___', posResult);
    });
  });
};
  
function startCron(keys) {
    cron.schedule("* * * * *", () => {
        checkRequest(keys);
        consola.info("CRON ejecutado:", new Date().toISOString());
        });
}

function startApp() {
  pos.setDebug(true);
  pos
    .autoconnect()
    .then(async (port) => {
      if (port === false) {
        consola.error("No se encontró ningún POS conectado");
      } else {
        consola.success("Connected to PORT:", port.path);
        keys = await pos.loadKeys();
        startCron(keys);
      }
    })
    .catch((err) => {
      consola.error(`Ocurrió un error inesperado. POS: ${err.message}`);
    });
}

startApp();
