const { prefix } = require('../config.json');
module.exports = {
	name: 'message',
	execute(message) {
		if (!message.content.startsWith(prefix) || message.author.bot) return;
		console.log(`${message.author.tag} in #${message.channel.name} sent: ${message.content}`);
	},
};