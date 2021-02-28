const fetch = require('node-fetch');
const Discord = require('discord.js');
const { api_key } = require('../../config.json');
module.exports = {
	name: 'profile',
	description: 'Torn Profile',
	cooldown: 5,
	async execute(message, args) {
		const querystring = require('querystring');
		const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
  			if (!args.length) {
   				return message.channel.send('You need to supply a search term!');
 			}

		const query = querystring.stringify({ term: args.join(' ') });

  		const { list } = await fetch(`https://api.torn.com/torn/?selections=${query}&key=${api_key}`).then(response => response.json());

		    if (!list.length) {
				return message.channel.send(`No results found for **${args.join(' ')}**.`);
		    }
		
			const [answer] = list;

			const embed = new Discord.MessageEmbed()
				.setColor('#EFFF00')
				.setTitle(answer.word)
				.setURL(answer.permalink)
				.addFields(
					{ name: 'ID', value: trim(answer.player_id, 1024) },
					{ name: 'Name', value: trim(answer.name, 1024) },
					{ name: 'Level', value: trim(answer.level, 1024) },
				);
			message.channel.send(embed);
	},
};