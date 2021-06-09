const fetch = require('node-fetch');
const Discord = require('discord.js');
const { prefix, api_key } = require('../config.json');

module.exports = {

    async getInfo (client) {
    const url = `https://api.torn.com/torn/?selections=stocks&key=${api_key}`;
    var Info = "";

    await fetch(url)
            .then(res => res.json())
            .then(res => {
                  Info = res;
            })
        return(Info);
        
    },

}