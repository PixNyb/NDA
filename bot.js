const Discord = require('discord.js');
const client = new Discord.Client();
const utils = require('./bot_modules/utils.js');
const messages = require('./bot_modules/messages.js');
const config = require('./config.json');
let servers = require('./servers.json');

// Bot Version
const version = 1.5;

client.on('ready', () => {
    console.log(`Discord bot ready.`);
    console.log(`Running v${version}.`);
    if (parseFloat(config.version) < version) console.log(`Config outdated! (Config version ${config.version}).`);
    client.user.setPresence({ game: { name: `with ${client.users.size} people across ${client.guilds.size} guilds.` }, status: 'online' })
    client.guilds.forEach((guild) => {
        if (!servers[guild.id]) {
            servers[guild.id] = {};
        }
        if (!servers[guild.id].logId || !guild.channels.get(servers[guild.id].logId)) {
            servers[guild.id].logId = guild.channels.find("name", 'nda-logs').id;
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
                if (!msg.member.hasPermission('KICK_MEMBERS')) return msg.channel.send(messages.missingpermissions().setFooter('1 - Can\'t use this command.'));
                if (!args[0]) return msg.channel.send(messages.syntaxerror().setFooter('Member was not defined.'));
                var member = msg.mentions.members.first() ? msg.mentions.members.first() : msg.guild.members.find("username", args[0]);
                if (!utils.compareRank(msg.member, member)) return msg.channel.send(messages.missingpermissions().setFooter('2 - Can\'t alter this member.'));
                var reason = args[1];
                member.kick(reason);
                msg.channel.send(messages.success().addField(`Kicked user ${member.user.tag}.`, `${reason ? reason : `No reason specified.`}`));
                break;
            case 'ban':
                if (!msg.member.hasPermission('BAN_MEMBERS')) return msg.channel.send(messages.missingpermissions().setFooter('1 - Can\'t use this command.'));
                if (!args[0]) return msg.channel.send(messages.syntaxerror().setFooter('Member was not defined.'));
                var member = msg.mentions.members.first() ? msg.mentions.members.first() : msg.guild.members.find("username", args[0]);
                if (!utils.compareRank(msg.member, member)) return msg.channel.send(messages.missingpermissions().setFooter('2 - Can\'t alter this member.'));
                var reason = args[1];
                member.ban(reason);
                msg.channel.send(messages.success().addField(`Banned user ${member.user.tag}.`, `${reason ? reason : `No reason specified.`}`));
                break;
            case 'clear':
                if (isNaN(args[0])) return msg.channel.send(messages.syntaxerror().setFooter('Amount was not defined or not numeric.'));
                let count = args[0] <= 99 ? parseInt(args[0]) + 1 : 100;
                let channel = msg.channel;
                channel.fetchMessages({limit: count})
                    .then(msgs => {
                        channel.bulkDelete(msgs);
                        var link = "Sorry! This functionality hasn't been added yet.";
                        msg.channel.send(messages.success().addField(`Cleared ${msgs.size - 1} message(s).`, `See what's been deleted: ${link}`));
                        log(msg.guild, `Message(s) cleared.`, `${msg.author} has cleared ${msgs.size - 1} message(s) in ${channel}.`);
                    });
                break;
            case 'user':
                if (!msg.member.hasPermission('KICK_MEMBERS')) return msg.channel.send(messages.missingpermissions().setFooter('1 - Can\'t use this command.'));
                if (!args[0]) return msg.channel.send(messages.syntaxerror().setFooter('Member was not defined.'));
                var member = msg.mentions.members.first() ? msg.mentions.members.first() : msg.guild.members.find("username", args[0]);
                msg.channel.send(
                    new Discord.RichEmbed()
                    .setTitle(`${member.user.tag}'s information.`)
                    .setDescription(`A list of all information for this user.`)
                    .setThumbnail(member.user.avatarURL)
                    .addField(`Discord user information.` , `Information gathered from discord.`)
                    .addField(`Username.`, member.user.username, true)
                    .addField(`Discriminator`, member.user.discriminator, true)
                    .addField(`ID.`, member.user.id, true)
                    .addField(`User presence.`, member.user.presence.status, true)
                    .addField(`Discord member since.`, member.user.createdAt, true)
                    .addField(`Is this member a bot?`, member.user.bot ? `Yes` : `No`, true)
                    .addBlankField()
                    .addField(`Server member information.`, `Information gathered from this server.`)
                    .addField(`Nickname.`, member.nickname ? member.nickname : `None`, true)
                    .addField(`Primary role.`, member.hoistRole, true)
                    .addField(`Highest role.`, member.highestRole, true)
                    .addField(`Server member since.`, member.joinedAt, true)
                );
                break;
            case 'settings':
                if (!msg.member.hasPermission('BAN_MEMBERS')) return msg.channel.send(messages.missingpermissions().setFooter('1 - Can\'t use this command.'));
                switch (args[0] ? args[0].toLowerCase() : args[0]) {
                    case 'autorole':
                        if (args[1].toLowerCase() === "none") {
                            delete servers[msg.guild.id].autorole;
                            msg.channel.send(messages.success().addField(`Autorole has been unset!`, `New users will no longer be assigned a role.`));
                        } else {
                            if (!msg.mentions.roles.first()) return msg.channel.send(messages.syntaxerror().setFooter('Role was not mentioned or defined.'));
                            servers[msg.guild.id].autorole = msg.mentions.roles.first().id;
                            msg.channel.send(messages.success().addField(`Autorole has been set!`, `New users will now be assigned the ${msg.mentions.roles.first()} role.`));
                        }
                        utils.updateFile('./servers.json', servers);
                        break;
                    default:
                        msg.channel.send(
                            messages.settings()
                                .addField(`Logging channel.`, `${servers[msg.guild.id].logId ? msg.guild.channels.get(servers[msg.guild.id].logId) : 'None'}`, true)
                                .addField(`*Autorole.`, `${servers[msg.guild.id].autorole ? msg.guild.roles.get(servers[msg.guild.id].autorole) : 'None'}`, true)
                        );
                        break;
                }
                break;
            case 'help':
                msg.channel.send(messages.help());
                break;
            default:
                msg.channel.send(messages.unknown());
                break;
        }
    }
})

client.on("guildMemberAdd", async member => {
    log(member.guild, `User joined.`, `${member} has joined our server!\nThere are now a total of ${member.guild.members.size} members in this server.`, member.user.avatarURL);
    if (!servers[member.guild.id].autorole) return;
    member.addRole(servers[member.guild.id].autorole);
});

client.on("guildMemberRemove", async member => {
    const fetchedKickLogs = await member.guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_KICK',
    });
    const relLog = fetchedKickLogs.entries.first();
    const {admin, target} = relLog;
    if (member.id === target.id) {
        log(member.guild, `User kicked.`, `${member} has been kicked.`);
    } else {
        log(member.guild, `User left.`, `${member} has left our server.\nThere are now a total of ${member.guild.members.size} members in this server.`, member.user.avatarURL);
    }
});

