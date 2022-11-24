const { SlashCommandBuilder } = require('discord.js')

const scoreBoard = []

const msg = {
	goal: 'Goal! ⚽',
	miss: 'Miss! ⛔',
}

const cooldown = 1000 /*ms*/ * 60 /*sec*/ * 60 /*min*/ * 4 /*hrs*/
const missChance = 65

let triedRecently = new Set()

const setTriedRecently = (userid) => {
	triedRecently.add(userid)
	setTimeout(() => {
		// Removes the user from the set after cooldown
		triedRecently.delete(userid)
	}, cooldown)
}

const goalOrMiss = () => {
	const random = (Math.random() * 100).toFixed(2)
	return random > missChance ? true : false
}

// sort scoreBoard in descending order
const sortScoreBoard = () => {
	scoreBoard.sort((a, b) => b.score - a.score)
}

// save the scoreboard to a JSON file
const saveScoreBoard = () => {
	const fs = require('fs')
	const data = JSON.stringify(scoreBoard, null, 2)
	fs.writeFile('score/scoreBoard.json', data, (err) => {
		if (err) {
			throw err
		}
		console.log('Score Board saved to a file - ' + Date(Date.now()).toString())
	})
}

const handleUser = (userid) => {
	const user = scoreBoard.find((user) => user.id === userid)
	if (user) {
		user.score++
	} else {
		scoreBoard.push({ id: userid, score: 1 })
	}

	// sort and save the scoreboard
	sortScoreBoard()
	saveScoreBoard()
}

// setTimeout(() => {
// 	sortScoreBoard()
// 	saveScoreBoard()
// }, 1000 /*ms*/ * 60 /*sec*/ * 1 /*min*/)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('penalty')
		.setDescription('Shoot to the goal post!'),
	async execute(interaction) {
		// await interaction.reply('Shooting!')
		const userId = interaction.user.id

		// Check if user has already tried
		if (triedRecently.has(userId)) {
			await interaction.reply('You have already tried! ^_^')
			return
		}

		setTriedRecently(userId)

		// Do goalOrMiss and handleUser
		if (goalOrMiss()) {
			await interaction.reply(msg.goal)
			handleUser(userId)
		} else {
			await interaction.reply(msg.miss)
		}
	},
}
