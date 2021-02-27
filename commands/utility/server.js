module.exports = {
	name: 'server',
	description: 'Provides information on the server',
	guildOnly: true,
	execute(message, args) {
		message.channel.send(`This server's name is: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nCreation date: ${message.guild.createdAt}\nServer region: ${message.guild.region}`);
	},
};