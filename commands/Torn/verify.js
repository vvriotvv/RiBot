const fetch = require('node-fetch');
const Discord = require('discord.js');
const { prefix, api_key } = require('../../config.json');
module.exports = {
	name: 'verify',
	description: 'Verifies a user',
	async execute(message) {

        var tornID = "";
        var faction = "";
        var query = message.author.id;
        const request = `https://api.torn.com/user/${query}?selections=discord&key=${api_key}`;
        const role = message.channel.guild.roles.cache.find(role => role.name == "Verified");
        const roleTwo = message.channel.guild.roles.cache.find(role => role.name == "Newcomer");
        const facRole = message.channel.guild.roles.cache.find(role => role.name == "Riot Member");
        const friendRole = message.channel.guild.roles.cache.find(role => role.name == "Friend of Riot");
        

        await fetch(request)
        .then(res => res.json())
        .then(res => {
              tornID = res.discord.userID;
        })

        if (!tornID){
              const embed = new Discord.MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle(`Please verify on Torn's official Discord server first.`)
                    .setURL('https://www.torn.com/discord')
                    .setFooter(` ${prefix}verify command`, );
                    
              return message.channel.send(embed); 
        }

        const profileRequest = `https://api.torn.com/user/${tornID}?selections=profile&key=${api_key}`;

        await fetch(profileRequest)
         .then(res => res.json())
         .then(res => {
                  faction = res.faction.faction_name;
      })

      if(faction == "Riot") {
            message.guild.member(message.author).roles.add(facRole);
      } else {
            message.guild.member(message.author).roles.add(friendRole);
      }

      if(message.member.roles.cache.has(role.id)){
            console.log("Member already verified");
            message.guild.member(message.author).roles.remove(roleTwo);
            return message.channel.send(`${message.member.user.tag} already has ${role.name} role`);
        }
      
        message.guild.member(message.author).roles.add(role);
        message.guild.member(message.author).roles.remove(roleTwo);
        message.channel.send(`added ${message.member.user.tag} to ${role.name} `);
        console.log(`added ${message.member.user.tag} to ${role.name} `);

  },
}; 