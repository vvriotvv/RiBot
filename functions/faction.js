const fetch = require('node-fetch');
const Discord = require('discord.js');
const { prefix, api_key } = require('../config.json');

module.exports = {

    async getRespect (client) {
    const url = `https://api.torn.com/faction/?selections=&key=${api_key}`;
    var respect = "";

    await fetch(url)
            .then(res => res.json())
            .then(res => {
                  respect = res.respect;
            })

        return(respect);
    },

}