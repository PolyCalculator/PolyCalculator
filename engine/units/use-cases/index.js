// Dependencies
import unitsList from '../unitsList.js'
import { handleAliases } from '../../effects.js'

import makeGetBothUnitsArray from './get-both-units-array.js'
import makeGetUnitFromArray from './get-unit-from-array.js'
import makeGetUnitFromCode from './get-unit-from-code.js'

const getBothUnitsArray = makeGetBothUnitsArray()
const getUnitFromCode = makeGetUnitFromCode({ unitsList })
const getUnitFromArray = makeGetUnitFromArray({
    unitsList,
    handleAliases,
    getUnitFromCode,
})

export { getBothUnitsArray, getUnitFromArray, getUnitFromCode }
