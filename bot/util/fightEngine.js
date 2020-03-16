const deadText = require('./deadtexts')

module.exports.calc = (attacker, defender, embed) => {
  const aforce = attacker.att * attacker.currenthp / attacker.maxhp;
  const dforce = defender.def * defender.currenthp / defender.maxhp * defender.bonus;
  const randomText = deadText[Math.floor(Math.random() * deadText.length)];

  const totaldam = aforce + dforce;
  const defdiff = Math.round(aforce / totaldam * attacker.att * 4.5);
  let hpdefender = defender.currenthp - defdiff;
  let attdiff = 0
  let hpattacker
  if(hpdefender <= 0) {
    hpattacker = attacker.currenthp;
    hpdefender = deadText[Math.floor(Math.random() * deadText.length)];
  } else if(defender.retal === false) {
    hpattacker = attacker.currenthp
    attacker.name = attacker.name + ' (no retaliation)'
  } else {
    attdiff = Math.round(dforce / totaldam * defender.def * 4.5)
    hpattacker = attacker.currenthp - attdiff;
  }

  if(hpattacker <= 0) {
    hpattacker = randomText;
  }

  embed.setDescription('The outcome of the fight is:')
    .addField(`**${attacker.name}**:`, `${hpattacker} (${attdiff * -1})`)
    .addField(`**${defender.name}**:`, `${hpdefender} (${defdiff * -1})`)

  if(attacker.name === 'Fire Dragon') {
    embed.addField('**Splash damage**:', Math.floor(defdiff / 2))
  }

  return embed;
}

module.exports.bulk = (attacker, defender, embed) => {

}

module.exports.elimAttacker = (attacker, defender, embed) => {
  let totaldam;
  this.dhp = this.dmaxhp
  
    .setColor('#FA8072')
  for(let defdiff = 0;this.dhp > 0;this.dhp--) {
    dforce = this.ddef * this.dhp / this.dmaxhp * this.dbonus;
    totaldam = aforce + dforce;
    defdiff = Math.round(aforce / totaldam * this.aattack * 4.5);
    if(this.dhp - defdiff <= 0)
      break
  }
  if(this.dhp === 0) {
    helpEmbed.setTitle(`A ${attacker.currenthp}hp ${attacker.name} cannot even kill a 1hp ${defender.name}.`)
  } else {
    helpEmbed
      .setTitle(`The defender hp required for a kill with a ${attacker.currenthp}hp ${attacker.name} is:`)
      .addField(`**${defender.name}**:`, `${this.dhp}`)
  }

  return helpEmbed;
}

module.exports.elimDefender = (attacker, defender, embed) => {
  let totaldam;

  for(attacker.currenthp = 0;attacker.currenthp != this.amaxhp;attacker.currenthp++) {
    aforce = this.aattack * attacker.currenthp / this.amaxhp;
    totaldam = aforce + dforce;
    const defdiff = Math.round(aforce / totaldam * this.aattack * 4.5);
    if(this.dhp - defdiff <= 0)
      break
  }
  if(attacker.currenthp === this.amaxhp) {
    helpEmbed.setTitle(`A full hp ${attacker.name} cannot kill a ${this.dhp}hp ${defender.name}.`)
  } else {
    helpEmbed
      .setTitle(`The minimum attacker hp required to kill a ${this.dhp}hp ${defender.name} is:`)
      .addField(`**${attacker.name}**:`, `${attacker.currenthp}`)
  }

  return helpEmbed;
}