import { soap as Soap } from "strong-soap";
import { soap as fakeSoap } from "./fake-soap.client.js";
import consola from "consola";
import { DICTIONARY } from "./pos.js";
import { getArgs, handlePOSResult } from "../helpers/utils.js";
import { CONFIG } from "../config.js";

let soap;

//Soap Client
if (CONFIG.isDev) {
  soap = fakeSoap;
} else {
  soap = Soap;
}

const checkRequest = ({ terminalId }) => {
  const { VKORG, WERKS, SOAP_USER, SOAP_PASSWORD } = CONFIG;

  const url = "./service.wsdl";
  const requestArgs = {
    POSID: terminalId,
    VKORG,
    WERKS,
  };

  const options = {};

  soap.createClient(url, options, (err, client) => {
    if (err) {
      console.error("Error creando cliente SOAP:", err);
      return;
    }

    client.setSecurity(new soap.BasicAuthSecurity(SOAP_USER, SOAP_PASSWORD));

    function processData(
      posResult,
      { WERKS, VKORG, UNAME, POSID, DATUM, UZEIT, FUNC }
    ) {
      const args = {
        RESPONSE: {
          item: handlePOSResult(
            { WERKS, VKORG, UNAME, POSID, DATUM, UZEIT, FUNC },
            posResult
          ),
        },
      };

      console.log("ZRFC_POS_TBK_RESPONSE args", args.RESPONSE);

      client.ZRFC_POS_TBK_RESPONSE(args, async (err, _) => {
        try {
          
          if (err) {
            consola.error("Error en ZRFC_POS_TBK_RESPONSE:", err);
            return;
          }
          consola.success("ZRFC_POS_TBK_RESPONSE exitoso");

          return;

        } catch (error) {
          consola.error('Ocurrió un error durante la ejecución de ZRFC_POS_TBK_RESPONSE', error);
          return
        }
      });
    }

    client.ZRFC_POS_TBK_REQUEST(requestArgs, async (err, result) => {
      try {
        if (err) {
          consola.error("Error en ZRFC_POS_TBK_REQUEST:", err);
          return;
        }
        consola.success("ZRFC_POS_TBK_REQUEST exitoso", result);
  
        const { REQUEST, SUBRC } = result;
  
        if (SUBRC !== 0) return;
  
        if (!DICTIONARY[REQUEST.FUNC]) {
          consola.error("Código inválido: " + REQUEST.FUNC, err);
          return;
        }
  
        const postargs = getArgs(REQUEST.REQUEST);
  
        const posResult = await DICTIONARY[REQUEST.FUNC](...postargs);
  
        consola.info("___POS_RESULT___", posResult);
  
        processData(posResult, REQUEST);
  
        return;
        
      } catch (error) {
        consola.error('Ocurrió un error durante la ejecución de ZRFC_POS_TBK_REQUEST', error);
        return;
      }
    });
  });

  return;
};

export { checkRequest };
