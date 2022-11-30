const fs = require('fs')
const schedule = require('node-schedule')
const { SlashCommandBuilder, WebhookClient } = require('discord.js')

const webhookClient = new WebhookClient({
  id: process.env.webhookId,
  token: process.env.webhookToken,
})

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

// calculate the ending time
const getEndTime = () => {
  const initTime = getInitTime()
  const endTime = addHours(24, new Date(initTime))

  // convert endTime to UTC
  const endTimeUTC = new Date(endTime.toUTCString()).toLocaleString()

  return endTimeUTC
}

// reset scoreBoard.json by deleting it and update initTime in data.json
const resetScoreBoard = () => {
  // delete scoreBoard.json
  fs.unlinkSync('score/scoreBoard.json')

  // update initTime in data.json
  const data = fs.readFileSync('data.json')
  const dataObj = JSON.parse(data)
  dataObj.initTime = new Date().toLocaleString()

  const dataJSON = JSON.stringify(dataObj, null, 2)
  fs.writeFileSync('data.json', dataJSON)
}

schedule.scheduleJob(new Date(getEndTime()), async () => {
  await webhookClient.send({
    content: 'Scoreboard that ended at ' + getEndTime(),
    embeds: [embed()],
  })
  resetScoreBoard()
})

// read scoreBoard.json and get the top 10 scores
const scoreData = () => {
  if (fs.existsSync('score/scoreBoard.json')) {
    return fs.readFileSync('score/scoreBoard.json')
  }

  return '[]'
}
const getTop10 = () => {
  const scoreBoard = JSON.parse(scoreData())

  // sort scoreBoard in descending order
  // scoreBoard.sort((a, b) => b.score - a.score)

  // get top 10 scores
  const top10 = scoreBoard.slice(0, 10)

  return top10
}

const top10List = () =>
  getTop10()
    .map((obj, i) => {
      return `\`${i + 1}. \` <@${obj.id}> **·** Score: **${obj.score}** ${i === 0 ? '🥇' : ''
        }`
    })
    .join('\n')

const embed = () => {
  return {
    color: 0xe97532,
    title: 'Scoreboard',
    description: `Remember: Scoreboard resets every 24 hours.\n\n`,
    fields: [
      {
        name: 'Top 10 people with the most scores.',
        value: top10List() || '*No one has scored yet.*\n',
        inline: false,
      },
    ],
    footer: {
      text: `Scoreboard will reset at ${getEndTime()} UTC \n\n`,
    },
    // timestamp: new Date().toISOString(),
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('scoreboard')
    .setDescription('Top 10 players with the most score!'),
  async execute(interaction) {
    // const userId = interaction.user.id
    await interaction.reply({
      embeds: [embed()],
      // ephemeral: true,
    })
  },
}
