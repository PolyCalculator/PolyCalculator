const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const topUsers = require('./api/topUsers')
const totalTriggers = require('./api/totalTriggers') 

const app = express();
const stats = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use('/api/stats', stats)

// Handle production
if(process.env.NODE_ENV === 'production') {
    // Static folder
    app.use(express.static(__dirname + '/public'))

    // Handle SPA
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
}

// app.get('/', (req, res) => {
//     res.send(`If you're looking for the API, try http://${req.hostname}/api/docs`)
// })

app.get('/api', (req, res) => {
    res.send(`For some docs, try http://${req.hostname}/api/docs`)
})

// Routers
    // api/topusers/(limit) for top users
stats.use('/', topUsers)

    // api/topusers/(guild_id) for top guilds
stats.use('/', totalTriggers)

const port = process.env.PORT || 3333

app.listen(port, () => {return console.log(`Listening on http://localhost:${port}/api`)})