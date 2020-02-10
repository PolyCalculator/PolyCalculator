const express = require('express')
const db = require('../../../db')

const router = express.Router();

// Get stats
router.get('/topusers', async (req, res) => {
    const { rows } = await db.query('SELECT COUNT(id), author_tag FROM stats GROUP BY author_tag ORDER BY COUNT(id) DESC LIMIT 3')
    res.send(rows)
})

router.get('/topusers/:limit', async (req, res) => {
    const { limit } = req.params
    const { rows } = await db.query('SELECT COUNT(id), author_tag FROM stats GROUP BY author_tag ORDER BY COUNT(id) DESC LIMIT $1', [limit])
    res.send(rows)
})

router.get('/total', async (req, res) => {
    const { rows } = await db.query('SELECT COUNT(id) AS recordedcount FROM stats')
    rows[0].recordedcount = Number(rows[0].recordedcount)
    rows[0].totalCount = rows[0].recordedcount + 6555;
    res.send(rows)
})

router.get('/total/:guildid', async (req, res) => {
    const { guildid } = req.params
    const { rows } = await db.query('SELECT COUNT(id) AS recordedcount FROM stats WHERE guild_id = $1', [guildid])
    rows[0].recordedcount = Number(rows[0].recordedcount)
    rows[0].totalCount = rows[0].recordedcount + 6555;
    res.send(rows)
})

module.exports = router