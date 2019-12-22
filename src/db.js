const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL

const pool = new Pool({
    connectionString: connectionString,
    ssl: true,
})

module.exports.addNewServer = function (serverId, serverName) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT prefix, server_name FROM settings WHERE server_id = $1`
        let values = [serverId]

        pool.query(sql, values, (err, res) => {
            if(err) {
                reject(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
                if(res.rows[0] === undefined) {
                    sql = `INSERT INTO settings (server_id, prefix, bot_channels, server_name) VALUES ($1, '.', ARRAY['bot','command','elo','bugs'], $2)`
                    values = [serverId, serverName];

                    pool.query(sql, values, (err, res) => {
                        if(err) {
                            reject(`${err.message}. Ping an @**admin** if you need help!`)
                        } else {
                            resolve(`**PolyCalculator** was added to **${serverName}**!`)
                        }
                    })
                    resolve(`**PolyCalculator** was added to **${serverName}**!`)
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
                resolve(res.rows[0].prefix)
            }
        })
    })
}

module.exports.changePrefix = async function (serverId, arg) {
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
    
}

module.exports.addABotChannel = function (serverId) {
    
}

module.exports.updateAllBotChannels = function (serverId) {
    
}