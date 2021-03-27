const fetch = require('node-fetch');
const Discord = require('discord.js');
const { prefix, api_key } = require('../config.json');

module.exports = {

    async getRespect (client) {
    const url = `https://api.torn.com/faction/?selections=&key=${api_key}`;
    const channel = client.channels.cache.find(channel => channel.id === "814495888243294258");
    var respect = "";

    await fetch(url)
            .then(res => res.json())
            .then(res => {
                  respect = res.respect;
            })

        channel.send(`Riot's Respect: ${respect}`)
    
    },

}