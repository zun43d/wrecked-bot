const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

// Build a discord embed that shows top 10 scorer

let scores = [152, 545, 253, 554, 876, 215]
let userId

const embed = new EmbedBuilder()
embed.setTitle('Top 10 Scorers')
embed.setColor('#e97532')
embed.setImage('https://i.imgur.com/AfFp7pu.png')
embed.setDescription('Top 10 Players who scored the most in the last 24 hours')
// embed.setThumbnail('https://i.imgur.com/wSTFkRM.png')
embed.setTimestamp()

// embed.addFields({ name: 'Score', value: scores.join('\n'), inline: true })

const board = scores
	.map((score, index) => `\`${index + 1}. \`**${score}**`)
	.join('\n')
embed.addFields({
	name: 'Scoreboard',
	value: board,
	inline: false,
})

// scores.forEach((score, index) => {
// 	embed.addFields({
// 		name: `${index + 1}. `,
// 		value: `Score: ${score}`,
// 		inline: true,
// 	})
// })

module.exports = {
	data: new SlashCommandBuilder()
		.setName('scoreboard')
		.setDescription('Top 10 players with the most score!'),
	async execute(interaction) {
		userId = interaction.user.id
		await interaction.reply({
			content: `<@${userId}>`,
			embeds: [embed],
			// ephemeral: true,
		})
	},
}
