module.exports = function buildMakeUnit ({ unitsList, handleAliases }) {
    return function makeUnit ({
        name = 'Default Warrior',
        plural = 'Default Warriors',
        description = '',
        currenthp = 10,
        maxhp = 10,
        vet = true,
        vetNow = false,
        att = 2,
        def = 2,
        bonus = 1,
        fort = true,
        range = false,
        retaliation = true,
        poisonattack = false,
        poisonexplosion = false,
        canExplode = false,
        exploding = false,
        freeze = false,
        convert = false,
        converted = false,
        splash = false,
        final = false
    } = {}) {
        if(currenthp < 1)
            throw new Error('One of the units is already dead. RIP.')

        if(currenthp > maxhp)
            throw new Error('A unit can\'t have a higher hp than it\'s max')

        return Object.freeze({
            name: name,
            plural: plural,
            description: description,
            currenthp: currenthp,
            maxhp: maxhp,
            iAtt: BigInt(att * 100),
            iBonus: BigInt(bonus * 10),
            iDef: BigInt(def * 100 * bonus),
            iMaxHp: BigInt(maxhp * 10),
            iCurrentHp: BigInt(currenthp * 10),
            setHP: (newHP, replyData) => {
                if (newHP < 1)
                    throw 'I don\'t accept manual killings here.'

                if(newHP > maxhp) {
                    if(newHP > maxhp + 5 && vet && !vetNow) {
                        replyData.content.push([`You can't set an hp for a unit higher than its veteran max hp, so I will top it at the veteran's hp`, {}])
                        replyData.deleteContent = true
                        toVeteran(replyData)
                    } else {
                        replyData.content.push([`You can't set an hp for a unit higher than its max hp, so I just topped the current hp off`, {}])
                        replyData.deleteContent = true
                        currenthp = maxhp
                    }
                } else
                    currenthp = newHP
            },
            vet: vet,
            vetNow: vetNow,
            toVeteran: (replyData) => { 
                if(vet) {
                    if(!vetNow) {
                        name = `Veteran ${name}`
                        plural = `Veteran ${plural}`
                        vetNow = true
                        setHP(currenthp + 5, replyData)
                    } else 
                        replyData.content.push([`This ${name} is already a veteran`, {}])
                } else
                    replyData.content.push([`${plural} can't become veterans, so I ignored the request to make it veteran`, {}])
            },
            att: att,
            def: def,
            bonus: bonus,
            setBonus: (modifierArray, replyData) => {
                const hasD = modifierArray.includes('d') || modifierArray.includes('p')
                const hasW = modifierArray.includes('w')

                if(hasD && hasW) {
                    replyData.content.push(['You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.', {}])
                    replyData.deleteContent = true
                    bonus = 4
                } else if (hasD)
                    bonus = 1.5
                else if (hasW) {
                    if(fort)
                        bonus = 4
                    else {
                        replyData.content.push([`${plural} can't benefit from the wall defense bonus, so I used the single defense bonus instead.`, {}])
                        replyData.deleteContent = true

                        bonus = 1.5
                    }
                }
            },
            fort: fort,
            range: range,
            retaliation: retaliation,
            overrideRange: (newRange) => { range = newRange },
            overrideRetaliation: (overridesArray) => {
                const hasR = overridesArray.includes('r')
                const hasNR = overridesArray.includes('nr')

                if(hasR && hasNR)
                    throw `Put your beer down and learn to type.\nYou can't put both \`r\` **and** \`nr\` for the ${currenthp}hp ${name}${description}...`
                else if (hasR)
                    retaliation = true
                else if (hasNR)
                    retaliation = false
            },
            poisonattack: poisonattack,
            poisonexplosion: poisonexplosion,
            toPoison: (defender) => {
                if(poisonattack || (poisonexplosion && exploding)) {
                    defender.bonus = 0.7
                } else
                    replyData.content.push([`${plural} can't poison, so I'll procede without it`, {}])
            },
            toBoost: () => {
                if(att > 0) {
                    name = `Boosted ${name}`
                    plural = `Boosted ${plural}`
                    att = att + 0.5
                } else
                    replyData.content.push([`${plural} can't benefit from boosts because of their ${att} attack, so I'll procede without it`, {}])
            },
            canExplode: canExplode,
            exploding: exploding,
            toExplode: (replyData) => {
                if(canExplode) {
                    description = `${description} 💥`
                    exploding = true
                } else
                    replyData.content.push([`${plural} can't explode, so I calculated it as a direct attack`, {}])
            },
            freeze: freeze,
            convert: convert,
            converted: converted,
            toConvert: (convertedUnit) => { 
                if(convert) {
                    convertedUnit.description = `${description} (converted)`
                    convertedUnit.converted = true
                } else
                    replyData.content.push([`${plural} can't convert, so I calculated it as a direct attack`, {}])
            },
            splash: splash,
            toSplash: () => {
                if(splash == undefined) {
                    description = `${description} 💦`
                    splash = true
                } else
                    replyData.content.push([`${plural} can't splash, so I calculated it as a normal attack`, {}])
            },
            final: final,
            makeFinal: () => { final = true },
            makeNaval: (navalUnitCode) => {
                if (bonus === 4)
                    throw 'Are you saying a naval unit can be in a city :thinking:...'

                if (navalUnitCode == 'rf') {
                    description = description + ' Raft'
                    att = 0
                    def = 1
                    overrideRetaliation(false)
                }
                if (navalUnitCode == 'sc') {
                    description = description + ' Scout'
                    att = 2
                    def = 1
                    overrideRange(true)
                }
                if (navalUnitCode == 'rm') {
                    description = description + ' Rammer'
                    att = 3
                    def = 3
                    overrideRange(false)
                }
                if (navalUnitCode == 'bo') {
                    description = description + ' Bomber'
                    att = 4
                    def = 2
                    overrideRetaliation(false)
                    range = true
                    splash = undefined
                }
                if (navalUnitCode == 'ob') {
                    description = description + ' (Old) Boat'
                    att = 1
                    def = 1
                    overrideRange(true)
                }
                if (navalUnitCode == 'oh') {
                    description = description + ' (Old) Ship'
                    att = 2
                    def = 2
                    overrideRange(true)
                }
                if (navalUnitCode == 'os') {
                    description = description + ' (Old) Battleship'
                    att = 4
                    def = 3
                    overrideRange(true)
                }
            }
        })
    }
}