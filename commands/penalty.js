const { SlashCommandBuilder } = require('discord.js')

const cooldown = 1000 /*ms*/ * 60 /*sec*/ * 60 /*min*/ * 4 /*hrs*/
const missChance = 6.5

module.exports = {
	data: new SlashCommandBuilder()
		.setName('penalty')
		.setDescription('Shoot to the goal post!'),
	async execute(interaction) {
		await interaction.reply('Shooting!')
	},
}
