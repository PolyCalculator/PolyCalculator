// Dependencies
const unitsList = require('../../util/unitsList')
const { handleAliases } = require('../../util/util')

const makeGetUnitFromArray = require('./get-unit-from-array')
const makeGetUnitFromCode = require('./get-unit-from-code')

const getUnitFromCode = makeGetUnitFromCode({ unitsList })
const getUnitFromArray = makeGetUnitFromArray({ unitsList, handleAliases, getUnitFromCode })

module.exports = { getUnitFromArray, getUnitFromCode }
