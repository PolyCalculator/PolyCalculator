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
  execute: function (message, argsStr, replyData, dbData, trashEmoji) {
    if (argsStr.length != 0) {
      const argsArray = argsStr.split(/ +/)
      const unitCode = argsArray[0].slice(0, 2).toLowerCase()

      const unit = this.getUnit(unitCode)

      const descriptionArray = [];
      descriptionArray.push(`maxhp: ${unit.maxhp}`)
      descriptionArray.push(`vethp: ${unit.vet ? unit.maxhp + 5 : 'No'}`)
      descriptionArray.push(`attack: ${unit.att}`)
      descriptionArray.push(`defense: ${unit.def}`)
      replyData.title = unit.name
      replyData.description = descriptionArray
    } else {
      replyData.title = 'All units by code'
      replyData.fields.push({ name: 'Naval unit codes to add to land units:', value: 'Boat: `bo`\nShip: `sh`\nBattleship: `bs`' })
      replyData.fields.push({ name: 'Current hp:', value: 'Any number will be interpreted as current hp with a bunch of fail-safes' })
      replyData.fields.push({ name: 'Modifiers:', value: 'Veteran: `v`\nSingle defense bonus: `d`\nWall defense bonus: `w`\nAdd `r` to the attacker to force the defender\'s retaliation.\nAdd `nr` to the attacker to force no retaliation on the  defender.' })
      replyData.fields.push({ name: '`.o` specific modifiers:', value: 'Only combos with that/those unit(s) doing the final hit: `f`.' })
      for (const key in unitList) {
        if (key === 'nb')
          continue

        if (replyData.description === undefined)
          replyData.description = `${unitList[key].name}: \`${key}\``
        else {
          replyData.description = `${replyData.description}\n${unitList[key].name}: \`${key}\``
        }
      }
    }

    return replyData
  },
  getUnit: function (unitCode) {
    if (unitCode.length < 2)
      throw 'You need a minimum of two characters to return the stats for a specific unit!'
    if (!unitList[unitCode])
      throw `The unit you are looking for doesn't exist or is under a different code.\nTry \`${process.env.PREFIX}units\` to get the list of all units codes!`

    return { ...unitList[unitCode] }
  },
  getUnitFromArray: function (unitArray, replyData) {
    // Rebuilding aliases
    if (unitArray.some(x => x.toLowerCase().startsWith('gbs'))) {
      unitArray = unitArray.filter(value => !value.toLowerCase().startsWith('gbs'))
      unitArray.push('gi')
      unitArray.push('bs')
    }
    if (unitArray.some(x => x.toLowerCase().startsWith('dbs'))) {
      unitArray = unitArray.filter(value => !value.toLowerCase().startsWith('dbs'))
      unitArray.push('de')
      unitArray.push('bs')
    }

    const unitKeys = Object.keys(unitList);
    let unitCode = unitArray.filter(value => unitKeys.includes(value.substring(0, 2).toLowerCase()))
    const isNaval = unitArray.filter(value => value.includes('bo') || value.includes('sh') || value.includes('bs'))
    const rangeOverride = unitArray.filter(value => value === 'r' || value === 'nr')

    if (unitCode.length === 0 && isNaval.length != 0)
      throw `You need to provide a unit inside the **\`${isNaval[0]}\`**\nYou can see the full unit list with\`${process.env.PREFIX}units\`.`
    if (unitCode.length === 0)
      throw 'We couldn\'t find one of the units.\n\nYou can get the list with `.units`'

    unitCode = unitCode.toString().substring(0, 2).toLowerCase()
    const unit = this.getUnit(unitCode)

    const currentHPArray = unitArray.filter(x => !isNaN(parseInt(x)) || x === 'v');

    if (currentHPArray.length > 0)
      unit.setHP(currentHPArray, replyData)

    const defenseBonusArray = unitArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd' || value.toLowerCase() === 'p')
    if (defenseBonusArray.length > 0)
      unit.addBonus(defenseBonusArray, replyData)

    const navalUnitArray = unitArray.filter(value => value.toLowerCase().startsWith('bs') || value.toLowerCase().startsWith('sh') || value.toLowerCase().startsWith('bo'))
    if (navalUnitArray.length > 0) {
      if (unit.onTheWater)
        unit.onTheWater(navalUnitArray)
      else
        throw `Are you really trying to put the **${unit.name}** in a naval unit...`
    }

    const final = unitArray.filter(value => value.toLowerCase() === 'f')
    if (final.length > 0)
      unit.final = true
    else
      unit.final = false

    if (rangeOverride[0] === 'r')
      unit.retaliation = true
    if (rangeOverride[0] === 'nr')
      unit.retaliation = false

    return unit
  },
  // eslint-disable-next-line no-unused-vars
  getBothUnitArray: function (args) {
    if (args.includes('/'))
      return args.split('/')
    else if (args.includes(','))
      return args.split(',')
    else
      throw 'You need an attacker and a defender separated using `,` or `/`'
  }
};