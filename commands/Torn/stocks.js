const fetch = require('node-fetch');
const Discord = require('discord.js');
const { nwc } = require('../../functions/nwc');
const { prefix, api_key } = require('../../config.json');
module.exports = {
	name: 'stocks',
      aliases: ['stonks'],
	description: 'Returns Stock information',
	cooldown: 1,
	async execute(message, args) {

            var selection = "0";
            var args = args.toString().toUpperCase();

            if (args == "TSB")
            {
                  selection = "1";
            }
            else if (args == "TCB")
            {
                  selection = "2";
            }
            else if (args == "SYS")
            {
                  selection = "3";
            }
            else if (args == "LAG")
            {
                  selection = "4";
            }
            else if (args == "IOU")
            {
                  selection = "5";
            }
            else if (args == "GRN")
            {
                  selection = "6";
            }
            else if (args == "THS")
            {
                  selection = "7";
            }
            else if (args == "YAZ")
            {
                  selection = "8";
            }
            else if (args == "TCT")
            {
                  selection = "9";
            }
            else if (args == "CNC")
            {
                  selection = "10";
            }
            else if (args == "MSG")
            {
                  selection = "11";
            }
            else if (args == "TMI")
            {
                  selection = "12";
            }
            else if (args == "TCP")
            {
                  selection = "13";
            }
            else if (args == "IIL")
            {
                  selection = "14";
            }
            else if (args == "FHG")
            {
                  selection = "15";
            }
            else if (args == "SYM")
            {
                  selection = "16";
            }
            else if (args == "LSC")
            {
                  selection = "17";
            }
            else if (args == "PRN")
            {
                  selection = "18";
            }
            else if (args == "EWM")
            {
                  selection = "19";
            }
            else if (args == "TCM")
            {
                  selection = "20";
            }
            else if (args == "ELT")
            {
                  selection = "21";
            }
            else if (args == "HRG")
            {
                  selection = "22";
            }
            else if (args == "TGP")
            {
                  selection = "23";
            }
            else if (args == "WSU")
            {
                  selection = "25";
            }
            else if (args == "IST")
            {
                  selection = "26";
            }
            else if (args == "BAG")
            {
                  selection = "27";
            }
            else if (args == "EVL")
            {
                  selection = "28";
            }
            else if (args == "MCS")
            {
                  selection = "29";
            }
            else if (args == "WLT")
            {
                  selection = "30";
            }
            else if (args == "TCC")
            {
                  selection = "31";
            }
            else if (args == "FAQ")
            {
                  message.member.send("buy low sell high")
            }
            else 
            {
                  return message.channel.send("Invalid acronym, correct usage would be .stocks acronym");
            }

            const request = `https://api.torn.com/torn/?selections=stocks&key=${api_key}`;

            console.log(selection);

            await fetch(request)
            .then(res => res.json())
            .then(res => {
                  Info = res.stocks[`${selection}`];
                  console.log(`${Info}`)
            })

            const embed = new Discord.MessageEmbed()
                        .setColor("008000")
                        .setTitle(`${Info.name}`)
                        .setDescription(`Acroynm: ${Info.acronym}`)
                        .addFields(
                        { name: 'Current Price', value: `$${nwc(Info.current_price)}`},
		            { name: 'Market Cap', value: `$${nwc(Info.market_cap)}`},
                        { name: 'Total Shares', value: `${nwc(Info.total_shares)}`},
                        )
                        .setTimestamp()
                        .setFooter(`${prefix}stocks ${Info.acronym} command`); 
                        
                        return message.channel.send(embed);
      }
};
 