const unitsList = require('../util/unitsList')
const { handleAliases } = require('../util/util')

const buildMakeUnit = require('./unit')

const makeUnit = buildMakeUnit({ unitsList, handleAliases })

module.exports = { makeUnit }