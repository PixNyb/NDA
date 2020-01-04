const config = require('../config.json');
const Discord = require('discord.js');

module.exports = {
    gethelp: function(user) {
        var message = new Discord.RichEmbed()
        .setColor('#7866cf')
        .setTitle('NDA Help')
        .setDescription(`Hey ${user}! Let me help you get going.`)
        .addField(`${config.prefix}help`, `Display this list.`)
        .addField(`${config.prefix}kick {@member} (reason)`, `Kick a member.`)
        .addField(`${config.prefix}ban {@member} (reason)`, `Ban a member.`)
        return message;
    },
    missingpermissions: function(err) {
        var message = new Discord.RichEmbed()
        .setColor('#cf6679')
        .addField(`Lacking permissions.`, `You don't have enough permissions to do this.`)
        .setFooter(err);
        return message;
    }
}