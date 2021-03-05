/* eslint-disable no-unused-vars */
const deadText = require('./deadtexts')
const { attackerCalc, defenderCalc } = require('./util')
const { generateArraySequences, generateSequences, multicombat, evaluate, simpleCombat } = require('./sequencer')

module.exports.optim = function (attackers, defender, replyData) {
  const arrayNbAttackers = generateArraySequences(attackers.length)
  const sequences = generateSequences(arrayNbAttackers)
  let solutions = []

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

  if (bestSolution.wasPoisoned)
    defender.bonus = 0.8

  if (bestSolution.defenderHP === defender.currenthp)
    throw `No unit can make a dent in this ${defender.name}${defender.description}...`

  const descriptionArray = []
  let defHP = defender.currenthp
  const deathText = deadText[Math.floor(Math.random() * deadText.length)]
  bestSolution.finalSequence.forEach((seqIndex, order) => {
    seqIndex--
    defHP = defHP - bestSolution.hpDealt[order]
    attackers[seqIndex].defHP = defHP
    replyData.outcome.attackers.push({
      name: `${attackers[seqIndex].vetNow ? 'Veteran ' : ''}${attackers[seqIndex].name}${attackers[seqIndex].description}`,
      beforehp: attackers[seqIndex].currenthp,
      afterhp: attackers[seqIndex].currenthp - bestSolution.hpLoss[order],
      maxhp: attackers[seqIndex].maxhp,
      hplost: bestSolution.hpLoss[order],
      hpdefender: defHP
    })
    descriptionArray.push(`${attackers[seqIndex].vetNow ? 'Veteran ' : ''}${attackers[seqIndex].name}${attackers[seqIndex].description}: ${attackers[seqIndex].currenthp} ➔ ${attackers[seqIndex].currenthp - bestSolution.hpLoss[order]} (**${defHP}**)`)
  })

  const defenderBonus = ({
    0.8: ' (poisoned)',
    1: '',
    1.5: ' (protected)',
    4: ' (walled)'
  })[defender.bonus]

  replyData.outcome.defender = {
    name: `${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defenderBonus}`,
    currenthp: defender.currenthp,
    afterhp: defHP,
    maxhp: defender.maxhp,
    hplost: defender.currenthp - defHP,
  }

  replyData.discord.description = 'This is the order for best outcome:'
  replyData.discord.fields.push({ name: 'Attacker: startHP ➔ endHP (enemyHP)', value: descriptionArray })
  replyData.discord.fields.push({ name: `**${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defenderBonus}**:`, value: `${defender.currenthp} ➔ ${(bestSolution.defenderHP < 1) ? deathText : bestSolution.defenderHP}` })

  return replyData
}

module.exports.calc = function (attackers, defender, replyData) {
  const sequence = []
  for (let i = 1; i <= attackers.length; i++) {
    sequence.push(i)
  }

  const attackersSorted = []

  for (let j = 0; j < sequence.length; j++) {
    attackersSorted.push(attackers[sequence[j] - 1]);
  }

  const solution = multicombat(attackersSorted, defender, sequence)

  if (solution.wasPoisoned)
    defender.bonus = 0.8

  if (solution.defenderHP === defender.currenthp)
    throw `No unit can make a dent in this ${defender.name}${defender.description}...`

  const descriptionArray = []
  let defHP = defender.currenthp
  const deathText = deadText[Math.floor(Math.random() * deadText.length)]
  solution.finalSequence.forEach((seqIndex, order) => {
    seqIndex--
    defHP = defHP - solution.hpDealt[order]
    replyData.outcome.attackers.push({
      name: `${attackers[seqIndex].vetNow ? 'Veteran ' : ''}${attackers[seqIndex].name}${attackers[seqIndex].description}`,
      beforehp: attackers[seqIndex].currenthp,
      afterhp: attackers[seqIndex].currenthp - solution.hpLoss[order],
      maxhp: attackers[seqIndex].maxhp,
      hplost: solution.hpLoss[order],
      hpdefender: defHP
    })
    descriptionArray.push(`**${attackers[seqIndex].vetNow ? 'Veteran ' : ''}${attackers[seqIndex].name}${attackers[seqIndex].description}:** ${attackers[seqIndex].currenthp} ➔ ${attackers[seqIndex].currenthp - solution.hpLoss[order]} (**${defHP}**)`)
  })

  const defenderBonus = ({
    0.8: ' (poisoned)',
    1: '',
    1.5: ' (protected)',
    4: ' (walled)'
  })[defender.bonus]

  replyData.outcome.defender = {
    name: `${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defenderBonus}`,
    currenthp: defender.currenthp,
    afterhp: defHP,
    maxhp: defender.maxhp,
    hplost: defender.currenthp - defHP,
  }

  replyData.discord.description = 'The outcome of the fight is:'
  replyData.discord.fields.push({ name: 'Attacker: startHP ➔ endHP (enemyHP)', value: descriptionArray })
  replyData.discord.fields.push({ name: `**${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defenderBonus}**:`, value: `${defender.currenthp} ➔ ${(solution.defenderHP < 1) ? deathText : solution.defenderHP}` })

  return replyData
}

