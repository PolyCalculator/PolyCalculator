/* eslint-disable no-unused-vars */
const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL

const pool = new Pool({
  connectionString: connectionString
})

module.exports.addNewServer = function(serverId, serverName, botChannels, meee) {
  return new Promise((resolve, reject) => {
    this.serverExists(serverId)
      .then(serverExists => {
        if(serverExists) {
          const sql = 'UPDATE servers SET bot_channels = $1, server_name = $2, active = true WHERE server_id = $3'
          const values = [botChannels, serverName, serverId];

          pool.query(sql, values, (err, res) => {
            if(err) {
              reject(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
              resolve(`**${serverName}** (${serverId}) reinvited the bot and was updated!`)
            }
          })
        } else {
          const sql = 'INSERT INTO servers (server_id, bot_channels, server_name, active) VALUES ($1, $2, $3, true)'
          const values = [serverId, botChannels, serverName];

          pool.query(sql, values, (err, res) => {
            if(err) {
              reject(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
              resolve(`**PolyCalculator** was added to **${serverName}** (${serverId})!`)
            }
          })
        }
      }).catch(x => reject(x))
  })
}

module.exports.removeServer = function(serverId, serverName, meee) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE servers SET active = false WHERE server_id = $1'
    const values = [serverId];

    pool.query(sql, values, (err, res) => {
      if(err) {
        reject(`${err.message}. Ping an @**admin** if you need help!`)
      } else {
        resolve(`The bot was removed from __**${serverName}**__ (${serverId}) :frowning:...`)
      }
    })
  })
}

module.exports.getBotChannels = function(serverId, serverName, source, isAdd) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT bot_channels FROM servers WHERE server_id = $1'
    const values = [serverId];

    pool.query(sql, values, (err, res) => {
      if(err) {
        reject(`${err.message}. Ping an @**admin** if you need help!`)
      } else {
        if(res.rows[0].bot_channels.length === 0) {
          // eslint-disable-next-line no-console
          console.log('getBotChannels source:', source)
          if(isAdd)
            resolve([])
          else
            reject(`You have no registered bot channels with me in **${serverName}**.\nYou can register them one by one using \`${process.env.PREFIX}addbotchannel\` with a channel ping!`)
        } else
          resolve(res.rows[0].bot_channels)
      }
    })
  })
}

module.exports.removeABotChannel = function(serverId, channelId, serverName) {
  return new Promise((resolve, reject) => {
    this.getBotChannels(serverId, serverName, `(dbServers.removeABotChannel; channelId: ${channelId})`)
      .then(arrayOfChannels => {
        if(arrayOfChannels.some(x => x === channelId)) {
          const newArray = arrayOfChannels.filter(x => x !== channelId)

          const sql = 'UPDATE servers SET bot_channels = $1 WHERE server_id = $2'
          const values = [newArray, serverId];

          pool.query(sql, values, (err, res) => {
            if(err) {
              reject(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
              resolve(newArray)
            }
          })
        } else {
          reject('The channel you specified isn\'t registered as a bot channel with me, so no need to remove it!')
        }
      }).catch(err => { throw err })
  })
}

module.exports.addABotChannel = function(serverId, channelId, serverName) {
  return new Promise((resolve, reject) => {
    this.getBotChannels(serverId, serverName, `(dbServers.addABotChannel; channelId: ${channelId})`, true)
      .then(arrayOfChannels => {
        if(!arrayOfChannels.some(x => x === channelId)) {
          arrayOfChannels.push(channelId)

          const sql = 'UPDATE servers SET bot_channels = $1 WHERE server_id = $2'
          const values = [arrayOfChannels, serverId];

          pool.query(sql, values, (err, res) => {
            if(err) {
              reject(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
              resolve(arrayOfChannels)
            }
          })
        } else {
          reject('The channel you specified is already registered as a bot channel with me!')
        }
      }).catch(err => { reject(err) })
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

module.exports.serverExists = function(serverId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT server_name FROM servers WHERE server_id = $1'
    const values = [serverId]

    pool.query(sql, values, (err, res) => {
      if(err) {
        reject(`${err.message}. Ping an @**admin** if you need help!`)
      } else {
        if(res.rows[0] === undefined)
          resolve(false)
        else
          resolve(true)
      }
    })
  })
}

module.exports.channelExists = function(serverId, channelId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT bot_channels FROM servers WHERE server_id = $1'
    const values = [serverId]

    pool.query(sql, values, (err, res) => {
      if(err) {
        reject(`${err.message}. Ping an @**admin** if you need help!`)
      } else {
        if(res.rows[0].bot_channels.some(x => x === channelId))
          resolve(true)
        else
          resolve(false)
      }
    })
  })
}

module.exports.updateBotChannels = function(serverObj) {
  return new Promise((resolve, reject) => {
    const botChannelsMap = serverObj.channels.cache.filter(x => (x.name.includes('bot') || x.name.includes('command')) && x.type === 'text')
    const botChannels = botChannelsMap.keyArray()

    this.addNewServer(serverObj.id, serverObj.name, botChannels)
      .then(logMsg => {
        this.getBotChannels(serverObj.id, serverObj.name, '(updateBotChannels cmd)')
          .then(channelIds => {
            resolve(channelIds)
          }).catch(console.error)
      }).catch(errorMsg => {
        reject(errorMsg)
      })
  })
}