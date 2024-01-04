const { makeUnit } = require('../')

module.exports = function makeGetUnitFromCode({ unitsList }) {
    return function getUnitFromCode(unitCode) {
        // if (unitCode.length < 2)
        //     throw 'You need a minimum of two characters to return the stats for a specific unit!'
        if (!unitsList[unitCode]) return makeUnit()
        else return makeUnit({ ...unitsList[unitCode] })
    }
}
