const axios = require("axios").default;
const express = require("express");
const app = express();
const port = 3000;


const username = 'vpm_abap';
const password = 'V@nessit@ntoni@3';

const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

const httpClient = axios.create({
  baseURL: "http://10.111.55.26:8000",
  timeout: 5000,
  headers: { 'Authorization': authHeader },
});

async function checkUser(username) {
  try {
    const response = await httpClient.get(
      `/sap/bc/srt/wsdl/sdef_ZTEST_WS2/wsdl11/ws_policy/document?sap-client=100&username=${username}`
    );

    const { data } = response;

    return data;
  } catch (error) {
    throw new Error(error);
  }
}

async function getUser(userId) {
  try {
    const response = await httpClient.get(`/users/${userId}`);

    const { data } = response;

    return data;
  } catch (error) {
    throw new Error(error);
  }
}

async function createUser(user) {
  try {
    const response = await httpClient.post(`/users`, { ...user });

    const { data } = response;

    return data;
  } catch (error) {
    throw new Error(error);
  }
}

// Middleware para poder leer datos JSON en las solicitudes POST
app.use(express.json());
// Ruta GET
app.get("/api/user/:id", async (req, res) => {
  const id = req.params.id;

  const user = await getUser(id);

  return res.send(user);
});
// Ruta POST
app.post("/api/user", async (req, res) => {
  const newUser = await createUser(req.body);

  res.send(newUser);
});

app.get("/api/user/check/:username", async (req, res) => {
  try {
    const username =  req.params.username;
    const user = await checkUser(username);

    return res.send({
      content: user,
    });
  } catch (error) {
    return res.send(`Error: ${error.message}`);
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
