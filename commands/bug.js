module.exports = {
    name: 'bug',
    description: 'thing',
    execute(message) {
        const com = message.client.getServ;
        console.log(com);
        var servinfo = sql.prepare(`SELECT * FROM serversettings WHERE gid = '${message.guild.id}';`).get();
        if (!servinfo) {
            message.reply("No server found, Join a public voice server so I can update this server to the database... or not, is your choice.");
        } else {
            message.channel.send(`The thingy thing right now is ${servinfo['rid']}.`);
        }
    },
};