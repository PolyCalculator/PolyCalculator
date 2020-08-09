const express = require('express')
const db = require('../../db')

const router = express.Router();

// Get stats
router.get('/totalTriggers', async (req, res) => {
  const { rows } = await db.query('SELECT COUNT(id) AS recordedcount FROM stats')
  rows[0].recordedcount = Number(rows[0].recordedcount)
  res.send(rows[0])
})

router.get('/totalTriggers/:guildid', async (req, res) => {
  const { guildid } = req.params
  const { rows } = await db.query('SELECT COUNT(id) AS recordedcount FROM stats WHERE server_id = $1', [guildid])
  rows[0].recordedcount = Number(rows[0].recordedcount)
  res.send(rows[0])
})

router.get('/totalservers', async (req, res) => {
  const { rows } = await db.query('SELECT COUNT(server_id) AS nbservers FROM servers WHERE active = true')
  rows[0].nbservers = Number(rows[0].nbservers)
  res.send(rows[0])
})

router.get('/totalusers', async (req, res) => {
  const { rows } = await db.query('SELECT COUNT(DISTINCT author_id) AS uniqueusers FROM stats')
  rows[0].uniqueusers = Number(rows[0].uniqueusers)
  res.send(rows.length.toString())
})

module.exports = router