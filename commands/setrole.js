const SQLite = require("better-sqlite3");
const sql = new SQLite("./bot.db");
module.exports = {
    name: 'setrole',
    description: 'Set the role that will be notify when someone join/leave voice channels.',
    execute(message, args) {
        const servinfo = sql.prepare(`SELECT * FROM serversettings WHERE gid = '${message.guild.id}';`).get();
        if (!servinfo) {
            message.reply("No server found, Join a public voice server so I can update this server to the database... or not, is your choice.");
        } else {
            message.channel.send(`The thingy thing right now is ${servinfo['rid']}.`);
        }
    },
};