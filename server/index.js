const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
<<<<<<< HEAD
const helmet = require('helmet')

const app = express();
const stats = express();
const topUsers = require('./api/topUsers')
const totalTriggers = require('./api/totalTriggers') 

// Middleware
app.use(helmet())
=======
const topUsers = require('./api/topUsers')
const totalTriggers = require('./api/totalTriggers') 

const app = express();
const stats = express();

// Middleware
>>>>>>> 74adeb1de7e6cf850ee21e3c2aac60b5d6f65874
app.use(bodyParser.json());
app.use(cors());

app.use('/api/stats', stats)

<<<<<<< HEAD
// Handle production
if(process.env.NODE_ENV === 'production') {
    // Static folder
    app.use(express.static(__dirname + '/public'))

    // Handle SPA
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
}

=======
>>>>>>> 74adeb1de7e6cf850ee21e3c2aac60b5d6f65874
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