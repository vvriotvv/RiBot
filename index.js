require('dotenv').config()
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, dbHost, dbName, dbPassword, dbPort, dbUsername, WhaleBuyRoleID, WhaleSellRoleID } = require('./config.json');
const cron = require('node-cron');
const { execute } = require('./events/guildMemberAdd');
const faction = require('./functions/faction');
const { nwc } = require('./functions/nwc');
const stockmarket = require('./functions/stockmarket');
const { info, Console } = require('console');
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
var counter = 14;
var priceMinuteThreshold = 0.4;
var price15MinuteThreshold = 0.75;
var mcMinThreshold = 75000000000;
var stockAlert = "";

//var stockTables = ["TSB", "TCB", "SYS", "LAG", "IOU", "GRN", "THS", "YAZ", "TCT", "CNC", "MSG", "TMI", "TCP", "IIL", "FHG", "SYM", "LSC", "PRN", "EWM", "TCM", "ELT", "HRG", "TGP", "WSU", "IST", "BAG", "EVL", "MCS", "WLT", "TCC"]
var stockTables = {
  "TSB":{
    "acronym": "TSB",
    "roleID": "602929154735996929",
    "image": "https://www.torn.com/images/v2/stock-market/logos/TSB.svg"
  },
  "TCB":{
    "acronym": "TCB",
    "roleID": "602928542946164739",
    "image": "https://www.torn.com/images/v2/stock-market/logos/TCB.svg"
  },
  "SYS":{
    "acronym": "SYS",
    "roleID": "602928490836131900",
    "image": "https://www.torn.com/images/v2/stock-market/logos/SYS.svg"
  },
  "LAG":{
    "acronym": "LAG",
    "roleID": "602928403787677740",
    "image": "https://www.torn.com/images/v2/stock-market/logos/LAG.svg"
  },
  "IOU":{
    "acronym": "IOU",
    "roleID": "602928000274530328",
    "image": "https://www.torn.com/images/v2/stock-market/logos/IOU.svg"
  },
  "GRN":{
    "acronym": "GRN",
    "roleID": "602927706631307286",
    "image": "https://www.torn.com/images/v2/stock-market/logos/GRN.svg"
  },
  "THS":{
    "acronym": "THS",
    "roleID": "602928868323491903",
    "image": "https://www.torn.com/images/v2/stock-market/logos/THS.svg"
  },
  "YAZ":{
    "acronym": "YAZ",
    "roleID": "602929288127184898",
    "image": "https://www.torn.com/images/v2/stock-market/logos/YAZ.svg"
  },
  "TCT":{
    "acronym": "TCT",
    "roleID": "602929011693322241",
    "image": "https://www.torn.com/images/v2/stock-market/logos/TCT.svg"
  },
  "CNC":{
    "acronym": "CNC",
    "roleID": "602927156644937758",
    "image": "https://www.torn.com/images/v2/stock-market/logos/CNC.svg"
  },
  "MSG":{
    "acronym": "MSG",
    "roleID": "602928241019453452",
    "image": "https://www.torn.com/images/v2/stock-market/logos/MSG.svg"
  },
  "TMI":{
    "acronym": "TMI",
    "roleID": "602929118413193229",
    "image": "https://www.torn.com/images/v2/stock-market/logos/TMI.svg"
  },
  "TCP":{
    "acronym": "TCP",
    "roleID": "602928962473295922",
    "image": "https://www.torn.com/images/v2/stock-market/logos/TCP.svg"
  },
  "IIL":{
    "acronym": "IIL",
    "roleID": "602927790538489907",
    "image": "https://www.torn.com/images/v2/stock-market/logos/IIL.svg"
  },
  "FHG":{
    "acronym": "FHG",
    "roleID": "602927348253196319",
    "image": "https://www.torn.com/images/v2/stock-market/logos/FHG.svg"
  },
  "SYM":{
    "acronym": "SYM",
    "roleID": "602928441867632661",
    "image": "https://www.torn.com/images/v2/stock-market/logos/SYM.svg"
  },
  "LSC":{
    "acronym": "LSC",
    "roleID": "602928094885576830",
    "image": "https://www.torn.com/images/v2/stock-market/logos/LSC.svg"
  },
  "PRN":{
    "acronym": "PRN",
    "roleID": "602928287416582165",
    "image": "https://www.torn.com/images/v2/stock-market/logos/PRN.svg"
  },
  "EWM":{
    "acronym": "EWM",
    "roleID": "602927302871089164",
    "image": "https://www.torn.com/images/v2/stock-market/logos/EWM.svg"
  },
  "TCM":{
    "acronym": "TCM",
    "roleID": "602928918068199445",
    "image": "https://www.torn.com/images/v2/stock-market/logos/TCM.svg"
  },
  "ELT":{
    "acronym": "ELT",
    "roleID": "602927215310536707",
    "image": "https://www.torn.com/images/v2/stock-market/logos/ELT.svg"
  },
  "HRG":{
    "acronym": "HRG",
    "roleID": "602927743838978088",
    "image": "https://www.torn.com/images/v2/stock-market/logos/HRG.svg"
  },
  "TGP":{
    "acronym": "TGP",
    "roleID": "602929063455227933",
    "image": "https://www.torn.com/images/v2/stock-market/logos/TGP.svg"
  },
  "WSU":{
    "acronym": "WSU",
    "roleID": "602929250458140693",
    "image": "https://www.torn.com/images/v2/stock-market/logos/WSU.svg"
  },
  "IST":{
    "acronym": "IST",
    "roleID": "602928049398480917",
    "image": "https://www.torn.com/images/v2/stock-market/logos/IST.svg"
  },
  "BAG":{
    "acronym": "BAG",
    "roleID": "602927099774369857",
    "image": "https://www.torn.com/images/v2/stock-market/logos/BAG.svg"
  },
  "EVL":{
    "acronym": "EVL",
    "roleID": "603131459569713197",
    "image": "https://www.torn.com/images/v2/stock-market/logos/EVL.svg"
  },
  "MCS":{
    "acronym": "MCS",
    "roleID": "602928136845394086",
    "image": "https://www.torn.com/images/v2/stock-market/logos/MCS.svg"
  },
  "WLT":{
    "acronym": "WLT",
    "roleID": "602924264634712083",
    "image": "https://www.torn.com/images/v2/stock-market/logos/WLT.svg"
  },
  "TCC":{
    "acronym": "TCC",
    "roleID": "602787410182668314",
    "image": "https://www.torn.com/images/v2/stock-market/logos/TCC.svg"
  },
}


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

