const consola = require("consola");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const { POSIntegrado } = require("transbank-pos-sdk");

const pos = new POSIntegrado();

// Dictionary
const DICTIONARY = {
  "0250": () => pos.getLastSale(),
  "0700": () => pos.getTotals(),
  "0260": ({ printOnPos }) => pos.salesDetail(printOnPos),
};

// Ruta POST
app.post("/api/code/:code", async (req, res) => {
  try {
    if (!pos.isConnected()) {
      // Verificar si el POS está conectado
      return res.status(500).send("Error: POS no está conectado");
    }

    const code = req.params?.code;

    const result = await DICTIONARY[code](req.body);
    return res.send({ result });
  } catch (error) {
    return res.send(`Error: ${error.message}`);
  }
});

// Iniciar el servidor
function startServer() {
  app.listen(port, () => {
    consola.start(`Servidor escuchando en http://localhost:${port}`);
  });
}

function startApp() {
  pos.setDebug(true);

  pos
    .autoconnect() // Buscar y conectar al POS
    .then((port) => {
      if (port === false) {
        consola.error("No se encontró ningún POS conectado");
      } else {
        consola.success("Connected to PORT:", port.path);
        pos.loadKeys(); // Cargar llaves
        startServer(); // Iniciar el servidor después de una conexión exitosa
      }
    })
    .catch((err) => {
      consola.error(`Ocurrió un error inesperado. POS: ${err.message}`);
    });
}

startApp();
