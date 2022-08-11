module.exports = {
	name: 'beep',
	description: 'Beep!',
	execute(message) {
		message.channel.send(message.channel.id);
	},
};
