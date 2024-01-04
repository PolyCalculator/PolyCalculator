const express = require('express')
const db = require('../../db')

const router = express.Router()

// Get stats
router.get('/topservers', async (req, res) => {
    const { rows } = await db.query(
        'SELECT COUNT(t.id), e.server_name FROM stats AS t LEFT JOIN servers AS e ON t.server_id = e.server_id GROUP BY e.server_name ORDER BY COUNT(id) DESC LIMIT 5',
    )
    res.send(rows)
})

module.exports = router
