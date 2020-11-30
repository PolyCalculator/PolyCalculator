const express = require('express')
const calc = require('../../bot/commands/calc')
const optim = require('../../bot/commands/optim')
const bulk = require('../../bot/commands/bulk')
const elim = require('../../bot/commands/elim')
const db = require('../../db')

const commands = new Map()

commands.set('calc', calc)
commands.set('optim', optim)
commands.set('bulk', bulk)
commands.set('elim', elim)

const router = express.Router();

// Get stats
router.get('/:commandName', async (req, res) => {
  const { commandName } = req.params
  const { a } = req.query

  const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  const replyData = {
    content: [],
    deleteContent: false,
    title: undefined,
    description: undefined,
    fields: [],
    footer: undefined
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
    db.query(sql, values)

    delete response.content
    delete response.deleteContent
    res.send(response)
  } catch (err) {
    res.send({ error: err })
  }
})

module.exports = router