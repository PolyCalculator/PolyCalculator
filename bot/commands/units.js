const unitList = require('../util/unitsList')

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
  forceNoDelete: false,
  category: 'Main',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  deleteTime: {
    success: 6000,
    failure: 1000
  },
  // eslint-disable-next-line no-unused-vars
  execute: function(message, argsStr, embed, trashEmoji, data) {
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
        .addField('Naval unit codes to add to land units:', 'Boat: `bo`\nShip: `sh`\nBattleship: `bs`')
        .addField('Current hp:', 'Any number will be interpreted as current hp with a bunch of fail-safes')
        .addField('Modifiers:', 'Veteran: `v`\nSingle defense bonus: `d`\nWall defense bonus: `w`')
        .addField('`.o` specific modifier:', 'Only combos with that/those unit(s) doing the final hit: `f`')
      for(const key in unitList) {
        if(key === 'nb')
          continue

        if(embed.description === undefined)
          embed.setDescription(`${unitList[key].name}: \`${key}\``)
        else {
          embed.setDescription(`${embed.description}\n${unitList[key].name}: \`${key}\``)
        }
      }
    }

    return embed
  },
  getUnit: function(unitCode) {
    if(unitCode.length < 2)
      throw 'You need a minimum of two characters to return the stats for a specific unit!'
    if(!unitList[unitCode])
      throw `The unit you are looking for doesn't exist or is under a different code.\nTry ${process.env.PREFIX}units to get the list of all units codes!`

    return { ...unitList[unitCode] }
  },
  getUnitFromArray: function(unitArray, message, trashEmoji) {
    const unitKeys = Object.keys(unitList);
    let unitCode = unitArray.filter(value => unitKeys.includes(value.substring(0, 2).toLowerCase()))
    const isNaval = unitArray.filter(value => value.includes('bo') || value.includes('sh') || value.includes('bs'))
    const rangeOverride = unitArray.filter(value => value === 'r' || value === 'nr')

    if(unitCode.length === 0 && isNaval.length != 0)
      throw `You need to provide a unit inside the **\`${isNaval[0]}\`**\nYou can see the full unit list with\`${process.env.PREFIX}units\`.`
    if(unitCode.length === 0)
      throw 'We couldn\'t find one of the units.\n\nYou can get the list with `.units`'

    unitCode = unitCode.toString().substring(0, 2).toLowerCase()
    const unit = this.getUnit(unitCode)

    const currentHPArray = unitArray.filter(x => !isNaN(parseInt(x)) || x === 'v');

    if(currentHPArray.length > 0)
      unit.setHP(message, currentHPArray, trashEmoji)

    const defenseBonusArray = unitArray.filter(value => value === 'w' || value === 'd')
    if(defenseBonusArray.length > 0)
      unit.addBonus(message, defenseBonusArray, trashEmoji)

    const navalUnitArray = unitArray.filter(value => value.toLowerCase().startsWith('bs') || value.toLowerCase().startsWith('sh') || value.toLowerCase().startsWith('bo'))
    if(navalUnitArray.length > 0) {
      if(unit.onTheWater)
        unit.onTheWater(navalUnitArray)
      else
        throw `Are you really trying to put the **${unit.name}** in a naval unit...`
    }

    const final = unitArray.filter(value => value.toLowerCase() === 'f')
    if(final.length > 0)
      unit.final = true
    else
      unit.final = false

    if(rangeOverride[0] === 'r')
      unit.range = false
    if(rangeOverride[0] === 'nr')
      unit.range = true

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
  }
};