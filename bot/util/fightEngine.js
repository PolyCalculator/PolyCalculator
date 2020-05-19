const deadText = require('./deadtexts')
const { generateArraySequences, generateSequences, multicombat, evaluate } = require('./sequencer')

module.exports.multi = function(attackers, defender, embed) {
  const arrayNbAttackers = generateArraySequences(attackers.length)
  const sequences = generateSequences(arrayNbAttackers)
  const solutions = []

  sequences.forEach(function(sequence) {
    const attackersSorted = []

    for (let j = 0; j < sequence.length; j++) {
      attackersSorted.push(attackers[sequence[j] - 1]);
    }

    solutions.push(multicombat(attackersSorted, defender, sequence))
  })
  let bestSolution = solutions[0]

  solutions.forEach((solution) => {
    if(evaluate(bestSolution, solution))
      bestSolution = solution
  })

  if(bestSolution.defenderHP === defender.currenthp)
    throw `No unit can make a dent in this ${defender.name}${defender.description}...`

  if(bestSolution.defenderHP > 0)
    embed.addField(`These attackers won't kill the ${defender.name}`, `Remaining hp: **${bestSolution.defenderHP}**`)

  const descriptionArray = []
  bestSolution.finalSequence.forEach((seqIndex, order) => {
    seqIndex--
    descriptionArray.push(`${(attackers[seqIndex].currenthp - bestSolution.hpLoss[order] < 1 ? 'DEAD' : attackers[seqIndex].currenthp - bestSolution.hpLoss[order])} (${bestSolution.hpLoss[order] * -1}) **${attackers[seqIndex].vetNow ? 'Veteran ' : ''}${attackers[seqIndex].name}${attackers[seqIndex].description}**`)
  })

  embed.setTitle('This is the order for best outcome')
    .setDescription(descriptionArray)
  return embed
}

module.exports.calc = function(attacker, defender, embed) {
  const aforce = attacker.att * attacker.currenthp / attacker.maxhp;
  const dforce = defender.def * defender.currenthp / defender.maxhp * defender.bonus;
  const randomText = deadText[Math.floor(Math.random() * deadText.length)];

  if(attacker.att <= 0)
    throw `When will you ever be able to attack with a **${attacker.name}**...`

  const totaldam = aforce + dforce;
  const defdiff = Math.round(aforce / totaldam * attacker.att * 4.5);
  let hpdefender = defender.currenthp - defdiff;
  let attdiff = 0
  let hpattacker
  if(hpdefender <= 0) {
    hpattacker = attacker.currenthp;
    hpdefender = deadText[Math.floor(Math.random() * deadText.length)];
  } else if(!defender.retaliation) {
    hpattacker = attacker.currenthp
  } else {
    attdiff = Math.round(dforce / totaldam * defender.def * 4.5)
    hpattacker = attacker.currenthp - attdiff;
  }

  if(hpattacker <= 0) {
    hpattacker = randomText;
  }

  embed.setDescription('The outcome of the fight is:')
    .addField(`**${(attacker.name + attacker.description === defender.name + defender.description) ? 'Attacking ' : ''}${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description}**:`, `${hpattacker} (${attdiff * -1})`)
    .addField(`**${(attacker.name + attacker.description === defender.name + defender.description) ? 'Defending ' : ''}${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}**:`, `${hpdefender} (${defdiff * -1})`)

  if(attacker.name === 'Fire Dragon') {
    const halfdragondefdiff = Math.round(aforce / 2 / totaldam * attacker.att * 4.5);
    embed.addField('**If splashed**:', halfdragondefdiff)
  }

  return embed;
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

  embed.setDescription(`You'll need this many hits from the ${attacker.name}${attacker.description} to kill the ${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}:`)
    .addField(`**Number of ${attacker.name}${attacker.description}s**:`, `${i}`)

  return embed;
}

// eslint-disable-next-line no-unused-vars
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
    embed
      .setTitle(`The minimum attacker hp required to kill a ${defender.currenthp}hp ${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'} is:`)
      .addField(`**${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description}**:`, `${attacker.currenthp}`)
  }

  return embed;
}

// eslint-disable-next-line no-unused-vars
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