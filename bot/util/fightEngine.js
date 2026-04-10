/* eslint-disable no-unused-vars */
const deadText = require('./deadtexts')
const { attackerCalc, defenderCalc } = require('./util')
const {
    generateArraySequences,
    generateSequences,
    multicombat,
    evaluate,
    evaluateWithTarget,
} = require('./sequencer')

function getDefenderBonusLabel(defender) {
    const baseBonus = defender.poisoned ? defender.bonus * 2 : defender.bonus
    const baseLabel = { 1: '', 1.5: ' (protected)', 4: ' (walled)' }[baseBonus] || ''
    return baseLabel + (defender.poisoned ? ' (poisoned)' : '')
}

module.exports.optim = function (attackers, defender, replyData, target) {
    // For units with ax/axi modifier, create a paired exploding clone
    const explodePairs = [] // { hitIndex, explodeIndex, instant }
    const expandedAttackers = [...attackers]
    for (let i = 0; i < attackers.length; i++) {
        if (attackers[i].attackExplode) {
            const clone = Object.assign({}, attackers[i])
            clone.exploding = true
            clone.attackExplode = false
            clone.instantExplode = false
            clone.description = `${clone.description} 💥`
            clone._hitPairIndex = i
            const explodeIndex = expandedAttackers.length
            expandedAttackers.push(clone)
            const pair = { hitIndex: i, explodeIndex: explodeIndex }
            if (attackers[i].instantExplode) pair.instant = true
            explodePairs.push(pair)
        }
    }

    if (expandedAttackers.length > 8)
        throw 'Too many attackers (including explode options) for optimization.\nTry reducing the number of attackers.'

    const arrayNbAttackers = generateArraySequences(expandedAttackers.length)
    const sequences = generateSequences(arrayNbAttackers)
    let solutions = []

    const hasFinal = expandedAttackers.some(
        (attacker) => attacker.final === true,
    )
    sequences.forEach(function (sequence) {
        // Enforce: exploding version must come after its hit version
        // For instant (axi): explosion must be immediately after hit
        let valid = true
        for (const pair of explodePairs) {
            const hitPos = sequence.indexOf(pair.hitIndex + 1)
            const explodePos = sequence.indexOf(pair.explodeIndex + 1)
            if (explodePos < hitPos) {
                valid = false
                break
            }
            if (pair.instant && explodePos !== hitPos + 1) {
                valid = false
                break
            }
        }
        if (!valid) return

        const attackersSorted = []

        for (let j = 0; j < sequence.length; j++) {
            attackersSorted.push(expandedAttackers[sequence[j] - 1])
        }

        if (target) {
            // Generate solutions for each prefix length to allow early stopping
            for (let len = 1; len <= sequence.length; len++) {
                const subAttackers = attackersSorted.slice(0, len)
                const subSequence = sequence.slice(0, len)
                const solution = multicombat(subAttackers, defender, subSequence)
                solutions.push(solution)
            }
        } else {
            const solution = multicombat(attackersSorted, defender, sequence)
            solutions.push(solution)
        }
    })

    // console.log(solutions)
    if (hasFinal)
        solutions = solutions.filter(
            (x) =>
                expandedAttackers[
                    x.finalSequence[x.finalSequence.length - 1] - 1
                ].final,
        )

    let bestSolution = solutions[0]

    if (!bestSolution)
        throw 'There is no order that can conform to your request.\nMaybe try without the `f`?'
    const evaluator = target
        ? (best, sol) => evaluateWithTarget(best, sol, target)
        : evaluate
    solutions.forEach((solution) => {
        if (evaluator(bestSolution, solution)) bestSolution = solution
    })

    if (
        target &&
        target.mode === 'exact' &&
        bestSolution.defenderHP !== target.hp
    ) {
        throw `No combination leaves the defender at exactly ${target.hp} HP.\nTry \`t<${target.hp}\` to get below ${target.hp} HP instead.`
    }

    if (bestSolution.wasPoisoned && !defender.poisoned) {
        defender.bonus *= 0.5
        defender.poisoned = true
    }

    // if (bestSolution.defenderHP === defender.currenthp)
    //   throw `No unit can make a dent in this ${defender.name}${defender.description}...`

    const descriptionArray = []
    let defHP = defender.currenthp
    const deathText = deadText[Math.floor(Math.random() * deadText.length)]
    bestSolution.finalSequence.forEach((seqIndex, order) => {
        seqIndex--
        defHP = defHP - bestSolution.hpDealt[order]
        expandedAttackers[seqIndex].defHP = defHP

        // For exploding clones, show the HP after the paired hit
        let beforehp = expandedAttackers[seqIndex].currenthp
        if (expandedAttackers[seqIndex]._hitPairIndex !== undefined) {
            // Find the hit's hpLoss in the solution
            const hitSeqNum =
                expandedAttackers[seqIndex]._hitPairIndex + 1
            const hitOrder =
                bestSolution.finalSequence.indexOf(hitSeqNum)
            if (hitOrder !== -1) {
                beforehp = beforehp - bestSolution.hpLoss[hitOrder]
            }
        }

        replyData.outcome.attackers.push({
            name: `${expandedAttackers[seqIndex].vetNow ? 'Veteran ' : ''}${
                expandedAttackers[seqIndex].name
            }${expandedAttackers[seqIndex].description}`,
            beforehp: beforehp,
            afterhp: beforehp - bestSolution.hpLoss[order],
            maxhp: expandedAttackers[seqIndex].maxhp,
            hplost: bestSolution.hpLoss[order],
            hpdefender: defHP,
        })
        descriptionArray.push(
            `${expandedAttackers[seqIndex].vetNow ? 'Veteran ' : ''}${
                expandedAttackers[seqIndex].name
            }${expandedAttackers[seqIndex].description}: ${beforehp} ➔ ${
                beforehp - bestSolution.hpLoss[order]
            } (**${defHP}**)`,
        )
    })

    const defenderBonus = getDefenderBonusLabel(defender)

    replyData.outcome.defender = {
        name: `${defender.vetNow ? 'Veteran ' : ''}${defender.name}${
            defender.description
        }${defenderBonus}`,
        currenthp: defender.currenthp,
        afterhp: defHP,
        maxhp: defender.maxhp,
        hplost: defender.currenthp - defHP,
    }

    if (target) {
        const targetLabel =
            target.mode === 'exact'
                ? `Target: defender at exactly ${target.hp} HP`
                : `Target: defender below ${target.hp} HP`
        replyData.discord.description = `${targetLabel}\nThis is the order for best outcome:`
    } else {
        replyData.discord.description = 'This is the order for best outcome:'
    }
    replyData.discord.fields.push({
        name: 'Attacker: startHP ➔ endHP (enemyHP)',
        value: descriptionArray,
    })
    replyData.discord.fields.push({
        name: `**${defender.vetNow ? 'Veteran ' : ''}${defender.name}${
            defender.description
        }${defenderBonus}**:`,
        value: `${defender.currenthp} ➔ ${
            bestSolution.defenderHP <= 0
                ? `(0) ${deathText}`
                : bestSolution.defenderHP
        }`,
    })

    return replyData
}

