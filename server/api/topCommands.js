const express = require('express');
const db = require('../../db');

const router = express.Router();

// Get stats
router.get('/topcommands', async (req, res) => {
    const { rows } = await db.query(
        'SELECT COUNT(id), command FROM stats GROUP BY command ORDER BY COUNT(id) DESC LIMIT 5',
    );
    res.send(rows);
});

module.exports = router;
