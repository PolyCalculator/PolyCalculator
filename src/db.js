const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL

const pool = new Pool({
    connectionString: connectionString,
    ssl: true,
})

module.exports.addNewServer = function (serverId, serverName, botChannels) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT prefix, server_name FROM settings WHERE server_id = $1`
        let values = [serverId]

        pool.query(sql, values, (err, res) => {
            if(err) {
                reject(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
                if(res.rows[0] === undefined) {
                    botChannels = Array.from(botChannels.keys())

                    let sql1 = `INSERT INTO settings (server_id, prefix, bot_channels, server_name) VALUES ($1, '.', $2, $3)`
                    let values1 = [serverId, botChannels, serverName];

                    pool.query(sql1, values1, (err, res) => {
                        if(err) {
                            reject(`${err.message}. Ping an @**admin** if you need help!`)
                        } else {
                            resolve(`**PolyCalculator** was added to **${serverName}**!`)
                        }
                    })
                } else {
                    resolve(`A server is back, __**${res.rows[0].server_name}**__ came back`)
                }
            }
        })
    })
}

module.exports.getPrefix = function (serverId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT prefix FROM settings WHERE server_id = $1`
        const values = [serverId]

        pool.query(sql, values, (err, res) => {
            if(err) {
                reject(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
                if(res.rows.length != 0)
                    resolve(res.rows[0].prefix)
                else
                    resolve('.')
            }
        })
    })
}

module.exports.setPrefix = async function (serverId, arg) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE settings SET prefix = $1 WHERE server_id = $2`
        const values = [arg, serverId];

        pool.query(sql, values, (err, res) => {
            if(err) {
                reject(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
                resolve(`New server prefix is now set to \`${arg}\``)
            }
        })
    })
}

module.exports.getBotChannels = function (serverId) {
    return new Promise((resolve, reject) => {

        const sql = `SELECT bot_channels FROM settings WHERE server_id = $1`
        const values = [serverId];

        pool.query(sql, values, (err, res) => {
            if(err) {
                reject(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
                let resolveMsg = []
                res.rows[0].bot_channels.forEach(x => {
                    resolveMsg.push(x)
                })
                resolve(resolveMsg)
            }
        })
    })
}

module.exports.addABotChannel = function (serverId, channelId) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT bot_channels FROM settings WHERE server_id = $1`
        let values = [serverId];

        pool.query(sql, values, (err, res) => {
            if(err) {
                reject(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
                if(!res.rows[0].bot_channels.some(x => x === channelId)) {
                    if(res.rows[0].bot_channels != []) {
                        newBotChannels = res.rows[0].bot_channels
                        newBotChannels.push(channelId)
                    } else {
                        newBotChannels = [channelId]
                    }
                    console.log('newBotChannels:', newBotChannels)

                    let sql = `UPDATE settings SET bot_channels = $1 WHERE server_id = $2`
                    let values = [newBotChannels, serverId];

                    pool.query(sql, values, (err, res) => {
                        if(err) {
                            reject(`${err.message}. Ping an @**admin** if you need help!`)
                        } else {
                            resolve(newBotChannels)
                        }
                    })
                }
                else
                    reject(`The channel you specified is already registered as a bot channel with me!`)
            }
        })
    })
}

module.exports.removeABotChannel = function (serverId, channelId) {
    return new Promise((resolve, reject) => {

        let sql = `SELECT bot_channels FROM settings WHERE server_id = $1`
        let values = [serverId];

        pool.query(sql, values, (err, res) => {
            if(err) {
                reject(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
                if(res.rows[0].bot_channels.some(x => x === channelId)) {
                    newBotChannels = res.rows[0].bot_channels.filter(x => x != channelId)

                    let sql = `UPDATE settings SET bot_channels = $1 WHERE server_id = $2`
                    let values = [newBotChannels, serverId];

                    pool.query(sql, values, (err, res) => {
                        if(err) {
                            reject(`${err.message}. Ping an @**admin** if you need help!`)
                        } else {
                            resolve(newBotChannels)
                        }
                    })
                }
                else
                    reject(`The channel you specified is already not registered as a bot channel with me!`)
            }
        })
    })
}