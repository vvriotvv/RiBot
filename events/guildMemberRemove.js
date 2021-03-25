const { prefix } = require('../config.json');
module.exports = {
	name: 'guildMemberRemove',
	execute(member) {
        const channel = member.guild.channels.cache.find(channel => channel.id === "750303757027246182");

		return channel.send(`:negative_squared_cross_mark: ${member.user.tag} has departed from the server. \nTotal members: ${member.guild.memberCount}`)
	},
};