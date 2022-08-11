module.exports = {
	name: 'nonot',
	description: 'Remove yourself from the curious-cat role if you do not want to be spam.',
    aliases: ['no_notification','nonotification','no_not'],
	execute(message) {
        let cc = message.guild.roles.cache.find(role => role.name === "curious-cat");
        if (message.member.roles.cache.has(cc.id)) {
            message.member.roles.remove(cc);
            message.reply("You have been removed from the curious-cat role. You will not get notify when people join and leave voice channel as well as going live in channels.");
        } else {
            message.reply("You are not part of the curious-cat role, use //getnot to join the role.");
        }
	},
};
