const fetch = require('node-fetch');
const Discord = require('discord.js');
const { prefix, api_key } = require('../config.json');
module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
		var inFac = new Boolean(false);
		var tornID = "";
        var faction = "";
        var query = member.user.id;
		const channel = member.guild.channels.cache.find(channel => channel.id === "750303757027246182");
        const request = `https://api.torn.com/user/${query}?selections=discord&key=${api_key}`;
        const verifiedRole = member.guild.roles.cache.find(role => role.name == "Verified");
        const facRole = member.guild.roles.cache.find(role => role.name == "Riot Member");
        const friendRole = member.guild.roles.cache.find(role => role.name == "Friend of Riot");
		const role = member.guild.roles.cache.find(role => role.name == "Newcomer");
		
        console.log(`Welcome to the server ${member.user.tag}`);
		member.roles.add(role).catch(console.error);
		console.log(request);

		await fetch(request)
        .then(res => res.json())
        .then(res => {
              tornID = res.discord.userID;
        })

		if (!tornID){
			const embed = new Discord.MessageEmbed()
				  .setColor('#FF0000')
				  .setTitle(`Please verify on Torn's official Discord server.`)
				  .setURL('https://www.torn.com/discord');
				  
			//return member.guild.channels(channel).send(embed)
			return channel.send(embed);
	  	}

		const profileRequest = `https://api.torn.com/user/${tornID}?selections=profile&key=${api_key}`;

        await fetch(profileRequest)
         .then(res => res.json())
         .then(res => {
                  faction = res.faction.faction_name;
      	})

		if(faction == "Riot") {
			inFac = true;
            member.roles.add(facRole);
      	} else {
			inFac = false;
            member.roles.add(friendRole);
      	}

      	if(member.roles.cache.has(verifiedRole.id)){
            console.log("Member already verified");
            member.roles.remove(role);
            return channel.send(`${member.user.tag} already has ${verifiedRole.name} role`);
        }

		member.roles.add(verifiedRole);
        member.roles.remove(role);

        console.log(`added ${member.user.tag} to ${verifiedRole.name} `);

		if(inFac){
			return channel.send(`Welcome to the server ${member.user.tag} \nYou have been verified and given the role ${facRole.name} \nTotal members: ${member.guild.memberCount}`)
		} else {
			return channel.send(`Welcome to the server ${member.user.tag} \nYou have been verified and given the role ${friendRole.name}  \nTotal members: ${member.guild.memberCount}`)
		}
		
	},
};