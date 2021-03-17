const fetch = require('node-fetch');
module.exports = {
	name: 'cat',
	description: 'Random cat',
	cooldown: 5,
	async execute(message) {
    	fetch('https://aws.random.cat/meow').then(response => response.json());
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());

		message.channel.send(file);
	},
};