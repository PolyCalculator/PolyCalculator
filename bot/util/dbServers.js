/* eslint-disable no-unused-vars */
const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL

const pool = new Pool({
  connectionString: connectionString
})

module.exports.addNewServer = function(serverId, serverName) {
  return new Promise((resolve, reject) => {
    this.serverExists(serverId)
      .then(serverExists => {
        if (serverExists) {
          const sql = 'UPDATE servers SET server_name = $1, active = true WHERE server_id = $2'
          const values = [serverName, serverId];

          pool.query(sql, values, (err, res) => {
            if (err) {
              reject(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
              resolve(`**${serverName}** (${serverId}) reinvited the bot and was updated!`)
            }
          })
        } else {
          const sql = 'INSERT INTO servers (server_id, server_name, active) VALUES ($1, $2, true)'
          const values = [serverId, serverName];

          pool.query(sql, values, (err, res) => {
            if (err) {
              reject(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
              resolve(`**PolyCalculator** was added to **${serverName}** (${serverId})!`)
            }
          })
        }
      }).catch(x => reject(x))
  })
}

module.exports.removeServer = function(serverId, serverName) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE servers SET active = false WHERE server_id = $1'
    const values = [serverId];

    pool.query(sql, values, (err, res) => {
      if (err) {
        reject(`${err.message}. Ping an @**admin** if you need help!`)
      } else {
        resolve(`The bot was removed from __**${serverName}**__ (${serverId}) :frowning:...`)
      }
    })
  })
}