module.exports.calc = function (attackers, defender, replyData) {
    // Expand ax/axi units: insert an exploding clone right after the attacker
    const expandedAttackers = []
    for (let i = 0; i < attackers.length; i++) {
        expandedAttackers.push(attackers[i])
        if (attackers[i].attackExplode) {
            const clone = Object.assign({}, attackers[i])
            clone.exploding = true
            clone.attackExplode = false
            clone.instantExplode = false
            clone.description = `${clone.description} 💥`
            clone._hitPairIndex = i
            expandedAttackers.push(clone)
        }
    }
    attackers = expandedAttackers

    const sequence = []
    for (let i = 1; i <= attackers.length; i++) {
        sequence.push(i)
    }

    const attackersSorted = []

    for (let j = 0; j < sequence.length; j++) {
        attackersSorted.push(attackers[sequence[j] - 1])
    }

    const solution = multicombat(attackersSorted, defender, sequence)

    if (solution.wasPoisoned && !defender.poisoned) {
        defender.bonus *= 0.5
        defender.poisoned = true
    }

    // if (solution.defenderHP === defender.currenthp)
    //   throw `No unit can make a dent in this ${defender.name}${defender.description}...`

    const descriptionArray = []
    let defHP = defender.currenthp
    const deathText = deadText[Math.floor(Math.random() * deadText.length)]
    solution.finalSequence.forEach((seqIndex, order) => {
        seqIndex--
        defHP = defHP - solution.hpDealt[order]
        replyData.outcome.attackers.push({
            name: `${attackers[seqIndex].vetNow ? 'Veteran ' : ''}${
                attackers[seqIndex].name
            }${attackers[seqIndex].description}`,
            beforehp: attackers[seqIndex].currenthp,
            afterhp: attackers[seqIndex].currenthp - solution.hpLoss[order],
            maxhp: attackers[seqIndex].maxhp,
            hplost: solution.hpLoss[order],
            hpdefender: defHP,
        })
        if (descriptionArray.toString().length < 1000)
            descriptionArray.push(
                `**${attackers[seqIndex].vetNow ? 'Veteran ' : ''}${
                    attackers[seqIndex].name
                }${attackers[seqIndex].description}:** ${
                    attackers[seqIndex].currenthp
                } ➔ ${
                    attackers[seqIndex].currenthp - solution.hpLoss[order]
                } (**${defHP}**)`,
            )
        else if (!descriptionArray.toString().endsWith('...'))
            descriptionArray.push('...')
    })

    const defenderBonus = getDefenderBonusLabel(defender)

    replyData.outcome.defender = {
        name: `${defender.vetNow ? 'Veteran ' : ''}${defender.name}${
            defender.description
        }${defenderBonus}`,
        currenthp: defender.currenthp,
        afterhp: defHP,
        maxhp: defender.maxhp,
        hplost: defender.currenthp - defHP,
    }

    replyData.discord.description = 'The outcome of the fight is:'
    replyData.discord.fields.push({
        name: 'Attacker: startHP ➔ endHP (enemyHP)',
        value: descriptionArray,
    })
    replyData.discord.fields.push({
        name: `**${defender.vetNow ? 'Veteran ' : ''}${defender.name}${
            defender.description
        }${defenderBonus}**:`,
        value: `${defender.currenthp} ➔ ${
            solution.defenderHP <= 0 ? `(0) ${deathText}` : solution.defenderHP
        }`,
    })

    return replyData
}