var con = mysql.createConnection({
  host: dbHost,
  user: dbUsername,
  password: dbPassword,
  port: dbPort,
  database: dbName,
  multipleStatements: true
});

con.connect(function(err) {
  if (err) throw err;
  con.query("show tables;", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});

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
    setTimeout(function(){
    stockmarket.getInfo().then(Info => {
      // const embed = new Discord.MessageEmbed()
      //     .setColor(`#0099ff`)
      //     .setTitle(`${Info.stocks[1].name}`)
      //     .addFields(
      //       { name: 'Current Price', value: `$${nwc(Info.stocks[1].current_price)}`},
      //       { name: 'Market Cap', value: `${nwc(Info.stocks[1].market_cap)}`},
      //       { name: 'Total Shares', value: `${nwc(Info.stocks[1].total_shares)}`},
      //       )
      //client.channels.cache.get("814495888243294258").send(embed);
      //#region "SQL compiler"
      var sql = `INSERT INTO TSB (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[1].current_price}', '${Info.stocks[1].market_cap}', '${Info.stocks[1].total_shares}');`;
      sql += `INSERT INTO TCB (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[2].current_price}', '${Info.stocks[2].market_cap}', '${Info.stocks[2].total_shares}');`;
      sql += `INSERT INTO SYS (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[3].current_price}', '${Info.stocks[3].market_cap}', '${Info.stocks[3].total_shares}');`;
      sql += `INSERT INTO \`LAG\` (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[4].current_price}', '${Info.stocks[4].market_cap}', '${Info.stocks[4].total_shares}');`;
      sql += `INSERT INTO IOU (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[5].current_price}', '${Info.stocks[5].market_cap}', '${Info.stocks[5].total_shares}');`;
      sql += `INSERT INTO GRN (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[6].current_price}', '${Info.stocks[6].market_cap}', '${Info.stocks[6].total_shares}');`;
      sql += `INSERT INTO THS (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[7].current_price}', '${Info.stocks[7].market_cap}', '${Info.stocks[7].total_shares}');`;
      sql += `INSERT INTO YAZ (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[8].current_price}', '${Info.stocks[8].market_cap}', '${Info.stocks[8].total_shares}');`;
      sql += `INSERT INTO TCT (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[9].current_price}', '${Info.stocks[9].market_cap}', '${Info.stocks[9].total_shares}');`;
      sql += `INSERT INTO CNC (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[10].current_price}', '${Info.stocks[10].market_cap}', '${Info.stocks[10].total_shares}');`;
      sql += `INSERT INTO MSG (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[11].current_price}', '${Info.stocks[11].market_cap}', '${Info.stocks[11].total_shares}');`;
      sql += `INSERT INTO TMI (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[12].current_price}', '${Info.stocks[12].market_cap}', '${Info.stocks[12].total_shares}');`;
      sql += `INSERT INTO TCP (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[13].current_price}', '${Info.stocks[13].market_cap}', '${Info.stocks[13].total_shares}');`;
      sql += `INSERT INTO IIL (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[14].current_price}', '${Info.stocks[14].market_cap}', '${Info.stocks[14].total_shares}');`;
      sql += `INSERT INTO FHG (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[15].current_price}', '${Info.stocks[15].market_cap}', '${Info.stocks[15].total_shares}');`;
      sql += `INSERT INTO SYM (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[16].current_price}', '${Info.stocks[16].market_cap}', '${Info.stocks[16].total_shares}');`;
      sql += `INSERT INTO LSC (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[17].current_price}', '${Info.stocks[17].market_cap}', '${Info.stocks[17].total_shares}');`;
      sql += `INSERT INTO PRN (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[18].current_price}', '${Info.stocks[18].market_cap}', '${Info.stocks[18].total_shares}');`;
      sql += `INSERT INTO EWM (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[19].current_price}', '${Info.stocks[19].market_cap}', '${Info.stocks[19].total_shares}');`;
      sql += `INSERT INTO TCM (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[20].current_price}', '${Info.stocks[20].market_cap}', '${Info.stocks[20].total_shares}');`;
      sql += `INSERT INTO ELT (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[21].current_price}', '${Info.stocks[21].market_cap}', '${Info.stocks[21].total_shares}');`;
      sql += `INSERT INTO HRG (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[22].current_price}', '${Info.stocks[22].market_cap}', '${Info.stocks[22].total_shares}');`;
      sql += `INSERT INTO TGP (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[23].current_price}', '${Info.stocks[23].market_cap}', '${Info.stocks[23].total_shares}');`;
      sql += `INSERT INTO WSU (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[25].current_price}', '${Info.stocks[25].market_cap}', '${Info.stocks[25].total_shares}');`;
      sql += `INSERT INTO IST (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[26].current_price}', '${Info.stocks[26].market_cap}', '${Info.stocks[26].total_shares}');`;
      sql += `INSERT INTO BAG (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[27].current_price}', '${Info.stocks[27].market_cap}', '${Info.stocks[27].total_shares}');`;
      sql += `INSERT INTO EVL (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[28].current_price}', '${Info.stocks[28].market_cap}', '${Info.stocks[28].total_shares}');`;
      sql += `INSERT INTO MCS (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[29].current_price}', '${Info.stocks[29].market_cap}', '${Info.stocks[29].total_shares}');`;
      sql += `INSERT INTO WLT (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[30].current_price}', '${Info.stocks[30].market_cap}', '${Info.stocks[30].total_shares}');`;
      sql += `INSERT INTO TCC (Price, MarketCap, TotalShares) VALUES ('${Info.stocks[31].current_price}', '${Info.stocks[31].market_cap}', '${Info.stocks[31].total_shares}')`;
      //#endregion
      con.query(sql, function (err, result) {
      if (err) throw err;
      //console.log("Result: " + result);
  });
  })
    },5000);
   }, {
    scheduled: true,
    timezone: "Universal"
  });

  cron.schedule('* * * * *', () => {
    counter++;
    console.log(stockAlert);
    setTimeout(function(){
      Object.values(stockTables).forEach(stock => {
      //console.log(stock);
      var sql = `SELECT * FROM ${stock.acronym} ORDER BY ID DESC LIMIT 100;`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        //Price increase in last minute
        if (result[0].Price > result[1].Price) 
        {
          var change = ((result[0].Price - result[1].Price) / result[1].Price * 100)
          if (change > priceMinuteThreshold) 
          {
            console.log(`<@&${stock.roleID}> Price has increased by: ${change.toFixed(2)}% in the last minute`);
            client.channels.cache.get("598138845380476948").send(`<@&${stock.roleID}> Price has increased by: ${change.toFixed(2)}% in the last minute`);
            stockAlert += `<@&${stock.roleID}> Price has increased by: ${change.toFixed(2)}% in the last minute\n`;
          }
        } 
        //Price increase in last 15 minutes
        if (result[0].Price > result[15].Price)  
        {
          var change15 = ((result[0].Price - result[15].Price) / result[15].Price * 100)
          if (counter >= 14 && change15 > price15MinuteThreshold) 
          {
            console.log(`<@&${stock.roleID}> Price has increased by: ${change15.toFixed(2)}% in the last 15 minutes`);
            client.channels.cache.get("598138845380476948").send(`<@&${stock.roleID}> Price has increased by: ${change15.toFixed(2)}% in the last 15 minutes`);
            stockAlert += `<@&${stock.roleID}> Price has increased by: ${change15.toFixed(2)}% in the last 15 minutes\n`;
          }
        }
        //Price decrease in last minute
        if (result[0].Price < result[1].Price)
        {
          var change = ((result[1].Price - result[0].Price) / result[1].Price * 100)
          if (change > priceMinuteThreshold) 
          {
            console.log(`<@&${stock.roleID}> Price has decreased by: ${change.toFixed(2)}% in the last minute`);
            client.channels.cache.get("598138845380476948").send(`<@&${stock.roleID}> Price has decreased by: ${change.toFixed(2)}% in the last minute`);
            stockAlert += `<@&${stock.roleID}> Price has decreased by: ${change.toFixed(2)}% in the last minute\n`;
          }
        }
        //Price decrease in last 15 minutes
        if (result[0].Price < result[15].Price) 
        {
          var change15 = ((result[15].Price - result[0].Price) / result[15].Price * 100)
          change15 = change15*-1;
          if (counter >=14 && change15 > price15MinuteThreshold) 
          {
            console.log(`<@&${stock.roleID}> Price has decreased by: ${change15.toFixed(2)}% in the last 15 minutes`);
            client.channels.cache.get("598138845380476948").send(`<@&${stock.roleID}> Price has decreased by: ${change15.toFixed(2)}% in the last 15 minutes`);
            stockAlert += `<@&${stock.roleID}> Price has decreased by: ${change15.toFixed(2)}% in the last 15 minutes\n`;
          }
        }
        //MarketCap increase in last minute
        if (result[0].MarketCap >= result[1].MarketCap+mcMinThreshold) 
        {
          var change = result[0].MarketCap-result[1].MarketCap;
          client.channels.cache.get("598138845380476948").send(`<@&${WhaleBuyRoleID}> A whale has bought $${nwc(change)} worth of <@&${stock.roleID}>`);
          stockAlert += `<@&${WhaleBuyRoleID}> A whale has bought $${nwc(change)} worth of <@&${stock.roleID}>\n`;
        }
        //MarketCap decrease in last minute
        if (result[0].MarketCap <= result[1].MarketCap-mcMinThreshold) 
        {
          var change = result[1].MarketCap-result[0].MarketCap;
          client.channels.cache.get("598138845380476948").send(`<@&${WhaleSellRoleID}> A whale has sold $${nwc(change)} worth of <@&${stock.roleID}>`);
          stockAlert += `<@&${WhaleSellRoleID}> A whale has sold $${nwc(change)} worth of <@&${stock.roleID}>\n`;
          
        }
  });
  });  
        console.log(stockAlert);
        if (stockAlert) 
        {
          client.channels.cache.get("814495888243294258").send(stockAlert);
          stockAlert = "";
        }
  if (counter == 15) {counter=0};
    console.log(counter);
  }, 10000);
  }, 
  {
    scheduled: true,
    timezone: "Universal"
  }); 

client.login(token); 