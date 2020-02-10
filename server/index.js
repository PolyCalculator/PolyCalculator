const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const stats = require('./routes/api/stats')

app.use('/api/stats', stats)

const port = process.env.PORT || 3333

app.listen(port, () => {return console.log(`Listening on ${port}`)})