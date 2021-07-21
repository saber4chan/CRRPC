const { loadEvents } = require('./utils/loader.js');
const { Client } = require('discord-rpc');
const client = new Client({
	transport: 'ipc'
});
const chalk = require('chalk');

client.config = require('./config.js');

loadEvents(client);

client.login({
	clientId: client.config.SECRETS.CLIENT_ID
}).catch(error => {
	if (error.message === 'RPC_CONNECTION_TIMEOUT') {
		console.log(chalk.blueBright('[Discord] ') + chalk.redBright('An error has occurred.\n') + chalk.red(`> ERROR: ${error}`));
		process.exit();
	};
});