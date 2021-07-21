const fetch = require('node-fetch');
const chalk = require('chalk');

const rpc = async function setActivity(client) {
	fetch(`https://api.clashroyale.com/v1/players/%23${client.config.USER_SETTINGS.CLASHROYALE_TAG.replace('#', '')}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${client.config.SECRETS.CLASHROYALE_API_TOKEN}`,
			'Content-Type': 'application/json'
		}
	}).then(async res => {
		if (!res.ok) {
			const error = await res.text()

			if (error.includes(`{'message': 'API at maximum capacity, request throttled.'}`)) {
				console.log(chalk.cyan('[Clash Royale API] ') + chalk.redBright('The Clash Royale API is at maximum capacity. Try again later!\n') + chalk.red(`> ERROR: ${error}`));
				process.exit();

			} else if (error.includes(`{'reason':'accessDenied','message':'Invalid authorization'}`)) {
				console.log(chalk.cyan('[Clash Royale API] ') + chalk.redBright('You provided an invalid API key. Check if it is correct in the config file, or go to http://developer.clashroyale.com to create a new one.\n') + chalk.red(`> ERROR: ${error}`));
				process.exit();

			} else if (error.includes(`{'reason':'accessDenied.invalidIp','message':'Invalid authorization: API key does not allow access from IP`)) {
				console.log(chalk.cyan('[Clash Royale API] ') + chalk.redBright('The API Key does not allow access for your IP. Check if your IP is correct by going to https://nordvpn.com/what-is-my-ip\n') + chalk.red(`> ERROR: ${error}`));
				process.exit();

			} else if (error.includes(`{'reason':'notFound'}`)) {
				console.log(chalk.cyan('[Clash Royale API] ') + chalk.redBright('You provided an invalid player tag. Check if it is correct in the config file.\n') + chalk.red(`> ERROR: ${error}`));
				process.exit();

			} else {
				console.log(chalk.cyan('[Clash Royale API] ') + chalk.redBright('An error has occurred. Report this at https://github.com/Fastxyz/CRRPC/issues\n') + chalk.red(`> ERROR: ${error}`));
				process.exit();
			};
		};

		const player = await res.json();

		client.request('SET_ACTIVITY', {
			pid: process.pid,
			activity: {
				details: `🏆 Trophies: ${player.trophies}/${player.bestTrophies} • ⭐ Level: ${player.expLevel}`,
				state: `⚔️ Battles: ${player.battleCount} • 🥊 Wins: ${player.wins} • 👑 3 Crown Wins: ${player.threeCrownWins}`,
			timestamps: {
				start: Date.now(),
			},
			assets: {
				large_image: 'logo',
				large_text: 'CRRPC v1.0.0',
				small_image: 'player',
				small_text: `${player.name} (${player.tag})`
			},
			buttons: [
				{
					label: 'GitHub',
					url: 'https://github.com/Fastxyz/CRRPC'
				}
			]
		}
		}).catch((error) => {
			if (error.message === 'RPC_CONNECTION_TIMEOUT') {
				console.error(chalk.hex('#CD0000')('The RPC could not connect to Discord. Please try again later!'));
				process.exit();
			};
		});
	}).catch(error => {
		console.log(error.message);
		process.exit();
	});
};

module.exports = {
	rpc
};