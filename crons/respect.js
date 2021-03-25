const fetch = require('node-fetch');
const Discord = require('discord.js');
const { prefix, api_key } = require('../../config.json');

function respect(faction) {

    let url = `https://api.torn.com/faction/?selections=&key=${api_key}`;
    let channel = client.channels.cache.get('495629631513296896');

    console.log('running a task every minute');

    fetch(url)
        .then(res => res.json())
        .then(body => {

            let messageEmbed = new Discord.MessageEmbed()
            .setColor('#008000')
            .setTitle(`${faction} Current Respect`)
            // .setURL(`https://www.torn.com/loader.php?sid=attackLog&ID=${body.attacks[id].code}`)
            .setDescription(`Respect: ${nwc(body.respect)}`)

            channel.send(messageEmbed)

        });

}