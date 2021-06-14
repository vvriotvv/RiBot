const fetch = require('node-fetch');
const Discord = require('discord.js');
const { nwc } = require('../../functions/nwc');
const { prefix, token, dbHost, dbName, dbPassword, dbPort, dbUsername, WhaleBuyRoleID, WhaleSellRoleID, api_key } = require('../../config.json');
var mysql = require('mysql');
module.exports = {
	name: 'stocks',
      aliases: ['stonks'],
	description: 'Returns Stock information',
	cooldown: 1,
	async execute(message, args) {

            var con = mysql.createConnection({
                  host: dbHost,
                  user: dbUsername,
                  password: dbPassword,
                  port: dbPort,
                  database: dbName,
                  multipleStatements: true
            });
            
            var args = args.toString().toUpperCase();
            var stockTables = [
                  { 
                    "name": "Torn & Shanghai Banking",
                    "acronym": "TSB",
                    "roleID": "602929154735996929",
                    "image": "https://i.imgur.com/WPQwAW8.png"
                  },
                  {
                    "name": "Torn City Investments",
                    "acronym": "TCB",
                    "roleID": "602928542946164739",
                    "image": "https://i.imgur.com/HG7B6o6.png"
                  },
                  {
                    "name": "Syscore MFG",
                    "acronym": "SYS",
                    "roleID": "602928490836131900",
                    "image": "https://i.imgur.com/qwJmX0B.png"
                  },
                  {
                    "name": "Legal Authorities Group",
                    "acronym": "LAG",
                    "roleID": "602928403787677740",
                    "image": "https://i.imgur.com/cDHrZHu.png"
                  },
                  {
                    "name": "Insured On Us",
                    "acronym": "IOU",
                    "roleID": "602928000274530328",
                    "image": "https://i.imgur.com/l6nwcfX.png"
                  },
                  {
                    "name": "Grain",
                    "acronym": "GRN",
                    "roleID": "602927706631307286",
                    "image": "https://i.imgur.com/Xy89HCH.png"
                  },
                  {
                    "name": "Torn City Health Service",
                    "acronym": "THS",
                    "roleID": "602928868323491903",
                    "image": "https://i.imgur.com/vJUieNi.png"
                  },
                  {
                    "name": "Yazoo",
                    "acronym": "YAZ",
                    "roleID": "602929288127184898",
                    "image": "https://i.imgur.com/uxXKDVy.png"
                  },
                  {
                    "name": "The Torn City Times",
                    "acronym": "TCT",
                    "roleID": "602929011693322241",
                    "image": "https://i.imgur.com/eSsrX6V.png"
                  },
                  {
                    "name": "Crude & Co",
                    "acronym": "CNC",
                    "roleID": "602927156644937758",
                    "image": "https://i.imgur.com/ZVgLcGD.png"
                  },
                  {
                    "name": "Messaging Inc.",
                    "acronym": "MSG",
                    "roleID": "602928241019453452",
                    "image": "https://i.imgur.com/0O3VGk7.png"
                  },
                  {
                    "name": "TC Music Industries",
                    "acronym": "TMI",
                    "roleID": "602929118413193229",
                    "image": "https://i.imgur.com/Q1KwdkV.png"
                  },
                  {
                    "name": "TC Media Productions",
                    "acronym": "TCP",
                    "roleID": "602928962473295922",
                    "image": "https://i.imgur.com/JWDXhua.png"
                  },
                  {
                    "name": "I Industries Ltd.",
                    "acronym": "IIL",
                    "roleID": "602927790538489907",
                    "image": "https://i.imgur.com/o2tG1Jt.png"
                  },
                  {
                    "name": "Feathery Hotels Group",
                    "acronym": "FHG",
                    "roleID": "602927348253196319",
                    "image": "https://i.imgur.com/TrBbTTt.png"
                  },
                  {
                    "name": "Symbiotic Ltd.",
                    "acronym": "SYM",
                    "roleID": "602928441867632661",
                    "image": "https://i.imgur.com/wHSVA5g.png"
                  },
                  {
                    "name": "Lucky Shots Casino",
                    "acronym": "LSC",
                    "roleID": "602928094885576830",
                    "image": "https://i.imgur.com/2IBf2te.png"
                  },
                  {
                    "name": "Performance Ribaldry",
                    "acronym": "PRN",
                    "roleID": "602928287416582165",
                    "image": "https://i.imgur.com/6B0FYOK.png"
                  },
                 {
                    "name": "Eaglewood Mercenary",
                    "acronym": "EWM",
                    "roleID": "602927302871089164",
                    "image": "https://i.imgur.com/PRQ87Ub.png"
                  },
                  {
                    "name": "Torn City Motors",
                    "acronym": "TCM",
                    "roleID": "602928918068199445",
                    "image": "https://i.imgur.com/CBRrYKK.png"
                  },
                  {
                    "name": "Empty Lunchbox Traders",
                    "acronym": "ELT",
                    "roleID": "602927215310536707",
                    "image": "https://i.imgur.com/Fih29CA.png"
                  },
                  {
                    "name": "Home Retail Group",
                    "acronym": "HRG",
                    "roleID": "602927743838978088",
                    "image": "https://i.imgur.com/7LGxnPZ.png"
                  },
                  {
                    "name": "Tell Group Plc.",
                    "acronym": "TGP",
                    "roleID": "602929063455227933",
                    "image": "https://i.imgur.com/DIdOyf8.png"
                  },
                  {
                    "name": "West Side University",
                    "acronym": "WSU",
                    "roleID": "602929250458140693",
                    "image": "https://i.imgur.com/VLoZx9u.png"
                  },
                  {
                    "name": "International School TC",
                    "acronym": "IST",
                    "roleID": "602928049398480917",
                    "image": "https://i.imgur.com/leUI4Tv.png"
                  },
                  {
                    "name": "Big Al's Gun Shop",
                    "acronym": "BAG",
                    "roleID": "602927099774369857",
                    "image": "https://i.imgur.com/vSyKCNg.png"
                  },
                  {
                    "name": "Evil Ducks Candy Corp",
                    "acronym": "EVL",
                    "roleID": "603131459569713197",
                    "image": "https://i.imgur.com/YJ24WUB.png"
                  },
                  {
                    "name": "Mc Smoogle Corp",
                    "acronym": "MCS",
                    "roleID": "602928136845394086",
                    "image": "https://i.imgur.com/Br8Pp0e.png"
                  },
                  {
                    "name": "Wind Lines Travel",
                    "acronym": "WLT",
                    "roleID": "602924264634712083",
                    "image": "https://i.imgur.com/gfAjTQx.png"
                  },
                  {
                    "name": "Torn City Clothing",
                    "acronym": "TCC",
                    "roleID": "602787410182668314",
                    "image": "https://i.imgur.com/KQuz3df.png"
                  },
            ];

                  var stock = stockTables.find( ({ acronym }) => acronym === args );
                  if (!stock) {
                        return message.channel.send("Invalid acronym, correct usage would be .stocks acronym");
                  } else {
                        var sql = `SELECT * FROM ${stock.acronym} ORDER BY ID DESC LIMIT 60;`;

                        con.query(sql, function (err, result) {

                              console.log(result);

                        const embed = new Discord.MessageEmbed()
                        .setThumbnail(`${stock.image}`)
                        .setColor("FFFFFF")
                        .setTitle(`${stock.name} (${stock.acronym})`)
                        .addFields(
                        { name: 'Current Price', value: `$${nwc(result[1].Price)}`},
		            { name: 'Market Cap', value: `$${nwc(result[1].MarketCap)}`},
                        { name: 'Total Shares', value: `${nwc(result[1].TotalShares)}`},
                        )
                        .setTimestamp()
                        .setFooter(`${prefix}stocks ${stock.acronym} command`); 
                        
                        return message.channel.send(embed);
                        
                        });
                  }; 
                                   
 
            
            //console.log(stock);
            
      }
};
 