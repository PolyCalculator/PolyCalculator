// Dependencies
const unitsList = require('../../util/unitsList')
const { handleAliases } = require('../../util/util')

const makeGetUnitFromArray = require('./get-unit-from-array')
const makeGetUnitFromCode = require('./get-unit-from-code')
const makeMakeFinal = require('./make-final')
// const makeMakeNaval = require('./make-naval')
// const makeOverrideRange = require('./override-range')
// const makeOverrideRetaliation = require('./override-retaliation')
// const makeSetBonus = require('./set-bonus')
// const makeSetHP = require('./set-hp')
// const makeToBoost = require('./to-boost')
// const makeToConvert = require('./to-convert')
// const makeToExplode = require('./to-explode')
// const makeToPoison = require('./to-poison')
// const makeToSplash = require('./to-splash')
// const makeToVeteran = require('./to-veteran')

const getUnitFromCode = makeGetUnitFromCode({ unitsList })
const getUnitFromArray = makeGetUnitFromArray({ unitsList, handleAliases, getUnitFromCode })

console.log(getUnitFromArray([ 'de' ]), { content: [] })

const makeFinal = makeMakeFinal()
// const makeNaval = makeMakeNaval()
// const overrideRange = makeOverrideRange()
// const overrideRetaliation = makeOverrideRetaliation()
// const setBonus = makeSetBonus()
// const setHP = makeSetHP()
// const toBoost = makeToBoost()
// const toConvert = makeToConvert()
// const toExplode = makeToExplode()
// const toPoison = makeToPoison()
// const toSplash = makeToSplash()
// const toVeteran = makeToVeteran()

module.exports = { getUnitFromArray, getUnitFromCode, makeFinal }
// module.exports = { getUnitFromArray, makeFinal, makeNaval, overrideRange, overrideRetaliation, setBonus, setHP, toBoost, toConvert, toExplode, toPoison, toSplash, toVeteran }
