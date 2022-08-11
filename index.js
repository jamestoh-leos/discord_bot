// https://discord.com/api/oauth2/authorize?client_id=700666766707130429&permissions=335621200&scope=bot
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const SQLite = require("better-sqlite3");
const sql = new SQLite("./bot.db");
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = 'serversettings';")
        .get();
    if (!table['count(*)']) {
        sql.prepare("CREATE TABLE serversettings (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, gid NVARCHAR(50), cid NVARCHAR(50), rid NVARCHAR(50))").run();
        sql.prepare("CREATE UNIQUE INDEX idx_serversettings_id ON serversettings (id);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
        console.log("DB Table 'serversettings' set-up complete.");
    }
    client.getServ = sql.prepare("SELECT * FROM serversettings WHERE gid = ?;");
    client.setServ = sql.prepare("INSERT OR REPLACE INTO serversettings (gid, cid, rid) VALUES (@gid, @cid, @rid);");

    console.log('Ready for action!');
});

client.on('message', message => {
    let meep = /meep/i;
    if (meep.test(message.content) && !message.author.bot) {
        /*
        message.reply("Hey, no MEEPING!")
            .then(msg => {
                msg.delete({ timeout: 10000 });
            })
            .catch();
            */
            message.react("👎");
    }
    /*
    if (meep.test(message.content) && message.author.bot) {
        message.delete();
    }
    */
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
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

client.on('voiceStateUpdate', (oldState, newState) => {
    if (newState.member.user.bot) return;
    let servinfo;
    servinfo = client.getServ.get(newState.guild.id);

    if (!servinfo) {
        console.log("No Serinfo");
        servinfo = {
            gid: newState.guild.id,
            cid: null,
            rid: null
        };
        client.setServ.run(servinfo);
    }
    const newUserChannel = newState.channel;
    const oldUserChannel = oldState.channel;
    //const botChannel = client.channels.cache.get('749148446694441072');
    const botChannel = newState.guild.channels.cache.find(channel => channel.name === "bot-ping");
    const role = newState.guild.roles.cache.find(role => role.name === "curious-cat");
    var person = '';
    if (newState.member.nickname == null) {
        person = newState.member.user.username;
    } else {
        person = newState.member.nickname + "(" + newState.member.user.username + ")";
    }

    if (!oldState.streaming && newState.streaming && botChannel) {
        botChannel.send(`<@&${role.id}> \n ${newState.member.user.username} is streaming in ${newState.channel.name}`);
    } else if (oldState.streaming && !newState.streaming && botChannel) {
        botChannel.send(`<@&${role.id}> \n ${person} has stop streaming in ${newState.channel.name}.`);
    }

    if (oldUserChannel === null && newUserChannel !== null && botChannel) {
        botChannel.send(`<@&${role.id}> \n ${person} joined ${newState.channel.name}`);
    } else if (newUserChannel === null && botChannel) {
        botChannel.send(`<@&${role.id}> \n ${person} has left ${oldState.channel.name}.`);
    } else if (oldUserChannel !== newUserChannel && botChannel) {
        botChannel.send(`<@&${role.id}> \n ${person} moved from ${oldState.channel.name} to ${newState.channel.name}.`);
    }
});

/*
client.on("guildMemberUpdate", function (oldMember, newMember) {
    console.error(`a guild member changes - i.e. new role, removed role, nickname.`);
    console.log(`${newMember.nickname}`);
});
*/

client.login(token).then(() => {
    client.user.setPresence({ activities: [{ name: 'something you never heard of.', type: 'PLAYING' }], status: 'online' });
});