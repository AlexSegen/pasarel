import cron from 'node-cron';
import consola from 'consola';
import { CONFIG } from "./config.js";
import { POS } from './modules/pos.js';
import { checkRequest } from './modules/soap-client.js'
import { downloadWSDL } from './modules/httpclient.js';

function startCron(keys) {
  cron.schedule("* * * * *", () => {
    consola.info("CRON ejecutado:", new Date().toISOString());
    try {
      checkRequest(keys);
      } catch (error) {
          console.log('error', error.message);
          return;
      }
  });
};

function startApp() {

  if (CONFIG.isDev) {
    consola.info('--------- RUNNING MOCKS ---------');
  };

  try {

    if (!CONFIG.isDev)
      downloadWSDL();

    POS.setDebug(true);
    POS
      .autoconnect()
      .then(async (port) => {
        if (port === false) {
          consola.error("No se encontró ningún POS conectado");
        } else {
          consola.success("Connected to PORT:", port.path);
          const keys = await POS.loadKeys();
          //startCron(keys);
          checkRequest(keys);
        }
      })
      .catch((err) => {
        consola.error(`Ocurrió un error inesperado. POS: ${err.message}`);
      });
  } catch (error) {
    consola.error("Ocurrió un error al descargar archivo WSDL", error);
  }
};

startApp();
