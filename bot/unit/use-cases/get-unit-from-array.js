module.exports = function makeGetUnitFromArray ({ unitsList, handleAliases, getUnitFromCode }) {
    return function getUnitFromArray(unitArray, replyData) {
        // Get all unit keys
        const unitKeys = Object.keys(unitsList);

        // Remove empty strings
        unitArray = unitArray.filter(value => value)
        // Handle aliases
        unitArray = handleAliases(unitArray)

        let unitCode = unitArray.filter(value => unitKeys.includes(value.substring(0, 2).toLowerCase()))[0]

        // TODO WRONG FILTER ON NAVAL + MODIFIERS
        const navalAndModifiers = unitArray.filter(value => !unitKeys.includes(value.substring(0, 2).toLowerCase()))
        const navalUnitCode = navalAndModifiers.filter(value => value.includes('rf') || value.includes('sc') || value.includes('bo') || value.includes('rm') || value.includes('ob') || value.includes('oh') || value.includes('os'))[0]
        const unitModifiers = navalAndModifiers.filter(value => !(value.includes('rf') || value.includes('sc') || value.includes('bo') || value.includes('rm') || value.includes('ob') || value.includes('oh') || value.includes('os')))

        if (!unitCode) {
            if(navalUnitCode)
                replyData.content.push(['You didn\'t provide the hp of your naval unit, so we made it a Warrior\nFull hp naval units do the same damage regardless of their max hp', {}])
            else
                throw 'I couldn\'t find one of the units.\n\nYou can get the list with `/units`'
        } else
            unitCode = unitCode.substring(0, 2).toLowerCase()

        const unit = getUnitFromCode(unitCode)

        // s f
        if(unitModifiers.includes('d'))
            unit.setBonus(['d'], replyData)

        if(unitModifiers.includes('w')) {
            if(unitModifiers.includes('d'))
                unit.setBonus(['d', 'w'], replyData)
            else
                unit.setBonus(['w'], replyData)
        }

        if(unitModifiers.includes('b'))
            unit.toBoost(replyData)

        if(unitModifiers.includes('x'))
            unit.toExplode(replyData)

        if(unitModifiers.includes('v'))
            unit.toVeteran(replyData)

        if(unitModifiers.includes('r') && unitModifiers.includes('nr'))
            throw `Put your beer down and learn to type.\nYou can't put both \`r\` **and** \`nr\` for the ${unit.currenthp}hp ${unit.name}${unit.description}...`

        if(unitModifiers.includes('r') || unitModifiers.includes('nr'))
            unit.overrideRetaliation(unitModifiers)

        if(unitModifiers.includes('s'))
            unit.toSplash()

        if(unitModifiers.includes('f'))
            unit.makeFinal()

        const numberRegex = /[0-9]+/g
        const newHP = Number(unitModifiers.filter(modifier => numberRegex.test(modifier))[0])

        if(newHP)
            unit.setHP(newHP, replyData)

        return unit
    }
}