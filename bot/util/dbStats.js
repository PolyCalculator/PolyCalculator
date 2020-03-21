const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
})

module.exports.addStats = function(message, textStr, commandName, attacker, defender, reply, willDelete) {
  // cleanContent, author, cmd, url, resEmbed, guildId) {

  if(resEmbed) {
    attacker = resEmbed.fields[0].name.replace(/\*|:/g, '')
    defender = resEmbed.fields[1].name.replace(/\*|:/g, '')
    index = defender.indexOf('(')
    if(index != -1)
      defender = defender.substring(0, index)
  }
  const timeStamp = Date.now();

  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO test_stats (content, author_id, author_tag, command, url, attacker, defender, date, server_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)'
    const values = [textStr, author.id, author.tag, cmd.substring(0, 1), url, attacker, defender, timeStamp, guildId]

    pool.query(sql, values, (err, res) => {
      if(err) {
        reject(`Stats: ${err.stack}\n${url}`)
      } else {
        resolve()
      }
    })
  })
}

/* RichEmbed {
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