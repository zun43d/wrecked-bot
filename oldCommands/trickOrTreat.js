const { SlashCommandBuilder } = require('discord.js')

const cooldown = 1000 * 60 * 60 * 8
const trickChance = 9.5

let talkedRecently = new Set()

const trickOrTreat = (userid) => {
	if (talkedRecently.has(userid)) {
		return "Don't be greedy! ^_^ Come back after some while."
	}

	const random = (Math.random() * 10).toFixed(2)

	talkedRecently.add(userid)
	setTimeout(() => {
		// Removes the user from the set after a minute
		talkedRecently.delete(userid)
	}, cooldown)

	return random > trickChance ? '🍬 Treat!' : '🎃 Trick!'
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trickortreat')
		.setDescription('Trick or treat!'),
	async execute(interaction) {
		await interaction.reply(trickOrTreat(interaction.user.id))
	},
}
