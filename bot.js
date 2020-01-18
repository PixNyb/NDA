const Discord = require('discord.js');
const client = new Discord.Client();
const utils = require('./bot_modules/utils.js');
const messages = require('./bot_modules/messages.js');
const admincommands = require('./bot_modules/admincommands.js');
const config = require('./config.json');
let servers = require('./servers.json');

// Bot Version
const version = 1.1;

client.on('ready', () => {
    console.log(`Discord bot ready.`);
    console.log(`Running v${version}.`);
    if (parseFloat(config.version) < version) console.log(`Config outdated! (Config version ${config.version}).`);
    client.user.setPresence({ game: { name: `with ${client.users.size} people across ${client.guilds.size} guilds.` }, status: 'online' })
    client.guilds.forEach((guild) => {
        if (!servers[guild.id]) {
            servers[guild.id] = config.defaultServer;
        }
    });
    utils.updateFile('./servers.json', servers);
});

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.content.charAt(0) === config.prefix){
        var args = msg.content.split(' ');
        var command = args.shift().substr(1);
        switch(command.toLowerCase()){
            case 'kick':
                if (!msg.member.hasPermission('KICK_MEMBERS')) return msg.channel.send(messages.missingpermissions.setFooter('1 - Can\'t use this command.'));
                if (!args[0]) return msg.channel.send(messages.syntaxerror.setFooter('Member was not defined.'));
                var member = msg.mentions.members.first() ? msg.mentions.members.first() : msg.guild.members.find("username", args[0]);
                if (!utils.comparerank(msg.member, member)) return msg.channel.send(messages.missingpermissions.setFooter('2 - Can\'t alter this member.'));
                var reason = args[1];
                member.kick(reason);
                msg.channel.send(messages.success.addField(`Kicked user ${user}.`, `${reason ? reason : `No reason specified.`}`));
                utils.log(`User kicked.`, `${msg.author} has kicked ${user}.\n${reason}`);
                break;
            case 'ban':
                if (!msg.member.hasPermission('BAN_MEMBERS')) return msg.channel.send(messages.missingpermissions.setFooter('1 - Can\'t use this command.'));
                if (!args[0]) return msg.channel.send(messages.syntaxerror.setFooter('Member was not defined.'));
                var member = msg.mentions.members.first() ? msg.mentions.members.first() : msg.guild.members.find("username", args[0]);
                if (!utils.comparerank(msg.member, member)) return msg.channel.send(messages.missingpermissions.setFooter('2 - Can\'t alter this member.'));
                var reason = args[1];
                member.ban(reason);
                msg.channel.send(messages.success.addField(`Banned user ${user}.`, `${reason ? reason : `No reason specified.`}`));
                utils.log(`User banned.`, `${msg.author} has banned ${user}.\n${reason}`);
                break;
            case 'clear':
                if (isNaN(args[0])) return msg.channel.send(messages.syntaxerror.setFooter('Amount was not defined or not numeric.'));
                if (args[0] > 100) args[0] = 100
                let channel = msg.channel
                channel.fetchMessages({limit: args[0]})
                    .then(messages => messages.forEach(msg => {
                        msg.delete().catch();
                    }));
                var link = "Sorry! This functionality hasn't been added yet."
                msg.channel.send(messages.success.addField(`Cleared ${args[0]} messages.`, `See what's been deleted: ${link}`));
                break;
            case 'logformedaddy':
                console.log(`Servers:`);
                console.log(servers);
                console.log(`Config:`);
                console.log(config);
                break;
            case 'help':
                msg.channel.send(messages.help);
                break;
            default:
                msg.channel.send(messages.unknown);
                break;
        }
    }
})

client.on("guildCreate", guild => {
    var channelID;
    var channels = guild.channels;
    channelLoop:
    for (let c of channels) {
        var channelType = c[1].type;
        if (channelType === "text") {
            channelID = c[0];
            break channelLoop;
        }
    }
    var channel = bot.channels.get(guild.systemChannelID || channelID);
    channel.send(messages.welcome);
})
client.login(config.private.token);