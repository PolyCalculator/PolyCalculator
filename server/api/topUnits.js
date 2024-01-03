const express = require('express');
const db = require('../../db');

const router = express.Router();

// Get stats
router.get('/topattacker', async (req, res) => {
    const { rows } = await db.query(
        'SELECT COUNT(id), attacker FROM stats WHERE attacker IS NOT NULL GROUP BY attacker ORDER BY COUNT(id) DESC LIMIT 5',
    );
    res.send(rows);
});

router.get('/topdefender', async (req, res) => {
    const { rows } = await db.query(
        'SELECT COUNT(id), defender FROM stats WHERE defender IS NOT NULL GROUP BY defender ORDER BY COUNT(id) DESC LIMIT 5 ',
    );
    res.send(rows);
});

module.exports = router;
