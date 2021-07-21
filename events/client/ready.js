const chalk = require('chalk');
const { rpc } = require('../../rpc/rpc.js');

module.exports.run = (client) => {
	rpc(client);

	setInterval(() => {
		rpc(client);
	}, 60000);

	console.log(chalk.blueBright('[Discord] ') + chalk.greenBright('RPC connected!'));
};