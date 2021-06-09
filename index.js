require('dotenv').config()
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, dbHost, dbName, dbPassword, dbPort, dbUsername } = require('./config.json');
const cron = require('node-cron');
const { execute } = require('./events/guildMemberAdd');
const faction = require('./functions/faction');
const { nwc } = require('./functions/nwc');
const stockmarket = require('./functions/stockmarket');
const { info } = require('console');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
var lastRespect = "0";
var RespectChange = "0";
var mysql = require('mysql');
var datetime = new Date();

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}



client.once('ready', () => {
     console.log('Ribot is online!');
     client.user.setPresence({ activity: { name: 'Monitoring Plebs' }, status: 'active' })
     faction.getRespect().then(respect => {
      respectchange = respect-lastRespect;
      lastRespect=respect;
  })
 });

 client.on('message',  message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
   
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
         || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    if (command.guildOnly && message.channel.type === 'dm') {
      return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.permissions) {
      const authorPerms = message.channel.permissionsFor(message.author);
	    if (!authorPerms || !authorPerms.has(command.permissions)) {
 		      return message.reply('You can not do this!');
 	    }
    }

    if (command.args && !args.length) {
      		let reply = `You didn't provide any arguments, ${message.author}!`;
      
      		if (command.usage) {
      			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
      		}
      
      		return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
    }

   });

   cron.schedule('0 0 * * *', () => {
    faction.getRespect().then(respect => {
      respectchange = respect-lastRespect;
      const embed = new Discord.MessageEmbed()
          .setColor(`#0099ff`)
          .setTitle(`Riot has ${nwc(respect)} respect, gaining respect ${nwc(respectchange)} today.`)
          .setDescription(`It's 00:00 TCT - Torn's Reset Time`)
          .setURL(`https://www.torn.com/factions.php?step=profile&ID=41419#/`) 
      client.channels.cache.get("495629631513296896").send(embed);
      lastRespect=respect;
  })
   }, {
    scheduled: true,
    timezone: "Universal"
  });

  cron.schedule('* * * * *', () => {
    stockmarket.getInfo().then(Info => {
      const embed = new Discord.MessageEmbed()
          .setColor(`#0099ff`)
          .setTitle(`${Info.stocks[1].name}`)
          .addFields(
            { name: 'Current Price', value: `$${nwc(Info.stocks[1].current_price)}`},
            { name: 'Market Cap', value: `$${nwc(Info.stocks[1].market_cap)}`},
            { name: 'Total Shares', value: `${nwc(Info.stocks[1].total_shares)}`},
            )
      //client.channels.cache.get("814495888243294258").send(embed);

      var sql = `INSERT INTO TSB (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[1].current_price}', '${Info.stocks[1].market_cap}', '${Info.stocks[1].total_shares}');`;
      sql += `INSERT INTO TCB (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[2].current_price}', '${Info.stocks[2].market_cap}', '${Info.stocks[2].total_shares}');`;
      con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result: " + result);
  });

  })
   }, {
    scheduled: true,
    timezone: "Universal"
  });

client.login(token);