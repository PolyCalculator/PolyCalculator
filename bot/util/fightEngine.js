const deadText = require('./deadtexts')

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
    throw `This **${attacker.currenthp}hp ${attacker.name}** doesn't deal any damage to a **${defender.currenthp}hp ${defender.name}**.`

  let hpdefender = defender.currenthp;

  let i = 0

  for(; hpdefender > 0; i++) {
    hpdefender = hpdefender - defdiff;
    dforce = defender.def * hpdefender / defender.maxhp * defender.bonus;
    totaldam = aforce + dforce;
    defdiff = Math.round(aforce / totaldam * attacker.att * 4.5);
  }

  embed.setDescription(`You'll need this many hits from the ${attacker.name} to kill the ${defender.name}:`)
    .addField(`**Number of ${attacker.name}s**:`, `${i}`)

  return embed;
}

// eslint-disable-next-line no-unused-vars
module.exports.provideDefHP = function(attacker, defender, embed) {
  let aforce = attacker.att * attacker.currenthp / attacker.maxhp;
  const dforce = defender.def * defender.currenthp / defender.maxhp * defender.bonus;
  let totaldam;

  for(attacker.currenthp = 0;attacker.currenthp != attacker.maxhp;attacker.currenthp++) {
    aforce = attacker.att * attacker.currenthp / attacker.maxhp;
    totaldam = aforce + dforce;
    const defdiff = Math.round(aforce / totaldam * attacker.att * 4.5);
    if(defender.currenthp - defdiff <= 0)
      break
  }
  if(attacker.currenthp === attacker.maxhp) {
    embed.setTitle(`A full hp ${attacker.name} cannot kill a ${defender.currenthp}hp ${defender.name}.`)
  } else {
    embed
      .setTitle(`The minimum attacker hp required to kill a ${defender.currenthp}hp ${defender.name} is:`)
      .addField(`**${attacker.name}**:`, `${attacker.currenthp}`)
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
    embed.setTitle(`A ${attacker.currenthp}hp ${attacker.name} cannot even kill a 1hp ${defender.name}.`)
  } else {
    embed.setTitle(`A ${attacker.currenthp}hp ${attacker.name} will kill a defending:`)
      .addField(`**${defender.name}**:`, `Max: ${defender.currenthp}hp`)
  }

  return embed;
}