const fetch = require('node-fetch');
const Discord = require('discord.js');
const { prefix, api_key } = require('../../config.json');
module.exports = {
	name: 'profile',
	description: 'Returns a discord users torn profile if verified',
	cooldown: 5,
	async execute(message, args) {

            var tornID = "";
            var query = "";

            if (!message.mentions.users.size) {
                  query = message.author.id;
            }
            else {
                  query = message.mentions.members.first().id;
            }

            const request = `https://api.torn.com/user/${query}?selections=discord&key=${api_key}`;

            await fetch(request)
            .then(res => res.json())
            .then(res => {
                  tornID = res.discord.userID;
            })

            if (!tornID){
                  const embed = new Discord.MessageEmbed()
                        .setColor('#FF0000')
                        .setTitle(`Tagged user is not verified on Torn official Discord.`)
                        .setURL('https://www.torn.com/discord')
                        .setImage('https://media1.tenor.com/images/b9761b2a3fa6f830ddcafc4ee5629527/tenor.gif')
                        .setFooter(` ${prefix}profile command`, );
                        
                  return message.channel.send(embed);
            }

            const profileRequest = `https://api.torn.com/user/${tornID}?selections=profile&key=${api_key}`;

            await fetch(profileRequest)
            .then(res => res.json())
            .then(res => {
                  var StatusColor = '#808080';

                  if(res.status.color == 'green') {
                        StatusColor = '#008000';
                  }
                  else if(res.status.color == 'blue') {
                        StatusColor = '#0000FF';
                  }
                  else if(res.status.color == 'red') {
                        StatusColor = '#FF0000';
                  }
                  
                  const embed = new Discord.MessageEmbed()
                        .setColor(StatusColor)
                        .setTitle(`${res.name} [${res.player_id}]`)
                        .setDescription(`Level ${res.level}, ${res.rank} of ${res.faction.faction_name}.`)
                        .setURL(`https://www.torn.com/profiles.php?XID=${tornID}`)
                        .addFields(
                        { name: 'Life', value: `${res.life.current}/${res.life.maximum}`, inline: true },
		            { name: 'Status', value: `${res.status.description} ${res.status.details}`, inline: true },
                        { name: 'Faction', value: `${res.faction.position} of [${res.faction.faction_name}](https://www.torn.com/factions.php?step=profile&userID=${tornID}#/) for ${res.faction.days_in_faction} days.`  },
                        { name: 'Company', value: `${res.job.position} of [${res.job.company_name}](https://www.torn.com/joblist.php#/p=corpinfo&userID=${tornID}).` },
                        { name: 'Links', value: `[Attack](https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${tornID}) | [Bounty](https://www.torn.com/bounties.php?p=add&XID=${tornID}) | [Mail](https://www.torn.com/messages.php#/p=compose&XID=${tornID}) | [Send Cash](https://www.torn.com/sendcash.php#/XID=${tornID}) | [Trade](https://www.torn.com/trade.php#step=start&userID=${tornID})`},
                        )
                        .setTimestamp()
                        .setFooter(` ${prefix}profile command`, );
                        
                  message.channel.send(embed);
            })


      },
}; 