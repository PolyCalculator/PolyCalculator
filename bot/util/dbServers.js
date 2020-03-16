const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
})

module.exports.addNewServer = function(serverId, serverName, botChannels) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT server_name FROM servers WHERE server_id = $1'
    const values = [serverId]

    pool.query(sql, values, (err, res) => {
      if(err) {
        reject(`${err.message}. Ping an @**admin** if you need help!`)
      } else {
        if(res.rows[0] === undefined) { // If server didn't exist
          botChannels = Array.from(botChannels.keys())

          const sql1 = 'INSERT INTO servers (server_id, bot_channels, server_name, active) VALUES ($1, $2, $3, true)'
          const values1 = [serverId, botChannels, serverName];

          pool.query(sql1, values1, (err, res1) => {
            if(err) {
              reject(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
              resolve(`**PolyCalculator** was added to **${serverName}**!`)
            }
          })
        } else { // If server existed
          const sql1 = 'UPDATE servers SET active = true WHERE server_id = $1'
          const values1 = [serverId];

          pool.query(sql1, values1, (err, res2) => {
            if(err) {
              reject(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
              resolve(`A server is back, __**${serverName}**__ came back`)
            }
          })
        }
      }
    })
  })
}

module.exports.removeServer = function(serverId, serverName) {
  return new Promise((resolve, reject) => {
    const sql1 = 'UPDATE servers SET active = false WHERE server_id = $1'
    const values1 = [serverId];

    pool.query(sql1, values1, (err, res) => {
      if(err) {
        reject(`${err.message}. Ping an @**admin** if you need help!`)
      } else {
        resolve(`A server just left, __**${serverName}**__`)
      }
    })
  })
}

module.exports.getBotChannels = function(serverId) {
  return new Promise((resolve, reject) => {

    const sql = 'SELECT bot_channels FROM servers WHERE server_id = $1'
    const values = [serverId];

    pool.query(sql, values, (err, res) => {
      if(err) {
        reject(`${err.message}. Ping an @**admin** if you need help!`)
      } else {
        const resolveMsg = []
        res.rows[0].bot_channels.forEach(x => {
          resolveMsg.push(x)
        })
        resolve(resolveMsg)
      }
    })
  })
}

module.exports.addABotChannel = function(serverId, channelId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT bot_channels FROM servers WHERE server_id = $1'
    const values = [serverId];

    pool.query(sql, values, (err, res) => {
      if(err) {
        reject(`${err.message}. Ping an @**admin** if you need help!`)
      } else {
        let newBotChannels = []
        if(res.rows[0].bot_channels.length > 0) {
          if(!res.rows[0].bot_channels.some(x => x === channelId)) {
            newBotChannels = res.rows[0].bot_channels
            newBotChannels.push(channelId)
          } else
            reject('The channel you specified is already registered as a bot channel with me!')
        } else {
          newBotChannels = [channelId]
        }
        const sql = 'UPDATE servers SET bot_channels = $1 WHERE server_id = $2'
        const values = [newBotChannels, serverId];

        pool.query(sql, values, (err, res) => {
          if(err) {
            reject(`${err.message}. Ping an @**admin** if you need help!`)
          } else {
            resolve(newBotChannels)
          }
        })
      }
    })
  })
}

module.exports.removeABotChannel = function(serverId, channelId) {
  return new Promise((resolve, reject) => {

    const sql = 'SELECT bot_channels FROM servers WHERE server_id = $1'
    const values = [serverId];

    pool.query(sql, values, (err, res) => {
      if(err) {
        reject(`${err.message}. Ping an @**admin** if you need help!`)
      } else {
        if(res.rows[0].bot_channels.some(x => x === channelId)) {
          newBotChannels = res.rows[0].bot_channels.filter(x => x != channelId)

          const sql = 'UPDATE servers SET bot_channels = $1 WHERE server_id = $2'
          const values = [newBotChannels, serverId];

          pool.query(sql, values, (err, res) => {
            if(err) {
              reject(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
              resolve(newBotChannels)
            }
          })
        }
        else
          reject('The channel you specified is already not registered as a bot channel with me!')
      }
    })
  })
}

module.exports.isRegisteredChannel = function(serverId, channelId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT bot_channels FROM servers WHERE server_id = $1'
    const values = [serverId];

    pool.query(sql, values, (err, res) => {
      if(err) {
        reject(`${err.message}. Ping an @**admin** if you need help!`)
      } else {
        const botChannels = res.rows[0].bot_channels // array
        const isRegistered = botChannels.some(x => x === channelId)
        resolve(isRegistered)
      }
    })
  })
}