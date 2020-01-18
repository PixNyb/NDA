const config = require('../config.json');
const Discord = require('discord.js');

exports.unknown = new Discord.RichEmbed()
    .setColor('#cf6679')
    .addField(`Unknown command.`, `I don't know what you want me to do.\nTry *${config.prefix}help*!`);

exports.success = new Discord.RichEmbed()
    .setColor('#66cf69')
    .setTitle('Success!');

exports.help = new Discord.RichEmbed()
    .setColor('#7866cf')
    .setTitle('NDA Help')
    .setDescription(`Hi there! Let me help you get going.`)
    .addField(`${config.prefix}help`, `Display this list.`)
    .addField(`${config.prefix}kick {@member} (reason)`, `Kick a member.`)
    .addField(`${config.prefix}ban {@member} (reason)`, `Ban a member.`)
    .addField(`${config.prefix}clear {amount}`, `Clear the specified number of messages.`);

exports.missingpermissions = new Discord.RichEmbed()
    .setColor('#cf6679')
    .addField(`Lacking permissions.`, `You don't have enough permissions to do this.`);

exports.syntaxerror = new Discord.RichEmbed()
    .setColor('#cf6679')
    .addField(`Oops!`, `Your syntax wasn't quite right!`);