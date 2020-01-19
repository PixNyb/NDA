const config = require('../config.json');
const Discord = require('discord.js');

module.exports = {
    welcome: function() {
        var msg = new Discord.RichEmbed()
        .setColor('#0c0c0c')
        .setTitle('Thank you for inviting me!')
        .setDescription('Let me introduce myself.')
        .addField(`Hi! I'm NDA.`, `A nifty and small discord moderation bot.`)
        .addField(`Getting started.`, `You don't need to do a lot to set me up, there's no web panel and a lot of the settings will be set according to what we think is best for you!`, true)
        .addField(`Command usage.`, `Since I'm a fairly basic bot, there's not much to it! My prefix is "${config.prefix}" and you can access my help menu using "${config.prefix}help".`, true)
        .addField(`Logging.`, `I have some impressing logging capabilities, to start using them create any text channel with the name "nda-logs". After sending my first log you can change the name of this channel to whatever you want!`, true)
        .setFooter(`@PixelNull#6763`)
        .setTimestamp(new Date);
        return msg;
    },
    settings: function() {
        var msg = new Discord.RichEmbed()
        .setColor('#0c0c0c')
        .setTitle('NDA Settings & Properties')
        .setDescription('These are the properties for your server.')
        .addField('Altering settings.', `You may alter setting (marked with * ) in this list by typing ".settings {setting} {value}", for example: .settings autorole @member. You may unset these alerable settings by typing ".settings {setting} none", effectively disabling the functionality.`);
        return msg;
    },
    unknown: function() {
        var msg = new Discord.RichEmbed()
        .setColor('#cf6679')
        .addField(`Unknown command.`, `I don't know what you want me to do.\nTry *${config.prefix}help*!`);
        return msg;
    },
    success: function() {
        var msg = new Discord.RichEmbed()
        .setColor('#66cf69')
        .setTitle('Success!');
        return msg;
    },
    log: function() {
        var msg = new Discord.RichEmbed()
        .setColor('#0c0c0c');
        return msg;
    },    
    help: function() {
        var msg = new Discord.RichEmbed()
        .setColor('#0c0c0c')
        .setTitle('NDA Help')
        .setDescription(`Hi there! Let me help you get going.`)
        .addField(`${config.prefix}help`, `Display this list.`)
        .addField(`${config.prefix}kick {@member} (reason)`, `Kick a member.`)
        .addField(`${config.prefix}ban {@member} (reason)`, `Ban a member.`)
        .addField(`${config.prefix}clear {amount}`, `Clear the specified number of messages.`);
        return msg;
    },
    missingpermissions: function() {
        var msg = new Discord.RichEmbed()
        .setColor('#cf6679')
        .addField(`Lacking permissions.`, `You don't have enough permissions to do this.`);
        return msg;
    },
    syntaxerror: function() {
        var msg = new Discord.RichEmbed()
        .setColor('#cf6679')
        .addField(`Oops!`, `Your syntax wasn't quite right!`);
        return msg;
    }
}