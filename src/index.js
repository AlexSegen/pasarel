import cron from 'node-cron';
import consola from 'consola';
import { POS } from './modules/pos.js';
import { checkRequest } from './modules/soap-client.js'


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
        const keys = await POS.loadKeys();
        startCron(keys);
      }
    })
    .catch((err) => {
      consola.error(`Ocurrió un error inesperado. POS: ${err.message}`);
    });
};

startApp();
