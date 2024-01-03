// Dependencies
const unitsList = require('../../util/unitsList');
const { handleAliases } = require('../../util/util');

const makeGetBothUnitsArray = require('./get-both-units-array');
const makeGetUnitFromArray = require('./get-unit-from-array');
const makeGetUnitFromCode = require('./get-unit-from-code');

const getBothUnitsArray = makeGetBothUnitsArray();
const getUnitFromCode = makeGetUnitFromCode({ unitsList });
const getUnitFromArray = makeGetUnitFromArray({
    unitsList,
    handleAliases,
    getUnitFromCode,
});

module.exports = { getBothUnitsArray, getUnitFromArray, getUnitFromCode };
