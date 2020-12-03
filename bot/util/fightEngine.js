/* eslint-disable no-unused-vars */
const deadText = require('./deadtexts')
const isDragonSplash = require('./isDragonSplash')
const { generateArraySequences, generateSequences, multicombat, evaluate } = require('./sequencer')

module.exports.optim = function (attackers, defender, replyData) {
  const arrayNbAttackers = generateArraySequences(attackers.length)
  const sequences = generateSequences(arrayNbAttackers)
  let solutions = []

  const dragonSplashArray = isDragonSplash(attackers, defender, replyData) // [bool conditionsSplashed, embedMessage]

  if (dragonSplashArray[0])
    return dragonSplashArray[1]

  const hasFinal = attackers.some(attacker => attacker.final === true)
  sequences.forEach(function (sequence) {
    const attackersSorted = []

    for (let j = 0; j < sequence.length; j++) {
      attackersSorted.push(attackers[sequence[j] - 1]);
    }

    const solution = multicombat(attackersSorted, defender, sequence)

    solutions.push(solution)
  })

  // console.log(solutions)
  if (hasFinal)
    solutions = solutions.filter(x => attackers[x.finalSequence[x.finalSequence.length - 1] - 1].final)

  let bestSolution = solutions[0]

  if (!bestSolution)
    throw 'There is no order that can conform to your request.\nMaybe try without the `f`?'
  solutions.forEach((solution) => {
    if (evaluate(bestSolution, solution))
      bestSolution = solution
  })

  if (bestSolution.defenderHP === defender.currenthp)
    throw `No unit can make a dent in this ${defender.name}${defender.description}...`

  const descriptionArray = []
  let defHP = defender.currenthp
  const deathText = deadText[Math.floor(Math.random() * deadText.length)]
  bestSolution.finalSequence.forEach((seqIndex, order) => {
    seqIndex--
    defHP = defHP - bestSolution.hpDealt[order]
    descriptionArray.push(`${attackers[seqIndex].vetNow ? 'Veteran ' : ''}${attackers[seqIndex].name}${attackers[seqIndex].description}: ${attackers[seqIndex].currenthp} ➔ ${attackers[seqIndex].currenthp - bestSolution.hpLoss[order]} (**${defHP}**)`)
  })

  // console.log(descriptionArray)
  replyData.description = 'This is the order for best outcome:'
  replyData.fields.push({ name: 'Attacker: startHP ➔ endHP (enemyHP)', value: descriptionArray })
  replyData.fields.push({ name: `**${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}**:`, value: `${defender.currenthp} ➔ ${(bestSolution.defenderHP < 1) ? deathText : bestSolution.defenderHP}` })

  return replyData
}

module.exports.calc = function (attackers, defender, replyData) {
  const dragonSplashArray = isDragonSplash(attackers, defender, replyData) // [bool conditionsSplashed, embedMessage]

  if (dragonSplashArray[0])
    return dragonSplashArray[1]

  const sequence = []
  for (let i = 1; i <= attackers.length; i++) {
    sequence.push(i)
  }

  const attackersSorted = []

  for (let j = 0; j < sequence.length; j++) {
    attackersSorted.push(attackers[sequence[j] - 1]);
  }

  const solution = multicombat(attackersSorted, defender, sequence)

  if (solution.defenderHP === defender.currenthp)
    throw `No unit can make a dent in this ${defender.name}${defender.description}...`

  const descriptionArray = []
  let defHP = defender.currenthp
  const deathText = deadText[Math.floor(Math.random() * deadText.length)]
  solution.finalSequence.forEach((seqIndex, order) => {
    seqIndex--
    defHP = defHP - solution.hpDealt[order]
    descriptionArray.push(`**${attackers[seqIndex].vetNow ? 'Veteran ' : ''}${attackers[seqIndex].name}${attackers[seqIndex].description}:** ${attackers[seqIndex].currenthp} ➔ ${attackers[seqIndex].currenthp - solution.hpLoss[order]} (**${defHP}**)`)
  })

  replyData.description = 'The outcome of the fight is:'
  replyData.fields.push({ name: 'Attacker: startHP ➔ endHP (enemyHP)', value: descriptionArray })
  replyData.fields.push({ name: `**${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}**:`, value: `${defender.currenthp} ➔ ${(solution.defenderHP < 1) ? deathText : solution.defenderHP}` })

  return replyData
}

