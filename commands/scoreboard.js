const fs = require('fs')
const { SlashCommandBuilder, WebhookClient } = require('discord.js')

function addHours(numOfHours, date = new Date()) {
	date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000)

	return date
}

// get initTime from data.json
const getInitTime = () => {
	const data = fs.readFileSync('data.json')
	const dataObj = JSON.parse(data)

	return dataObj.initTime
}

// read scoreBoard.json and get the top 10 scores
const getTop10 = () => {
	const data = () => {
		if (fs.existsSync('score/scoreBoard.json')) {
			return fs.readFileSync('score/scoreBoard.json')
		}

		return '[]'
	}

	const scoreBoard = JSON.parse(data())

	// sort scoreBoard in descending order
	// scoreBoard.sort((a, b) => b.score - a.score)

	// get top 10 scores
	const top10 = scoreBoard.slice(0, 10)

	return top10
}

const embed = {
	color: 0xe97532,
	title: 'Score Board',
	description: `Remember: Scoreboard resets every 24 hours.\nNext reset: \`${addHours(
		24,
		new Date(getInitTime())
	).toLocaleString()}\`\n\n`,
	fields: [
		{
			name: 'Top 10 people with the most scores.',
			value:
				getTop10()
					.map((obj, i) => {
						return `\`${i + 1}. \` <@${obj.id}> · Score: **${obj.score}** ${
							i === 0 ? '🥇' : ''
						}`
					})
					.join('\n') || '*No one has scored yet.*',
			inline: false,
		},
	],
	timestamp: new Date().toISOString(),
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('scoreboard')
		.setDescription('Top 10 players with the most score!'),
	async execute(interaction) {
		// const userId = interaction.user.id
		await interaction.reply({
			embeds: [embed],
			// ephemeral: true,
		})
	},
}
