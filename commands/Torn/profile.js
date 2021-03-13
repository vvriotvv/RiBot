const fetch = require('node-fetch');
const Discord = require('discord.js');
const { api_key } = require('../../config.json');
module.exports = {
	name: 'profile',
	description: 'Returns a discord users torn profile if verified',
	cooldown: 5,
	async execute(message, args) {
            const query = args;
            const request = `https://api.torn.com/user/?selections=${query[0]}&key=${api_key}`;
            console.log(request);

            if (!args.length) {
                  return message.channel.send('You need to supply a search term!');
            }

            await fetch(request)
            .then(res => res.json())
            .then(res => {

                  const embed = new Discord.MessageEmbed()
                        .setColor('#EFFF00')
                        .setTitle(`${res.name} [${res.player_id}]`)
                        .addFields(
                        { name: 'Level', value: `${res.level}`},
                        { name: 'Gender', value: res.gender  },
                        { name: 'Status', value: `${res.status.description} ${res.status.details}` },
                  );
                  message.channel.send(embed);

            })


      },
}; 