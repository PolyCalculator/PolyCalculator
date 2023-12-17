module.exports = function makeGetUnitFromArray ({ unitsList, handleAliases, getUnitFromCode }) {
    return function getUnitFromArray(unitArray, replyData) {
        unitArray = handleAliases(unitArray)

        const unitKeys = Object.keys(unitsList);
        let unitCode = unitArray.filter(value => unitKeys.includes(value.substring(0, 2).toLowerCase()))
        const isNaval = unitArray.filter(value => value.includes('rf') || value.includes('sc') || value.includes('bo') || value.includes('rm') || value.includes('ob') || value.includes('oh') || value.includes('os'))
        const navalUnitArray = unitArray.filter(value => value.includes('rf') || value.includes('sc') || value.includes('bo') || value.includes('rm') || value.includes('ob') || value.includes('oh') || value.includes('os'))
        if (navalUnitArray.length > 0) {
            if (unit.onTheWater)
            unit.onTheWater(navalUnitArray)
            else
            throw `Are you really trying to put the **${unit.name}** in a naval unit...`
        }
        
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

        const unit = getUnitFromCode(unitCode)

        return unit
    }
}