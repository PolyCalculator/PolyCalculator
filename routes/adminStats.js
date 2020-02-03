var express = require('express');
var router = express.Router();
const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL

const pool = new Pool({
    connectionString: connectionString,
    ssl: true,
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index',{ title: 'Users' });
});

module.exports = router;