module.exports.bulk = function (attacker, defender, replyData) {
  const aforce = attacker.att * attacker.currenthp / attacker.maxhp;
  let dforce = defender.def * defender.currenthp / defender.maxhp * defender.bonus;

  let totaldam = aforce + dforce;
  let defdiff = Math.round(aforce / totaldam * attacker.att * 4.5);

  if (attacker.att <= 0)
    throw `When will you ever be able to attack with a **${attacker.name}**...`
  if (defdiff < 1)
    throw `This **${attacker.currenthp}hp ${attacker.name}${attacker.description}** doesn't deal any damage to a **${defender.currenthp}hp ${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}**.`

  let hpdefender = defender.currenthp;

  let i = 0

  for (; hpdefender > 0; i++) {
    hpdefender = hpdefender - defdiff;
    dforce = defender.def * hpdefender / defender.maxhp * defender.bonus;
    totaldam = aforce + dforce;
    defdiff = Math.round(aforce / totaldam * attacker.att * 4.5);
  }

  replyData.title = `You'll need this many hits from a ${attacker.name}${attacker.description} to kill the ${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}:`
  replyData.fields.push({ name: `**Number of ${i > 1 && attacker.description === '' ? attacker.plural : attacker.name}${i > 1 && attacker.description !== '' ? attacker.description + 's' : attacker.description}**:`, value: `${i}` })

  return replyData
}

module.exports.provideDefHP = function (attacker, defender, replyData) {
  let aforce = attacker.att * attacker.currenthp / attacker.maxhp;
  const dforce = defender.def * defender.currenthp / defender.maxhp * defender.bonus;
  let totaldam

  for (attacker.currenthp = 0; attacker.currenthp <= attacker.maxhp; attacker.currenthp++) {
    aforce = attacker.att * attacker.currenthp / attacker.maxhp;
    totaldam = aforce + dforce;
    const defdiff = Math.round(aforce / totaldam * attacker.att * 4.5);
    if (defender.currenthp - defdiff <= 0)
      break
  }

  if (attacker.currenthp > attacker.maxhp) {
    replyData.title = `A full hp ${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description} cannot kill a ${defender.currenthp}hp ${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}.`
  } else {
    replyData.title = `The minimum attacker hp required to kill a ${defender.currenthp}hp ${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'} is:`
    replyData.fields.push({ name: `**${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description}**:`, value: `${attacker.currenthp}` })
  }

  return replyData;
}

module.exports.provideAttHP = function (attacker, defender, replyData) {
  const aforce = attacker.att * attacker.currenthp / attacker.maxhp;
  let dforce = defender.def * defender.currenthp / defender.maxhp * defender.bonus;
  let totaldam;

  if (attacker.att <= 0)
    throw `When will you ever be able to attack with a **${attacker.name}**...`

  defender.currenthp = defender.maxhp

  for (let defdiff = 0; defender.currenthp > 0; defender.currenthp--) {
    dforce = defender.def * defender.currenthp / defender.maxhp * defender.bonus;
    totaldam = aforce + dforce;
    defdiff = Math.round(aforce / totaldam * attacker.att * 4.5);
    if (defender.currenthp - defdiff <= 0)
      break
  }
  if (defender.currenthp === 0) {
    replyData.title = `A ${attacker.currenthp}hp ${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description} cannot even kill a 1hp ${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}.`
  } else {
    replyData.title = `A ${attacker.currenthp}hp ${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description} will kill a defending:`
    replyData.fields.push({ name: `**${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}**:`, value: `Max: ${defender.currenthp}hp` })
  }

  return replyData
}