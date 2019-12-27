const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL

const pool = new Pool({
    connectionString: connectionString,
    ssl: true,
})

module.exports.getTriggers = function() {
    return new Promise((resolve, reject) => {
        let sql = `SELECT COUNT(id) FROM stats`

        pool.query(sql, (err, res) => {
            if(err) {
                reject(`Get triggers: ${err.message}`)
            } else {
                resolve(Number(res.rows[0].count))
            }
        })
    })
}

module.exports.addStats = function (cleanContent, author, cmd, url, resEmbed) {
    let attacker = ''
    let defender = ''
    if(resEmbed) {
        attacker = resEmbed.fields[0].name.replace(/\*|:/g, '')
        defender = resEmbed.fields[1].name.replace(/\*|:/g, '')
        index = defender.indexOf('(')
        if(index != -1)
            defender = defender.substring(0, index)
    }
    let timeStamp = Date.now();

    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO stats (content, author_id, author_tag, command, url, attacker, defender, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
        let values = [cleanContent, author.id, author.tag, cmd.substring(0, 1), url, attacker, defender, timeStamp]

        pool.query(sql, values, (err, res) => {
            if(err) {
                reject(`Stats: ${err.stack}\n${url}`)
            } else {
                resolve()
            }
        })
    })
}

/*RichEmbed {
    title: undefined,
    description: 'The outcome of the fight is:',
    url: undefined,
    color: 16416882,
    author: undefined,
    timestamp: undefined,
    fields:
     [ { name: '**Warrior**:', value: '5 (-5)', inline: false },
       { name: '**Warrior**:', value: '5 (-5)', inline: false } ],
    thumbnail: undefined,
    image: undefined,
    footer: undefined,
    file: undefined,
    files: [] }*/