module.exports.bulk = function (attacker, defender, replyData) {
  const aforce = attacker.att * attacker.currenthp / attacker.maxhp;
  let dforce = defender.def * defender.currenthp / defender.maxhp * defender.bonus;

  let totaldam = aforce + dforce;
  let defdiff = attackerCalc(aforce, totaldam, attacker);

  const defenderBonus = ({
    0.8: ' (poisoned)',
    1: '',
    1.5: ' (protected)',
    4: ' (walled)'
  })[defender.bonus]

  if (attacker.att <= 0)
    throw `When will you ever be able to attack with a **${attacker.name}**...`
  if (defdiff < 1)
    throw `This **${attacker.currenthp}hp ${attacker.name}${attacker.description}** doesn't deal any damage to a **${defender.currenthp}hp ${defender.name}${defender.description}${defenderBonus}**.`

  let hpdefender = defender.currenthp;

  let i = 0

  for (; hpdefender > 0; i++) {
    hpdefender = hpdefender - defdiff;
    dforce = defender.def * hpdefender / defender.maxhp * defender.bonus;
    totaldam = aforce + dforce;
    defdiff = attackerCalc(aforce, totaldam, attacker);

    if (attacker.poisonattack || (attacker.poisonexplosion && attacker.exploding))
      defender.bonus = 0.8
  }

  replyData.outcome.attackers.push({
    name: `${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description}`,
    currenthp: attacker.currenthp,
    maxhp: attacker.maxhp,
  })

  replyData.outcome.defender = {
    name: `${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defenderBonus}`,
    currenthp: defender.currenthp,
    maxhp: defender.maxhp,
  }

  replyData.outcome.response = i

  replyData.discord.title = `You'll need this many hits from a ${attacker.name}${attacker.description} to kill the ${defender.name}${defender.description}${defenderBonus}:`
  replyData.discord.fields.push({ name: `**Number of ${i > 1 && attacker.description === '' ? attacker.plural : attacker.name}${i > 1 && attacker.description !== '' ? attacker.description + 's' : attacker.description}**:`, value: `${i}` })

  return replyData
}

module.exports.provideDefHP = function (attacker, defender, replyData) {
  let aforce = attacker.att * attacker.currenthp / attacker.maxhp;
  const dforce = defender.def * defender.currenthp / defender.maxhp * defender.bonus;
  let totaldam

  for (attacker.currenthp = 0; attacker.currenthp <= attacker.maxhp; attacker.currenthp++) {
    aforce = attacker.att * attacker.currenthp / attacker.maxhp;
    totaldam = aforce + dforce;
    const defdiff = attackerCalc(aforce, totaldam, attacker);

    if (defender.currenthp - defdiff <= 0)
      break
  }

  const defenderBonus = ({
    0.8: ' (poisoned)',
    1: '',
    1.5: ' (protected)',
    4: ' (walled)'
  })[defender.bonus]

  replyData.outcome.attackers.push({
    name: `${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description}`,
    maxhp: attacker.maxhp,
  })

  replyData.outcome.defender = {
    name: `${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defenderBonus}`,
    currenthp: defender.currenthp,
    maxhp: defender.maxhp,
  }

  replyData.outcome.response = attacker.currenthp

  if (attacker.currenthp > attacker.maxhp) {
    replyData.discord.title = `A full hp ${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description} cannot kill a ${defender.currenthp}hp ${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defenderBonus}.`
  } else {
    replyData.discord.title = `The minimum attacker hp required to kill a ${defender.currenthp}hp ${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defenderBonus} is:`
    replyData.discord.fields.push({ name: `**${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description}**:`, value: `${attacker.currenthp}` })
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
    defdiff = attackerCalc(aforce, totaldam, attacker);

    if (defender.currenthp - defdiff <= 0)
      break
  }

  const defenderBonus = ({
    0.8: ' (poisoned)',
    1: '',
    1.5: ' (protected)',
    4: ' (walled)'
  })[defender.bonus]

  replyData.outcome.attackers.push({
    name: `${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description}`,
    maxhp: attacker.maxhp,
  })

  replyData.outcome.defender = {
    name: `${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defenderBonus}`,
    currenthp: defender.currenthp,
    maxhp: defender.maxhp,
  }

  replyData.outcome.response = defender.currenthp

  if (defender.currenthp === 0) {
    replyData.discord.title = `A ${attacker.currenthp}hp ${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description} cannot even kill a 1hp ${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defenderBonus}.`
  } else {
    replyData.discord.title = `A ${attacker.currenthp}hp ${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description} will kill a defending:`
    replyData.discord.fields.push({ name: `**${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defenderBonus}**:`, value: `Max: ${defender.currenthp}hp` })
  }

  return replyData
}

module.exports.dragon = function (dragon, direct, splashed, replyData) {
  const deathText = deadText[Math.floor(Math.random() * deadText.length)]

  const directBonus = ({
    0.8: ' (poisoned)',
    1: '',
    1.5: ' (protected)',
    4: ' (walled)'
  })[direct.bonus]

  const directDiff = simpleCombat(dragon, direct)
  replyData.discord.fields.push({ name: 'Dragon: startHP ➔ endHP', value: `${dragon.currenthp} ➔ ${dragon.currenthp - directDiff.att <= 0 ? deathText : dragon.currenthp - directDiff.att}` })
  replyData.discord.fields.push({ name: `**${direct.vetNow ? 'Veteran ' : ''}${direct.name}${direct.description}${directBonus}**:`, value: `${direct.currenthp} ➔ ${(direct.currenthp - directDiff.def < 1) ? deathText : direct.currenthp - directDiff.def}` })

  splashed.forEach(splash => {
    const deathText2 = deadText[Math.floor(Math.random() * deadText.length)]
    const splashDiff = simpleCombat(dragon, splash)
    const splashDamage = Math.floor(splashDiff.def / 2)

    replyData.discord.fields.push({ name: `**${splash.vetNow ? 'Veteran ' : ''}${splash.name}${splash.description}${splash.bonus === 1 ? ' (splashed)' : splash.bonus === 1.5 ? ' (protected, splashed)' : ' (walled, splashed)'}**:`, value: `${splash.currenthp} ➔ ${(splash.currenthp - splashDamage < 1) ? deathText2 : splash.currenthp - splashDamage}` })
  })

  replyData.discord.title = 'The outcome of the fight is:'

  return replyData
}