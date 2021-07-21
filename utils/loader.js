const { readdirSync } = require('fs');

const loadEvents = (client, dir = './events/') => {
	readdirSync(dir).forEach(dirs => {
		const events = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith('.js'));

		for (const file of events) {
			const event = require(`../${dir}/${dirs}/${file}`);
			const eventName = file.split('.')[0];

			event.file = event.file || file.replace('.js', '');

			client.on(eventName, event.run.bind(null, client));
		};
	});
};

module.exports = {
	loadEvents
};