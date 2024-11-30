import cron from 'node-cron';
import consola from 'consola';
import { CONFIG } from "./config.js";
import { POS } from './modules/pos.js';
import { checkRequest } from './modules/soap-client.js'
import { downloadWSDL } from './modules/httpclient.js';
import { Log } from './modules/logger.js';

function startCron(keys) {
  cron.schedule("*/5 * * * * *", () => {
    consola.info("CRON ejecutado:", new Date().toISOString());
    try {
      checkRequest(keys);
      } catch (err) {
          console.log('startCron error', err.message);
          Log(err.message, 'startCron');
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
          const confirm = await consola.prompt("Quieres activar el cron?", {
            type: "confirm",
          });
          
          if(confirm) {
            startCron(keys);
            return;
          } 
          
          checkRequest(keys);
        }
      })
      .catch((err) => {
        consola.error(`Ocurrió un error inesperado. POS: ${err.message}`);
        Log(err.message, 'autoconnect');
      });
  } catch (err) {
    consola.error("Ocurrió un error al descargar archivo WSDL", err);
    Log(err.message, 'startApp');
  }
};

startApp();
