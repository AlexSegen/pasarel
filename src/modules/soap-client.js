import { soap as Soap } from "strong-soap";
import { soap as fakeSoap } from "./fake-soap.client.js";
import consola from "consola";
import { DICTIONARY } from "./pos.js";
import { getArgs, handlePOSResult } from "../helpers/utils.js";
import { CONFIG } from "../config.js";
import { Log } from './logger.js';

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
      Log(err.message, 'createClient');
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
            Log(err.message, 'ZRFC_POS_TBK_RESPONSE');
            return;
          }
          consola.success("ZRFC_POS_TBK_RESPONSE exitoso");

          return;

        } catch (err) {
          consola.error('Ocurrió un error durante la ejecución de ZRFC_POS_TBK_RESPONSE', error);
          Log(err.message, 'ZRFC_POS_TBK_RESPONSE');
          return
        }
      });
    }

    client.ZRFC_POS_TBK_REQUEST(requestArgs, async (err, result) => {
      try {
        if (err) {
          consola.error("Error en ZRFC_POS_TBK_REQUEST:", err);
          Log(err.message, 'ZRFC_POS_TBK_REQUEST');
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
        Log(err.message, 'ZRFC_POS_TBK_REQUEST');
        return;
      }
    });
  });

  return;
};

export { checkRequest };
