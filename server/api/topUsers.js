const express = require('express');
const db = require('../../db');

const router = express.Router();

// Get stats
router.get('/topusers', async (req, res) => {
    const { rows } = await db.query(
        'SELECT COUNT(id), author_tag FROM stats GROUP BY author_tag ORDER BY COUNT(id) DESC LIMIT 3',
    );
    res.send(rows);
});

router.get('/topusers/:limit', async (req, res) => {
    const { limit } = req.params;
    const { rows } = await db.query(
        'SELECT COUNT(id), author_tag FROM stats GROUP BY author_tag ORDER BY COUNT(id) DESC LIMIT $1',
        [limit],
    );
    res.send(rows);
});

module.exports = router;
