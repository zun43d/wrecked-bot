const { SlashCommandBuilder } = require('discord.js')

const trickOrTreat = () => {
	const random = (Math.random() * 10).toFixed(2)

	return random > 8.5 ? '🍬 Treat!' : '🎃 Trick!'
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trickortreat')
		.setDescription('Trick or treat!'),
	async execute(interaction) {
		await interaction.reply(trickOrTreat())
	},
}
