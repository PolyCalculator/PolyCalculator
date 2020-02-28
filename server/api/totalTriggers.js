const express = require('express')
const db = require('../../db')

const router = express.Router();

// Get stats
router.get('/totalTriggers', async (req, res) => {
    const { rows } = await db.query('SELECT COUNT(id) AS recordedcount FROM stats')
    rows[0].recordedcount = Number(rows[0].recordedcount)
    res.send(rows)
})

router.get('/totalTriggers/:guildid', async (req, res) => {
    const { guildid } = req.params
    const { rows } = await db.query('SELECT COUNT(id) AS recordedcount FROM stats WHERE server_id = $1', [guildid])
    rows[0].recordedcount = Number(rows[0].recordedcount)
    res.send(rows)
})

module.exports = router