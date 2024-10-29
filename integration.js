const axios = require("axios").default;
const express = require("express");
const app = express();

//Dependiendo del modelo de POS
//const { POSAutoservicio } = require('transbank-pos-sdk');
const { POSIntegrado } = require('transbank-pos-sdk');

const pos = new POSIntegrado();

const port = 3000;

// Middleware para poder leer datos JSON en las solicitudes POST
app.use(express.json());
// Ruta GET

app.get("/api/last-sale", async (req, res) => {
  try {
    const result =  pos.lastSale(false);
    return res.send({
      result,
    });

  } catch (error) {
    return res.send(`Error: ${error.message}`);
  }
});


function startApp() {

    pos.setDebug(true);

    pos.autoconnect() // Esta línea permite busca en todos los puertos si existe uno que tenga conectado un equipo POS y se intenta conectar con el primero que encuentra. 
        .then((port) => {
            if (port === false) {
                console.log('No se encontró ningún POS conectado')
            }  

            console.log('Connected to PORT: ', port.path)
            pos.loadKeys() // Cargar llaves
        })
        .catch((err) => { console.log('Ocurrió un error inesperado', err) })

    // Iniciar el servidor
    app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`);
    });
};

startApp();
