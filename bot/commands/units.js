const unitList = require('../util/unitsList')

module.exports = {
  name: 'units',
  description: 'show the list of unit codes. ***Units require 2 characters.***',
  aliases: ['unit', 'u'],
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
  execute(message, args, embed) {
    embed.setColor('#FA8072')
      .setTitle('All units by code')
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
    return embed
  },
  getUnit: function(unitPartial, prefix) {
    if(unitPartial.length < 2)
      return 'You need a minimum of two characters to return the stats for a specific unit!'
    if(!unitList[unitPartial])
      return `The unit you are looking for doesn't exist or is under a different code.\nTry ${prefix}units to get the list of all units codes!`
    // const clone = { ...unitList[unitPartial] }
    return { ...unitList[unitPartial] }
  },
  getUnitFromArray: function(unitArray, message) {
    const unitKeys = Object.keys(unitList);
    let unitCode = unitArray.filter(value => unitKeys.includes(value.substring(0, 2).toLowerCase()))
    const isNaval = unitArray.filter(value => value.includes('bo') || value.includes('sh') || value.includes('bs'))

    if(unitCode.length === 0 && isNaval.length != 0)
      throw `You need to provide a unit inside the \`**${isNaval[0]}**\``
    if(unitCode.length === 0)
      throw 'We couldn\'t find one of the units.\n*REQUIRED: You need to type at least two characters of the unit.*\n\nYou can get the list is available with `.units`'

    unitCode = unitCode.toString().substring(0, 2).toLowerCase()
    const unit = this.getUnit(unitCode)

    let defenseBonus = unitArray.filter(value => value === 'w' || value === 'd')
    defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

    if(defenseBonus.length === 2)
      message.channel.send('You\'ve provided both `w` and `d`\nBy default, I take `w` over `d` if both are present.')

    if(defenseBonus.length === 1)
      unit.addBonus(defenseBonus.toString())

    unit.setHP(unitArray, message)
    return unit
  },
  getBothUnitArray: function(args, message) {
    if(args.includes('/'))
      return args.split('/')
    else if(args.includes(','))
      return args.split(',')
    else
      throw 'You need an attacker and a defender separated using `,` or `/`'
  }
};