const unitsList = require('../util/unitsList')
const { handleAliases, poison, boost } = require('../util/util')

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
  // eslint-disable-next-line no-unused-vars
  execute: function(message, argsStr, replyData, dbData) {
    if (argsStr.length != 0) {
      const argsArray = argsStr.split(/ +/)
      // const unitCode = argsArray[0].slice(0, 2).toLowerCase()

      const aliasedArray = handleAliases(argsArray)
      const unit = this.getUnitFromArray(aliasedArray)

      const descriptionArray = [];
      descriptionArray.push(`maxhp: ${unit.maxhp}`)
      descriptionArray.push(`vethp: ${unit.vet ? unit.maxhp + 5 : 'No'}`)
      descriptionArray.push(`attack: ${unit.att}`)
      descriptionArray.push(`defense: ${unit.def}`)

      replyData.outcome = unit
      replyData.discord.title = unit.name
      replyData.discord.description = descriptionArray.join('\n')
    } else {
      replyData.discord.title = 'All units by code'
      replyData.discord.fields.push({ name: 'Naval unit codes to add to land units:', value: 'Raft: `rf`\nScout: `sc`\nRammer: `rm`\nBomber: `bo`\nAlso old naval units for now:\nBoat: `ob`\nShip: `oh`\nBattleship: `os`' })
      replyData.discord.fields.push({ name: 'Current hp:', value: 'Any number will be interpreted as current hp with a bunch of fail-safes' })
      replyData.discord.fields.push({
        name: 'Modifiers:', value: 'Poison: `p`\nBoost: `b`\nExploding: `x`\nVeteran: `v`\nSingle defense bonus: `d`\nWall defense bonus: `w`\nAdd `r` to the attacker to force the defender\'s retaliation.\nAdd `nr` to the attacker to force no retaliation on the  defender.\nAdd `s` to a dragon to calculate it\'s splash damage instead of direct hit.'
      })
      replyData.discord.fields.push({ name: '`.o` specific modifiers:', value: 'Only combos with that/those unit(s) doing the final hit: `f`' })

      replyData.outcome = []
      for (const key in unitsList) {
        if (key === 'nb')
          continue

        replyData.outcome.push({ code: key, ...unitsList[key] })
        if (replyData.discord.description === undefined)
          replyData.discord.description = `${unitsList[key].name}: \`${key}\``
        else {
          replyData.discord.description = `${replyData.discord.description}\n${unitsList[key].name}: \`${key}\``
        }
      }
    }

    return replyData
  },
  getUnit: function(unitCode) {
    if (unitCode.length < 2)
      throw 'You need a minimum of two characters to return the stats for a specific unit!'
    if (!unitsList[unitCode])
      throw 'The unit you are looking for doesn\'t exist or is under a different code.\nTry `/units` to get the list of all units codes!'

    return { ...unitsList[unitCode] }
  },
  getUnitFromArray: function(unitArray, replyData) {
    unitArray = handleAliases(unitArray)

    const unitKeys = Object.keys(unitsList);
    let unitCode = unitArray.filter(value => unitKeys.includes(value.substring(0, 2).toLowerCase()))
    const isNaval = unitArray.filter(value => value.includes('rf') || value.includes('sc') || value.includes('bo') || value.includes('rm') || value.includes('ob') || value.includes('oh') || value.includes('os'))
    const rangeOverride = unitArray.filter(value => value === 'r' || value === 'nr')

    const currentHPArray = unitArray.filter(x => !isNaN(parseInt(x)) || x === 'v');

    if (unitCode.length === 0 && isNaval.length != 0) {
      if(currentHPArray.length !== 0)
        throw `You need to provide a unit inside the **\`${isNaval[0]}\`**\nYou can see the full unit list with\`/units\`.`
      else {
        unitCode = ['wa']
        replyData.content.push(['You didn\'t provide the hp of your naval unit, so we made it a Warrior\nFull hp naval units do the same damage regardless of their max hp', {}])
      }
    }

    if (unitCode.length === 0)
      throw 'We couldn\'t find one of the units.\n\nYou can get the list with `/units`'

    unitCode = unitCode.toString().substring(0, 2).toLowerCase()
    const unit = this.getUnit(unitCode)

    if (currentHPArray.length > 0)
      unit.setHP(currentHPArray, replyData)

    const defenseBonusArray = unitArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
    if (defenseBonusArray.length > 0)
      unit.addBonus(defenseBonusArray, replyData)

    const navalUnitArray = unitArray.filter(value => value.includes('rf') || value.includes('sc') || value.includes('bo') || value.includes('rm') || value.includes('ob') || value.includes('oh') || value.includes('os'))
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

    const toPoison = unitArray.filter(value => value.toLowerCase() === 'p')
    const toBoost = unitArray.filter(value => value.toLowerCase() === 'b')
    const toSplash = unitArray.some(value => value.toLowerCase() === 's')
    // const isDragon = unitArray.some(value => value.toLowerCase() === 'dr')
    // const isJuggernaut = unitArray.some(value => value.toLowerCase() === 'ju')

    if (toSplash && unit.splash !== false)
      unit.splash = true
    else if (toSplash) {
      throw `${unit.description ? unit.name + unit.description + "s" : unit.plural} can't splash\nRemove the \`s\` to proceed`
    }

    if (toPoison.length > 0 && toBoost.length > 0) {
      poison(unit)
      boost(unit)
    } else {
      if (toPoison.length > 0)
        poison(unit)

      if (toBoost.length > 0 && unit.att !== 0)
        boost(unit)
    }

    return unit
  },
  // eslint-disable-next-line no-unused-vars
  getBothUnitArray: function(args) {
    if (args.includes(','))
      return args.split(',')
    else
      throw 'You need an attacker and a defender separated using `,`'
  }
};