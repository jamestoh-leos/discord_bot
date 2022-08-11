const Discord = require('discord.js');
module.exports = {
	name: 'roll',
	description: 'Roll a dice',
	usage: '<number of dice>D<number of dice faces> I.E 1D20',
	args: true,
	execute(message, args) {
		const reg = /\d+[d|D]\d+/g;
		const modi = /\+?\-?\d+/;
		if (!modi.test(args[1])) {
			mod = 0;
		} else {
			mod = parseInt(args[1]);
		}
		if (!reg.test(args[0])) {
			return message.reply(`Incorrect arguement given. Try 1D20 or something simular`);
		}
		
		const dice = args[0].split(/d|D/);
		const diceFace = parseInt(dice[1]);
		const numDice = parseInt(dice[0]);
		diceTotal = 0;
		const diceRoll = [];
		for (var i = 0; i < numDice; i++) {
			const ranNum = Math.random();
			const calc = Math.floor((ranNum*diceFace)+1);
			if (!diceRoll.length) {
				diceRoll.push(`${calc}`);
				diceTotal = diceTotal + calc;
			} else {
				diceRoll.push(` ${calc}`);
				diceTotal = diceTotal + calc;
			} // end of if
		} // end of for
	const total = diceTotal + mod;
		const hook = new Discord.WebhookClient('752812409709920276', 'K9qvr8elOtFFCHr2ylp0uPzKOfeEp1a6UP1gXOHygxh-yOLCPCfFUY0_ffBZwhu1Wzrk');
		
		hook.edit({
			name: message.author.username
		});
		const embedThing = new Discord.MessageEmbed()
		.setColor(0xffffff)
		.setTitle(`Diced rolled: ${numDice}D${diceFace} + ${mod}`)
		.setDescription(`Total: ${total}\nIndividual results:\n${diceRoll}`);
		hook.send(embedThing);
		// message.channel.send(`Total: ${total}\nDiced rolled: ${numDice}D${diceFace} + ${mod}\nIndividual results:\n${diceRoll}`);
	},
};
