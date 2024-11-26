import dotenv from 'dotenv';
import consola from 'consola';
import { soap } from 'strong-soap';
import { DICTIONARY } from './pos.js';

dotenv.config();

const checkRequest = (keys) => {
    consola.info('___KEYS__', keys);

    const { VKORG, WERKS, SOAP_USER, SOAP_PASSWORD } = process.env;

    const url = "./pos.wsdl";
    const requestArgs = {
        POSID: "IT205078",
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

            console.log("ZRFC_POS_TBK_RESPONSE args__", args);

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

            if (!DICTIONARY[REQUEST.FUNC]) {
                consola.error("Código inválido: " + REQUEST.FUNC , err);
                return;
            };

            const posResult = await DICTIONARY[REQUEST.FUNC]();

            consola.log("___POS_RESULT___", posResult);

            processData(posResult, REQUEST);
        });
    });
}

export { checkRequest };


