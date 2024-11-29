import axios from 'axios';
import consola from 'consola';
import fs from 'fs';
import { CONFIG } from "../config.js";

export const downloadWSDL = async () => {
	try {

		const { SOAP_USER, SOAP_PASSWORD, SOAP_URL } = CONFIG;

		console.log(CONFIG);

		const response = await axios.get(SOAP_URL, {
			auth: {
				username: SOAP_USER,
				password: SOAP_PASSWORD
			}
		});

		fs.writeFileSync('service.wsdl', response.data);
		consola.success('Archivo WSDL guardado localmente.');

	} catch (error) {
		consola.error('Error al obtener el archivo WSDL:', error.message);
	}
}