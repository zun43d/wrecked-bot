const fs = require('fs')
const { SlashCommandBuilder } = require('discord.js')

let scoreBoard = []

let globalUID = '';

const msg = {
  goal: 'Goal!!!!! ⚽',
  miss: 'Miss! ⛔',
}

const cooldown = 1000 /*ms*/ * 60 /*sec*/ * 30 /*min*/ /* * */ /*4*/ /*hrs*/
const missChance = 50
// const missChance = (globalUID == '433503494322913290') ? 90 : 50

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
  const data = JSON.stringify(scoreBoard, null, 2)
  fs.writeFile('score/scoreBoard.json', data, (err) => {
    if (err) {
      throw err
    }
    console.log('Score Board saved to a file - ' + Date(Date.now()).toString())
  })
  scoreBoard = []
}

const handleUser = (userid) => {
  // check if scoreboard.json exits, if yes read it then parse it to scoreBoard
  if (fs.existsSync('score/scoreBoard.json')) {
    const data = fs.readFileSync('score/scoreBoard.json')
    const dataObj = JSON.parse(data)
    scoreBoard = []
    scoreBoard.push(...dataObj)
  }

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
      await interaction.reply('Your leg is in pain. You should rest for a while! ^0^')
      return
    }

    setTriedRecently(userId)

    globalUID = userId
    // Do goalOrMiss and handleUser
    if (goalOrMiss()) {
      await interaction.reply(msg.goal)
      handleUser(userId)
    } else {
      await interaction.reply(msg.miss)
    }
  },
}
