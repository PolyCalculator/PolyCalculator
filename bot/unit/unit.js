module.exports = function buildMakeUnit() {
    return function makeUnit({
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
        canSplash = false,
        splashNow = false,
        final = false,
        canBoard = true,
    } = {}) {
        if (currenthp < 1)
            throw new Error('One of the units is already dead. RIP.')

        if (currenthp > maxhp)
            throw new Error("A unit can't have a higher hp than it's max")

        return {
            name: name,
            plural: plural,
            description: description,
            currenthp: currenthp,
            maxhp: maxhp,
            setHP: function (newHP, replyData) {
                if (newHP < 1) throw "I don't accept manual killings here."

                if (newHP > this.maxhp) {
                    if (this.vet && !this.vetNow) {
                        this.toVeteran(replyData)
                        if (newHP > this.maxhp) {
                            this.currenthp = this.maxhp
                        } else {
                            this.currenthp = newHP
                        }
                    }
                } else this.currenthp = newHP
            },
            vet: vet,
            vetNow: vetNow,
            toVeteran: function (replyData) {
                if (vet) {
                    if (!this.vetNow) {
                        this.vetNow = true
                        this.currenthp = this.currenthp + 5
                        this.maxhp = this.maxhp + 5
                    }
                } else
                    replyData.content.push([
                        `${plural} can't become veterans, so I ignored the request to make it veteran`,
                        {},
                    ])
            },
            att: att,
            def: def,
            bonus: bonus,
            setBonus: function (modifierArray, replyData) {
                const hasD =
                    modifierArray.includes('d') || modifierArray.includes('p')
                const hasW = modifierArray.includes('w')

                if (hasD && hasW) {
                    replyData.content.push([
                        "You've provided more than one bonus\nBy default, I take `w` over `d` if both are present.",
                        {},
                    ])
                    replyData.deleteContent = true
                    this.bonus = 4
                } else if (hasD) this.bonus = 1.5
                else if (hasW) {
                    if (fort) this.bonus = 4
                    else {
                        replyData.content.push([
                            `${plural} can't benefit from the wall defense bonus, so I used the single defense bonus instead.`,
                            {},
                        ])
                        replyData.deleteContent = true

                        this.bonus = 1.5
                    }
                }
            },
            fort: fort,
            range: range,
            retaliation: retaliation,
            overrideRange: function (newRange) {
                range = newRange
            },
            overrideRetaliation: function (overridesArray) {
                const hasR = overridesArray.includes('r')
                const hasNR = overridesArray.includes('nr')

                if (hasR && hasNR)
                    throw `Put your beer down and learn to type.\nYou can't put both \`r\` **and** \`nr\` for the ${currenthp}hp ${name}${description}...`
                else if (hasR) this.retaliation = true
                else if (hasNR) this.etaliation = false
            },
            poisonattack: poisonattack,
            poisonexplosion: poisonexplosion,
            selfPoison: function () {
                this.bonus = 0.7
            },
            toPoison: function (defender, replyData) {
                if (
                    this.poisonattack ||
                    (this.poisonexplosion && this.exploding)
                ) {
                    defender.bonus = 0.7
                } else
                    replyData.content.push([
                        `${plural} can't poison, so I'll procede without it`,
                        {},
                    ])
            },
            toBoost: function (replyData) {
                if (att > 0) {
                    this.name = `Boosted ${name}`
                    this.plural = `Boosted ${plural}`
                    this.att = att + 0.5
                } else
                    replyData.content.push([
                        `${plural} can't benefit from boosts because of their ${att} attack, so I'll procede without it`,
                        {},
                    ])
            },
            canExplode: canExplode,
            exploding: exploding,
            toExplode: function (replyData) {
                if (canExplode) {
                    this.description = `${description} 💥`
                    this.exploding = true
                } else
                    replyData.content.push([
                        `${plural} can't explode, so I calculated it as a direct attack`,
                        {},
                    ])
            },
            freeze: freeze,
            convert: convert,
            converted: converted,
            toConvert: function (convertedUnit, replyData) {
                if (convert) {
                    convertedUnit.description = `${description} (converted)`
                    convertedUnit.converted = true
                } else
                    replyData.content.push([
                        `${plural} can't convert, so I calculated it as a direct attack`,
                        {},
                    ])
            },
            canSplash: canSplash,
            splashNow: splashNow,
            toSplash: function (replyData) {
                if (this.canSplash == true) this.splashNow = true
                else
                    replyData.content.push([
                        `${plural} can't splash, so I calculated it as a normal attack`,
                        {},
                    ])
            },
            final: final,
            iAtt: function () {
                return BigInt(this.att * 100)
            },
            iBonus: function () {
                return BigInt(this.bonus * 10)
            },
            iDef: function () {
                return BigInt(this.def * 100 * this.bonus)
            },
            iMaxHp: function () {
                return BigInt(this.maxhp * 10)
            },
            iCurrentHp: function () {
                return BigInt(this.currenthp * 10)
            },
            makeFinal: function () {
                this.final = true
            },
            canBoard: canBoard,
            makeNaval: function (navalUnitCode) {
                if (this.bonus === 4)
                    throw 'Are you saying a naval unit can be in a city :thinking:...'

                if (navalUnitCode == 'rf') {
                    this.description = this.description + ' Raft'
                    this.att = 0
                    this.def = 1
                    this.retaliation = false
                }
                if (navalUnitCode == 'sc') {
                    this.description = this.description + ' Scout'
                    this.att = 2
                    this.def = 1
                    this.range = true
                }
                if (navalUnitCode == 'rm') {
                    this.description = this.description + ' Rammer'
                    this.att = 3
                    this.def = 3
                    this.range = false
                }
                if (navalUnitCode == 'bo') {
                    this.description = this.description + ' Bomber'
                    this.att = 3
                    this.def = 2
                    this.retaliation = false
                    this.range = true
                    this.canSplash = true
                }
                if (navalUnitCode == 'ob') {
                    this.description = this.description + ' (Old) Boat'
                    this.att = 1
                    this.def = 1
                    this.range = true
                }
                if (navalUnitCode == 'oh') {
                    this.description = this.description + ' (Old) Ship'
                    this.att = 2
                    this.def = 2
                    this.range = true
                }
                if (navalUnitCode == 'os') {
                    this.description = this.description + ' (Old) Battleship'
                    this.att = 4
                    this.def = 3
                    this.range = true
                }
            },
        }
    }
}
