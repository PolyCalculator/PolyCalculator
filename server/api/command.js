const express = require('express')
const calc = require('../../bot/commands/calc')
const optim = require('../../bot/commands/optim')
const bulk = require('../../bot/commands/bulk')
const elim = require('../../bot/commands/elim')
const unit = require('../../bot/commands/units')
const { Collection } = require('discord.js')
const db = require('../../db')

const commands = new Collection()

const units = {
  name: 'units',
  // eslint-disable-next-line no-unused-vars
  execute: async function (message, argsStr, replyData, dbData, trashEmoji) {
    const sql = 'SELECT * FROM units'// WHERE is_naval_unit = false'
    const { rows } = await db.query(sql)

    return { outcome: rows }
  }
}

commands.set('calc', calc)
commands.set('optim', optim)
commands.set('bulk', bulk)
commands.set('elim', elim)
commands.set('unit', unit)
commands.set('units', units)

const router = express.Router();

// Get stats
router.get('/:commandName', async (req, res) => {
  const { commandName } = req.params
  let { a } = req.query

  if (!a)
    a = ''

  const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  const replyData = {
    content: [],
    deleteContent: false,
    discord: {
      title: undefined,
      description: undefined,
      fields: [],
      footer: undefined
    },
    outcome: {
      attackers: [],
      defender: {}
    }
  }

  const dbData = {
    command: command.name,
    content: command.name.charAt(0) + ' ' + a,
    author_tag: req.ip,
    author_id: '000000000000000000',
    arg: a,
  }

  try {
    const response = await command.execute({}, a, replyData, dbData, false)

    const sql = 'INSERT INTO stats (content, author_id, author_tag, command, attacker, defender, attacker_description, defender_description, reply_fields, arg) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)'
    const values = [dbData.content, dbData.author_id, dbData.author_tag, dbData.command, dbData.attacker, dbData.defender, dbData.attacker_description, dbData.defender_description, dbData.reply_fields, dbData.arg]
    await db.query(sql, values)

    res.send(response.outcome)
  } catch (err) {
    res.send({ error: err })
  }
})

module.exports = router