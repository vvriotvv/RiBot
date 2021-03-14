const fetch = require('node-fetch');
const Discord = require('discord.js');
const { prefix, api_key } = require('../config.json');
module.exports = {
	name: 'guildMemberAdd',
	execute(member) {
		const role = member.guild.roles.cache.find(role => role.name == "Newcomer");
        member.roles.add(role).catch(console.error);

        console.log(`Welcome to the server ${member.user.tag}`);
	},
};