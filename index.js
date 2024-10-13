const fs = require("fs");
const path = require("path");
const consola = require("consola");

const inputFilePath = path.join(__dirname, "input/commands.txt");
const outputFilePath = path.join(__dirname, "output/result.txt");

// Definir dos métodos
function metodoUno() {
  writeOutputFile(outputFilePath, "Se ejecutó el Método Uno.\n");
  cleanFile("input");
};

function metodoDos(params) {
  writeOutputFile(outputFilePath, `Se ejecutó el Método Dos | Parámetros: ${params?.toString()}\n`);
  cleanFile("input");
};

// Función para crear el archivo result.txt
function writeOutputFile(path, content) {
  fs.promises
    .writeFile(path, content/* ,  { flag: 'a+' } */)
    .then(() => {
      consola.success("Output file updated.");
    })
    .catch((err) => {
      consola.error(new Error(`Could not update output file:`));
      console.error(err);
    });
}

// Función para limpiar el archivo commands
function cleanFile(type) {
  const routes = {
    input: inputFilePath,
    output: outputFilePath,
  };
  fs.promises
    .writeFile(routes[type], "", "utf-8") // Escribir un contenido vacío para limpiar el archivo
    .catch((err) => {
      consola.error(new Error(`Could not clean ${type}:`));
      console.error(err);
    });
};

function processInputContent(content) {
	const chunks = content.split('|');
	const [method, params] = chunks;
	return {
		method,
		params,
	}
};

function processMethod(content) {

	const { method, params } = processInputContent(content);

	switch (method) {
		case 'metodoUno':
			metodoUno();
			break;

		case 'metodoDos':
			metodoDos(params);
			break;
	
		default:
			consola.warn("Unmatching file content.");
			break;
	};

};

function listenForChanges() {
		consola.start("Listening to input file changes..");
		fs.watch(inputFilePath, (eventType, filename) => {
			if (eventType === "change") {
					setTimeout(() => {
					// Leer el contenido del archivo .txt
						fs.promises
							.readFile(inputFilePath, "utf-8")
							.then((content) => {
								content = content?.trim();
								if (content?.length) {
									consola.start("File changes detected...");
									processMethod(content);
								};
							})
							.catch((err) => {
								consola.error(new Error("Could not read file:"));
								console.error(err);
							});
					}, 1000);
				}
		});
};

async function startApp () {

	const confirmed = await consola.prompt("Start application?", {
		type: "confirm",
	});
	if (confirmed) {
		cleanFile('input');
		cleanFile('output')
		listenForChanges()
	}
};

startApp();