const { poison, freeze, convert } = require('./util')
const { attackerCalc, defenderCalc } = require('./util')

module.exports.generateArraySequences = function (length) {
    const array = []
    for (let i = 0; i < length; i++) {
        array.push(i + 1)
    }
    return array
}

module.exports.generateSequences = function (xs) {
    const ret = []

    for (let i = 0; i < xs.length; i = i + 1) {
        const rest = generateSubsequences(
            xs.slice(0, i).concat(xs.slice(i + 1)),
        )

        if (!rest.length) {
            ret.push([xs[i]])
        } else {
            for (let j = 0; j < rest.length; j = j + 1) {
                ret.push([xs[i]].concat(rest[j]))
            }
        }
    }
    return ret
}

function generateSubsequences(xs) {
    const ret = []

    for (let i = 0; i < xs.length; i = i + 1) {
        const rest = generateSubsequences(
            xs.slice(0, i).concat(xs.slice(i + 1)),
        )

        if (!rest.length) {
            ret.push([xs[i]])
        } else {
            for (let j = 0; j < rest.length; j = j + 1) {
                ret.push([xs[i]].concat(rest[j]))
            }
        }
    }
    return ret
}

module.exports.multicombat = function (attackers, defender, sequence) {
    let totalAttackersHP = 0

    attackers.forEach((attacker) => {
        totalAttackersHP = totalAttackersHP + attacker.currenthp
    })

    let solution = {
        defenderHP: defender.currenthp,
        attackerCasualties: 0,
        attackersHP: totalAttackersHP,
        hpLoss: [],
        hpDealt: [],
        sequence: sequence,
        finalSequence: [],
        wasPoisoned: false,
    }

    const initialBonus = defender.bonus
    const initialPoisoned = defender.poisoned || false

    for (const attacker of attackers) {
        if (attacker.convert) convert(defender)

        const index = attackers.indexOf(attacker)
        if (solution.defenderHP <= 0) break

        // if (defender.converted == true)
        //   continue

        solution = combat(attacker, defender, solution)
        solution.finalSequence.push(sequence[index])

        if (
            attacker.poisonattack ||
            (attacker.poisonexplosion && attacker.exploding)
        ) {
            poison(defender)
            attacker.toPoison(defender)
            solution.wasPoisoned = true
        }

        if (attacker.freeze) freeze(defender)
    }

    defender.bonus = initialBonus
    defender.poisoned = initialPoisoned

    return solution
}

// function doesNoDamage(attacker, defender, solution) {
//   const aforce = attacker.att * attacker.currenthp / attacker.maxhp;
//   const dforce = defender.def * solution.defenderHP / defender.maxhp * defender.bonus;

//   if (attacker.att <= 0)
//     return true

//   const totaldam = aforce + dforce;
//   const defdiff = attackerCalc(aforce, totaldam, attacker)

//   if (defdiff < 1)
//     return true
// }

function combat(attacker, defender, solution) {
    // TENTACLES PHASE: defender hits attacker BEFORE the attack
    let tentacleDmg = 0
    if (
        defender.tentacles &&
        !attacker.noTentacles &&
        !attacker.range
    ) {
        const tAforce =
            (defender.iAtt() * BigInt(solution.defenderHP * 10) * 100n) /
            defender.iMaxHp()
        const tDforce =
            (attacker.iDef() * attacker.iCurrentHp() * 100n) /
            attacker.iMaxHp()
        const tTotaldam = tAforce + tDforce
        tentacleDmg = Number(attackerCalc(tAforce, tTotaldam, defender))

        if (attacker.currenthp - tentacleDmg <= 0) {
            // Attacker killed by tentacles — no attack happens
            solution.hpDealt.push(0)
            solution.attackerCasualties = solution.attackerCasualties + 1
            solution.attackersHP = solution.attackersHP - attacker.currenthp
            solution.hpLoss.push(attacker.currenthp)
            return solution
        }
    }

    // Use reduced HP for attack force calculation if tentacles hit
    const effectiveHp = attacker.currenthp - tentacleDmg
    const aforce =
        (attacker.iAtt() * BigInt(effectiveHp * 10) * 100n) / attacker.iMaxHp()
    const dforce =
        (defender.iDef() * BigInt(solution.defenderHP * 10) * 100n) /
        defender.iMaxHp()

    const totaldam = aforce + dforce
    let defdiff = Number(attackerCalc(aforce, totaldam, attacker))
    if (attacker.splash || attacker.exploding || attacker.splashNow) {
        defdiff = attacker.oldSplash ? defdiff / 2 : Math.floor(defdiff / 2)
    }

    solution.hpDealt.push(defdiff)
    solution.defenderHP = solution.defenderHP - defdiff

    // Total attacker damage = tentacles + retaliation (if any)
    let attdiff = tentacleDmg
    let hpattacker
    if (solution.defenderHP <= 0) {
        hpattacker = effectiveHp
        solution.defenderHP = 0
    } else if (defender.tentacles && !attacker.noTentacles && !attacker.range) {
        // Tentacles replaces normal retaliation
        hpattacker = effectiveHp
    } else if (
        attacker.forceRetaliation === false ||
        defender.retaliation === false
    ) {
        hpattacker = effectiveHp
    } else if (
        attacker.range === true &&
        defender.range === false &&
        attacker.forceRetaliation !== true
    ) {
        hpattacker = effectiveHp
    } else if (attacker.exploding || attacker.name === 'Segment') {
        attdiff = attacker.currenthp
    } else {
        const retDmg = Number(defenderCalc(dforce, totaldam, defender))
        attdiff = tentacleDmg + retDmg
        attacker.attdiff = attdiff
        hpattacker = attacker.currenthp - attdiff
        if (hpattacker <= 0) {
            hpattacker = 0
            solution.attackerCasualties = solution.attackerCasualties + 1
        }
    }

    if (attacker.currenthp - attdiff < 1) {
        solution.attackersHP = solution.attackersHP - attacker.currenthp
        solution.hpLoss.push(attacker.currenthp)
    } else {
        solution.attackersHP = solution.attackersHP - attdiff
        solution.hpLoss.push(attdiff)
    }

    return solution
}

module.exports.evaluate = function (bestSolution, newSolution) {
    if (newSolution.defenderHP < bestSolution.defenderHP) return true
    else {
        if (newSolution.defenderHP === bestSolution.defenderHP) {
            if (
                bestSolution.attackerCasualties > newSolution.attackerCasualties
            )
                return true
            else {
                if (
                    bestSolution.attackerCasualties ===
                    newSolution.attackerCasualties
                ) {
                    if (bestSolution.attackersHP < newSolution.attackersHP)
                        return true
                    else {
                        if (
                            bestSolution.attackersHP === newSolution.attackersHP
                        ) {
                            if (
                                bestSolution.finalSequence.length >
                                newSolution.finalSequence.length
                            )
                                return true
                            else return false
                        }
                    }
                } else return false
            }
        } else return false
    }
}
