module.exports = {
	name: 'getnot',
	description: 'Join a role that will be mention when a user joins a voice channel (curious-cat).',
    aliases: ['get_notification','getnotification','get_not'],
	execute(message) {
        let cc = message.guild.roles.cache.find(role => role.name === "curious-cat");
        if (message.member.roles.cache.has(cc.id)) {
            message.reply("You are already part of the curious-cat role, or there is an error, Bug Leos if you dont get the role.");
        } else {
            message.member.roles.add(cc);
            message.reply("You have been added to the curious-cat role. You will get notify when people join and leave voice channel as well as going live in channels.");
        }
	},
};
