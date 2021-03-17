const Discord = require('discord.js');
module.exports = {
	name: 'kick',
	description: 'Kicks the tagged user',
	guildOnly: true,
	cooldown: 5,
	permissions: 'KICK_MEMBERS',
	execute(message, args) {

		if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Invalid Permissions")
		let User = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
		if (!User) return message.channel.send("Invalid User")
		if (User.hasPermission("BAN_MEMBERS")) return message.reply("Invalid Permissions")
		let banReason = args.join(" ").slice(22);
		if (!banReason) {
		  banReason = "None"
		}

		User.kick({reason: banReason})
	},
};