module.exports.bulk = function (attacker, defender, replyData) {
    const aforce =
        (attacker.iAtt() * attacker.iCurrentHp() * 100n) / attacker.iMaxHp()
    let dforce =
        (defender.iDef() * defender.iCurrentHp() * 100n) / defender.iMaxHp()

    let totaldam = aforce + dforce
    let defdiff = Number(attackerCalc(aforce, totaldam, attacker))

    const defenderBonusLabel = getDefenderBonusLabel(defender)

    if (attacker.att <= 0)
        throw `When will you ever be able to attack with a **${attacker.name}**...`
    if (defdiff < 1)
        throw `This **${attacker.currenthp}hp ${attacker.name}${attacker.description}** doesn't deal any damage to a **${defender.currenthp}hp ${defender.name}${defender.description}${defenderBonusLabel}**.`

    let hpdefender = defender.currenthp

    let i = 0

    for (; hpdefender > 0; i++) {
        hpdefender = hpdefender - defdiff
        dforce =
            (defender.iDef() * BigInt(hpdefender * 10) * 100n) /
            defender.iMaxHp()
        totaldam = aforce + dforce
        defdiff = Number(attackerCalc(aforce, totaldam, attacker))

        if (
            attacker.poisonattack ||
            (attacker.poisonexplosion && attacker.exploding)
        ) {
            if (!defender.poisoned) {
                defender.bonus *= 0.5
                defender.poisoned = true
            }
        }
    }

    replyData.outcome.attackers.push({
        name: `${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${
            attacker.description
        }`,
        currenthp: attacker.currenthp,
        maxhp: attacker.maxhp,
    })

    replyData.outcome.defender = {
        name: `${defender.vetNow ? 'Veteran ' : ''}${defender.name}${
            defender.description
        }${defenderBonusLabel}`,
        currenthp: defender.currenthp,
        maxhp: defender.maxhp,
    }

    replyData.outcome.response = i

    replyData.discord.title = `You'll need this many hits from a ${attacker.name}${attacker.description} to kill the ${defender.name}${defender.description}${defenderBonusLabel}:`
    replyData.discord.fields.push({
        name: `**Number of ${
            i > 1 && attacker.description === ''
                ? attacker.plural
                : attacker.name
        }${
            i > 1 && attacker.description !== ''
                ? attacker.description + 's'
                : attacker.description
        }**:`,
        value: `${i}`,
    })

    return replyData
}