client.on("messageDelete", msg => {
    log(msg.guild, `Message deleted.`, `A message by ${msg.member} has been deleted in ${msg.channel}.`);
});

client.on("messageUpdate", (oldMsg, newMsg) => {
    if (oldMsg.author.id === client.user.id) return;
    log(oldMsg.guild, `Message updated.`, `A message by ${oldMsg.member} has been edited in ${oldMsg.channel}.\nO: \`${oldMsg.content.trim()}\`\nN: \`${newMsg.content.trim()}\``);
})

client.on("guildMemberUpdate", (oldMember, newMember) => {
    if (oldMember.nickname != newMember.nickname) return log(oldMember.guild, `Username updated.`, `${newMember}'s username has been updated.\nO: \`${oldMember.nickname ? oldMember.nickname : oldMember.user.username}\`\nN: \`${newMember.nickname ? newMember.nickname : newMember.user.username}\``);
    if (oldMember.roles != newMember.roles) {
        //To be added
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
    var channel = client.channels.get(guild.systemChannelID || channelID);
    channel.send(messages.welcome().setThumbnail(client.user.avatarURL));
    servers[guild.id] = {};
    utils.updateFile('./servers.json', servers);
});

client.on("guildDelete", guild => {
    delete servers[guild.id];
    utils.updateFile('./servers.json', servers);
});

function log(server, title = '', description = '', thumbnail = '') {
    if (!servers[server.id].logId || !server.channels.get(servers[server.id].logId)) servers[server.id].logId = server.channels.find("name", 'nda-logs').id;
    var logchannel = server.channels.get(servers[server.id].logId);
    if (!logchannel) return;
    logchannel.send(messages.log().addField(title,description).setThumbnail(thumbnail).setTimestamp(new Date));
    utils.updateFile('./servers.json', servers);
}

client.login(config.private.token);