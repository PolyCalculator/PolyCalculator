const unitsList = require('../util/unitsList')
const { handleAliases } = require('../util/util')
const { getUnitFromArray, makeFinal, makeNaval, overrideRange, overrideRetaliation, setBonus, setHP, toBoost, toConvert, toExplode, toPoison, toSplash, toVeteran } = require('./use-cases')

const buildMakeUnit = require('./unit')

const makeUnit = buildMakeUnit({ unitsList, handleAliases })

module.exports = { makeUnit }
// console.log(typeof getUnitFromArray, getUnitFromArray)
// getUnitFromArray([ 'de' ], { content: [] })

// console.log(makeUnit('wa v'))