module.exports.provideDefHP = function (attacker, defender, replyData) {
    let aforce =
        (attacker.iAtt() * attacker.iCurrentHp() * 100n) / attacker.iMaxHp()
    const dforce =
        (defender.iDef() * defender.iCurrentHp() * 100n) / defender.iMaxHp()

    let totaldam

    for (
        attacker.currenthp = 0;
        attacker.currenthp <= attacker.maxhp;
        attacker.currenthp++
    ) {
        aforce =
            (attacker.iAtt() * BigInt(attacker.currenthp * 10) * 100n) /
            attacker.iMaxHp()
        totaldam = aforce + dforce
        const defdiff = Number(attackerCalc(aforce, totaldam, attacker))

        if (defender.currenthp - defdiff <= 0) break
    }

    const defenderBonus = getDefenderBonusLabel(defender)

    replyData.outcome.attackers.push({
        name: `${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${
            attacker.description
        }`,
        maxhp: attacker.maxhp,
    })

    replyData.outcome.defender = {
        name: `${defender.vetNow ? 'Veteran ' : ''}${defender.name}${
            defender.description
        }${defenderBonus}`,
        currenthp: defender.currenthp,
        maxhp: defender.maxhp,
    }

    replyData.outcome.response = attacker.currenthp

    if (attacker.currenthp > attacker.maxhp) {
        replyData.discord.title = `A full hp ${
            attacker.vetNow ? 'Veteran ' : ''
        }${attacker.name}${attacker.description} cannot kill a ${
            defender.currenthp
        }hp ${defender.vetNow ? 'Veteran ' : ''}${defender.name}${
            defender.description
        }${defenderBonus}.`
    } else {
        replyData.discord.title = `The minimum attacker hp required to kill a ${
            defender.currenthp
        }hp ${defender.vetNow ? 'Veteran ' : ''}${defender.name}${
            defender.description
        }${defenderBonus} is:`
        replyData.discord.fields.push({
            name: `**${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${
                attacker.description
            }**:`,
            value: `${attacker.currenthp}`,
        })
    }

    return replyData
}

module.exports.provideAttHP = function (attacker, defender, replyData) {
    const aforce =
        (attacker.iAtt() * attacker.iCurrentHp() * 100n) / attacker.iMaxHp()
    let dforce =
        (defender.iDef() * defender.iCurrentHp() * 100n) / defender.iMaxHp()
    let totaldam

    if (attacker.att <= 0)
        throw `When will you ever be able to attack with a **${attacker.name}**...`

    defender.currenthp = defender.maxhp

    for (let defdiff = 0; defender.currenthp > 0; defender.currenthp--) {
        dforce =
            (defender.iDef() * BigInt(defender.currenthp * 10) * 100n) /
            defender.iMaxHp()
        totaldam = aforce + dforce
        defdiff = Number(attackerCalc(aforce, totaldam, attacker))

        if (defender.currenthp - defdiff <= 0) break
    }

    const defenderBonus = getDefenderBonusLabel(defender)

    replyData.outcome.attackers.push({
        name: `${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${
            attacker.description
        }`,
        maxhp: attacker.maxhp,
    })

    replyData.outcome.defender = {
        name: `${defender.vetNow ? 'Veteran ' : ''}${defender.name}${
            defender.description
        }${defenderBonus}`,
        currenthp: defender.currenthp,
        maxhp: defender.maxhp,
    }

    replyData.outcome.response = defender.currenthp

    if (defender.currenthp === 0) {
        replyData.discord.title = `A ${attacker.currenthp}hp ${
            attacker.vetNow ? 'Veteran ' : ''
        }${attacker.name}${attacker.description} cannot even kill a 1hp ${
            defender.vetNow ? 'Veteran ' : ''
        }${defender.name}${defender.description}${defenderBonus}.`
    } else {
        replyData.discord.title = `A ${attacker.currenthp}hp ${
            attacker.vetNow ? 'Veteran ' : ''
        }${attacker.name}${attacker.description} will kill a defending:`
        replyData.discord.fields.push({
            name: `**${defender.vetNow ? 'Veteran ' : ''}${defender.name}${
                defender.description
            }${defenderBonus}**:`,
            value: `Max: ${defender.currenthp}hp`,
        })
    }

    return replyData
}
