const fetch = require('node-fetch');
const Discord = require('discord.js');
const { prefix, api_key } = require('../config.json');

module.exports = {

    nwc: function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
};