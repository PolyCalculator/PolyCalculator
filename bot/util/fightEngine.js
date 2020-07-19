const deadText = require('./deadtexts')
const { generateArraySequences, generateSequences, multicombat, evaluate } = require('./sequencer')

module.exports.optim = function(attackers, defender, embed) {
  const arrayNbAttackers = generateArraySequences(attackers.length)
  const sequences = generateSequences(arrayNbAttackers)
  const solutions = []

  const hasFinal = attackers.some(attacker => attacker.final === true)
  sequences.forEach(function(sequence) {
    const attackersSorted = []

    for (let j = 0; j < sequence.length; j++) {
      attackersSorted.push(attackers[sequence[j] - 1]);
    }

    if(hasFinal && attackersSorted[sequence.length - 1].final)
      solutions.push(multicombat(attackersSorted, defender, sequence))
    else if(!hasFinal)
      solutions.push(multicombat(attackersSorted, defender, sequence))
  })
  let bestSolution = solutions[0]

  solutions.forEach((solution) => {
    if(evaluate(bestSolution, solution))
      bestSolution = solution
  })

  if(bestSolution.defenderHP === defender.currenthp)
    throw `No unit can make a dent in this ${defender.name}${defender.description}...`

  const descriptionArray = []
  bestSolution.finalSequence.forEach((seqIndex, order) => {
    seqIndex--
    descriptionArray.push(`**${attackers[seqIndex].vetNow ? 'Veteran ' : ''}${attackers[seqIndex].name}${attackers[seqIndex].description}:** ${attackers[seqIndex].currenthp} ➔ **${(attackers[seqIndex].currenthp - bestSolution.hpLoss[order] < 1 ? deadText[Math.floor(Math.random() * deadText.length)] : attackers[seqIndex].currenthp - bestSolution.hpLoss[order])}** (*-${bestSolution.hpLoss[order]}*)`)
  })

  embed.setDescription('This is the order for best outcome:')
    .addField('Attackers:', descriptionArray)
    .addField(`**${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}**:`, `${defender.currenthp} ➔ ${(bestSolution.defenderHP < 1) ? deadText[Math.floor(Math.random() * deadText.length)] : bestSolution.defenderHP} (*-${bestSolution.hpDealt.reduce((a, b) => a + b, 0)}*)\n${'||HP dealt breakdown: [' + bestSolution.hpDealt.join(' ➔ ') + ']||'}`)

  return embed
}

module.exports.calc = function(attackers, defender, embed) {
  const sequence = []
  for(let i = 1; i <= attackers.length; i++) {
    sequence.push(i)
  }

  const attackersSorted = []

  for (let j = 0; j < sequence.length; j++) {
    attackersSorted.push(attackers[sequence[j] - 1]);
  }

  const solution = multicombat(attackersSorted, defender, sequence)

  if(solution.defenderHP === defender.currenthp)
    throw `No unit can make a dent in this ${defender.name}${defender.description}...`

  const descriptionArray = []
  solution.finalSequence.forEach((seqIndex, order) => {
    seqIndex--
    descriptionArray.push(`**${attackers[seqIndex].vetNow ? 'Veteran ' : ''}${attackers[seqIndex].name}${attackers[seqIndex].description}:** ${attackers[seqIndex].currenthp} ➔ **${(attackers[seqIndex].currenthp - solution.hpLoss[order] < 1 ? deadText[Math.floor(Math.random() * deadText.length)] : attackers[seqIndex].currenthp - solution.hpLoss[order])}** (*-${solution.hpLoss[order]}*)`)
  })

  embed.setDescription('The outcome of the fight is:')
    .addField('Attackers:', descriptionArray)
    .addField(`**${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}**:`, `${defender.currenthp} ➔ ${(solution.defenderHP < 1) ? deadText[Math.floor(Math.random() * deadText.length)] : solution.defenderHP} (*-${solution.hpDealt.reduce((a, b) => a + b, 0)}*)\n${'||HP dealt breakdown: [' + solution.hpDealt.join(' ➔ ') + ']||'}`)
  return embed
}

module.exports.bulk = function(attacker, defender, embed) {
  const aforce = attacker.att * attacker.currenthp / attacker.maxhp;
  let dforce = defender.def * defender.currenthp / defender.maxhp * defender.bonus;

  let totaldam = aforce + dforce;
  let defdiff = Math.round(aforce / totaldam * attacker.att * 4.5);

  if(attacker.att <= 0)
    throw `When will you ever be able to attack with a **${attacker.name}**...`
  if(defdiff < 1)
    throw `This **${attacker.currenthp}hp ${attacker.name}${attacker.description}** doesn't deal any damage to a **${defender.currenthp}hp ${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}**.`

  let hpdefender = defender.currenthp;

  let i = 0

  for(; hpdefender > 0; i++) {
    hpdefender = hpdefender - defdiff;
    dforce = defender.def * hpdefender / defender.maxhp * defender.bonus;
    totaldam = aforce + dforce;
    defdiff = Math.round(aforce / totaldam * attacker.att * 4.5);
  }

  embed.setTitle(`You'll need this many hits from the ${attacker.name}${attacker.description} to kill the ${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}:`)
    .addField(`**Number of ${attacker.name}${attacker.description}s**:`, `${i}`)

  return embed;
}

module.exports.provideDefHP = function(attacker, defender, embed) {
  let aforce = attacker.att * attacker.currenthp / attacker.maxhp;
  const dforce = defender.def * defender.currenthp / defender.maxhp * defender.bonus;
  let totaldam;

  for(attacker.currenthp = 0;attacker.currenthp <= attacker.maxhp;attacker.currenthp++) {
    aforce = attacker.att * attacker.currenthp / attacker.maxhp;
    totaldam = aforce + dforce;
    const defdiff = Math.round(aforce / totaldam * attacker.att * 4.5);
    if(defender.currenthp - defdiff <= 0)
      break
  }

  if(attacker.currenthp > attacker.maxhp) {
    embed.setTitle(`A full hp ${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description} cannot kill a ${defender.currenthp}hp ${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}.`)
  } else {
    embed.setTitle(`The minimum attacker hp required to kill a ${defender.currenthp}hp ${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'} is:`)
      .addField(`**${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description}**:`, `${attacker.currenthp}`)
  }

  return embed;
}

module.exports.provideAttHP = function(attacker, defender, embed) {
  const aforce = attacker.att * attacker.currenthp / attacker.maxhp;
  let dforce = defender.def * defender.currenthp / defender.maxhp * defender.bonus;
  let totaldam;

  if(attacker.att <= 0)
    throw `When will you ever be able to attack with a **${attacker.name}**...`

  defender.currenthp = defender.maxhp

  for(let defdiff = 0;defender.currenthp > 0;defender.currenthp--) {
    dforce = defender.def * defender.currenthp / defender.maxhp * defender.bonus;
    totaldam = aforce + dforce;
    defdiff = Math.round(aforce / totaldam * attacker.att * 4.5);
    if(defender.currenthp - defdiff <= 0)
      break
  }
  if(defender.currenthp === 0) {
    embed.setTitle(`A ${attacker.currenthp}hp ${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description} cannot even kill a 1hp ${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}.`)
  } else {
    embed.setTitle(`A ${attacker.currenthp}hp ${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description} will kill a defending:`)
      .addField(`**${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}**:`, `Max: ${defender.currenthp}hp`)
  }

  return embed;
}