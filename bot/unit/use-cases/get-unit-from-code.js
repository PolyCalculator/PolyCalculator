const { makeUnit }  = require('../')

module.exports = function makeGetUnitFromCode ({ unitsList }) {
    return function getUnitFromCode(unitCode) {
        if (unitCode.length < 2)
            throw 'You need a minimum of two characters to return the stats for a specific unit!'
        if (!unitsList[unitCode])
            throw 'The unit you are looking for doesn\'t exist or is under a different code.\nTry `/units` to get the list of all units codes!'

        return makeUnit({ ...unitsList[unitCode] })
    }
}