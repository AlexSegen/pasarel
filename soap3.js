const soap = require("strong-soap").soap;
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

      const requestArgs = {
        RESPONSE: {
          item: [
            {
              WERKS: WERKS,
              VKORG: VKORG,
              UNAME: UNAME,
              POSID: POSID,
              DATUM: DATUM,
              UZEIT: UZEIT,
              TOPER: "R",
              FUNC: FUNC,
              RESPONSE: `${values}`,
            },
          ],
        },
      };

      console.log("requestArgs__", requestArgs);

      client.ZRFC_POS_TBK_RESPONSE(requestArgs, async (err, _) => {
        if (err) {
          console.error("Error en ZRFC_POS_TBK_RESPONSE:", err);
          return;
        }
        console.log("ZRFC_POS_TBK_RESPONSE exitoso");
      });
    }

    client.ZRFC_POS_TBK_REQUEST(requestArgs, async (err, result) => {
      if (err) {
        console.error("Error en ZRFC_POS_TBK_REQUEST:", err);
        return;
      }
      console.log("ZRFC_POS_TBK_REQUEST exitoso", result);

      const { REQUEST, SUBRC } = result;

      if (SUBRC !== 0) return;

      const posResult = await DICTIONARY[REQUEST.FUNC]();

      consola.log("___POS_RESULT___", posResult);

      processData(posResult, REQUEST);
    });
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
        // keys = await pos.loadKeys();
        checkRequest();
      }
    })
    .catch((err) => {
      consola.error(`Ocurrió un error inesperado. POS: ${err.message}`);
    });
}

startApp();
