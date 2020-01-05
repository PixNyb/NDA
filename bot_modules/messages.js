const config = require('../config.json');
const Discord = require('discord.js');


exports.help = new Discord.RichEmbed()
    .setColor('#7866cf')
    .setTitle('NDA Help')
    .setDescription(`Hi there! Let me help you get going.`)
    .addField(`${config.prefix}help`, `Display this list.`)
    .addField(`${config.prefix}kick {@member} (reason)`, `Kick a member.`)
    .addField(`${config.prefix}ban {@member} (reason)`, `Ban a member.`);

exports.missingpermissions = new Discord.RichEmbed()
    .setColor('#cf6679')
    .addField(`Lacking permissions.`, `You don't have enough permissions to do this.`);

exports.syntaxerror = new Discord.RichEmbed()
    .setColor('#cf6679')
    .addField(`Oops!`, `Your syntax wasn't quite right!`);