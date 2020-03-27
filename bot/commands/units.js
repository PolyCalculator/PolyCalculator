const unitList = require('../util/unitsList')
const dbStats = require('../../db/index')

module.exports = {
  name: 'units',
  description: 'show the list of unit codes. ***Units require 2 characters.***',
  aliases: ['u', 'unit'],
  shortUsage(prefix) {
    return `${prefix}u`
  },
  longUsage(prefix) {
    return `${prefix}units`
  },
  category: 'Main',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  deleteTime: {
    success: 6000,
    failure: 1000
  },
  // eslint-disable-next-line no-unused-vars
  execute(message, argsStr, embed, willDelete) {
    if (argsStr.length != 0) {
      const argsArray = argsStr.split(/ +/)
      const unitCode = argsArray[0].slice(0, 2).toLowerCase()

      const unit = this.getUnit(unitCode)

      const descriptionArray = [];
      descriptionArray.push(`maxhp: ${unit.maxhp}`)
      descriptionArray.push(`vethp: ${unit.vet ? unit.maxhp + 5 : 'No'}`)
      descriptionArray.push(`attack: ${unit.att}`)
      descriptionArray.push(`defense: ${unit.def}`)
      embed.setTitle(unit.name)
        .setDescription(descriptionArray)
    } else {
      embed.setTitle('All units by code')
      for(const key in unitList) {
        if(embed.description === undefined)
          embed.setDescription(`${unitList[key].name}: ${key}`)
        else {
          if(unitList[key].name === 'Boat') {
            embed.setDescription(`${embed.description}\n\n**Water units**:\n${unitList[key].name}: ${key}`)
          } else
            embed.setDescription(`${embed.description}\n${unitList[key].name}: ${key}`)
        }
      }
    }
    this.addStats(message, argsStr, this.name, willDelete)
      .then().catch(err => { throw err })
    return embed
  },
  getUnit: function(unitCode) {
    if(unitCode.length < 2)
      throw 'You need a minimum of two characters to return the stats for a specific unit!'
    if(!unitList[unitCode])
      throw `The unit you are looking for doesn't exist or is under a different code.\nTry ${process.env.PREFIX}units to get the list of all units codes!`

    return { ...unitList[unitCode] }
  },
  getUnitFromArray: function(unitArray, message, willDelete) {
    const unitKeys = Object.keys(unitList);
    let unitCode = unitArray.filter(value => unitKeys.includes(value.substring(0, 2).toLowerCase()))
    const isNaval = unitArray.filter(value => value.includes('bo') || value.includes('sh') || value.includes('bs'))

    if(unitCode.length === 0 && isNaval.length != 0)
      throw `You need to provide a unit inside the **\`${isNaval[0]}\`**`
    if(unitCode.length === 0)
      throw 'We couldn\'t find one of the units.\n\nYou can get the list with `.units`'

    unitCode = unitCode.toString().substring(0, 2).toLowerCase()
    const unit = this.getUnit(unitCode)

    const currentHPArray = unitArray.filter(x => !isNaN(parseInt(x)) || x === 'v');

    if(currentHPArray.length > 0)
      unit.setHP(message, currentHPArray, willDelete)

    const defenseBonusArray = unitArray.filter(value => value === 'w' || value === 'd')
    if(defenseBonusArray.length > 0)
      unit.addBonus(message, defenseBonusArray, willDelete)

    const navalUnitArray = unitArray.filter(value => value.toLowerCase().startsWith('bs') || value.toLowerCase().startsWith('sh') || value.toLowerCase().startsWith('bo'))
    if(navalUnitArray.length > 0) {
      if(unit.onTheWater)
        unit.onTheWater(navalUnitArray)
      else
        throw `Are you really trying to put the **${unit.name}** in a naval unit...`
    }

    return unit
  },
  // eslint-disable-next-line no-unused-vars
  getBothUnitArray: function(args, message) {
    if(args.includes('/'))
      return args.split('/')
    else if(args.includes(','))
      return args.split(',')
    else
      throw 'You need an attacker and a defender separated using `,` or `/`'
  },


  // Add to stats database
  addStats(message, argStr, commandName, willDelete) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO stats (content, author_id, author_tag, command, arg, url, server_id, will_delete) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)'
      const values = [message.cleanContent.slice(process.env.PREFIX.length), message.author.id, message.author.tag, commandName, argStr, message.url, message.guild.id, willDelete]
      dbStats.query(sql, values, (err) => {
        if(err) {
          reject(`${commandName} stats: ${err.stack}\n${message.url}`)
        } else {
          resolve()
        }
      })
    })
  }
};