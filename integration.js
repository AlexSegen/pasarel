const axios = require("axios").default;
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

//Dependiendo del modelo de POS
//const { POSAutoservicio } = require('transbank-pos-sdk');
const { POSIntegrado } = require('transbank-pos-sdk');

const pos = new POSIntegrado();

// Ruta GET
app.get("/api/last-sale", async (req, res) => {
  try {
    if (!pos.isConnected) { // Verificar si el POS está conectado
      return res.status(500).send("Error: POS no está conectado");
    }

    const result = await pos.lastSale(false);
    return res.send({ result });
  } catch (error) {
    return res.send(`Error: ${error.message}`);
  }
});


// Iniciar el servidor
function startServer() {
  app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });
}

function startApp() {
  pos.setDebug(true);

  pos.autoconnect() // Buscar y conectar al POS
    .then((port) => {
      if (port === false) {
        console.log('No se encontró ningún POS conectado');
      } else {
        console.log('Connected to PORT:', port.path);
        pos.loadKeys(); // Cargar llaves
        startServer();  // Iniciar el servidor después de una conexión exitosa
      }
    })
    .catch((err) => {
      console.log('Ocurrió un error inesperado', err);
    });
}

startApp();
