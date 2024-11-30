import fs from 'node:fs';
import consola from 'consola';

export const Log = (message, mod, type='error') => {
	const d = new Date();
	const date = `${d.getDate()}${d.getMonth()}${d.getFullYear()}`;
	const hour =  `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
	message = `${message} | ${mod} | ${hour}\n`;
	consola.info(`Log registered: ${message}`);
	fs.writeFile(`./logs/log-${type}-${date}.log`, message, { flag: 'a+' }, err => {
		if (err)
			console.error('Error escribiendo Log', err.message);
	});
};
