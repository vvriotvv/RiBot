module.exports = {
	name: 'dm',
	description: 'sends a direct message',
	guildOnly: true,
	cooldown: 5,
	execute(message, args) {
		let messageContent = message.content.replace(".dm", "Welcome to the server")
        message.member.send(messageContent)
	},
};