const deadText = require('./deadtexts')

module.exports = function(attackers, defender, embed) {
  if(attackers.length > 1)
    return [false]

  if(attackers[0].name !== 'Fire Dragon')
    return [false]

  embed = combat(attackers[0], defender, embed)
  return [true, embed]
}

function combat(attacker, defender, embed) {
  const aforce = attacker.att * attacker.currenthp / attacker.maxhp;
  const aforceSplash = attacker.att / 2 * attacker.currenthp / attacker.maxhp;
  const dforce = defender.def * defender.currenthp / defender.maxhp * defender.bonus;

  const totaldam = aforce + dforce;
  const totaldamSplash = aforceSplash + dforce;

  const defdiff = Math.round(aforce / totaldam * attacker.att * 4.5);
  const defdiffSplash = Math.round(aforceSplash / totaldamSplash * attacker.att / 2 * 4.5);
  defender.newhp = defender.currenthp - defdiff
  defender.newhpSplash = defender.currenthp - defdiffSplash

  let attdiff = 0
  if(defender.newhp <= 0) {
    defender.newhp = 0;
  } else {
    attdiff = Math.round(dforce / totaldam * defender.def * 4.5)
    attacker.currenthp = attacker.currenthp - attdiff;
  }

  const descriptionArray = []
  descriptionArray.push(`**${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description}:** ${attacker.currenthp} ➔ **${(attacker.currenthp < 1 ? deadText[Math.floor(Math.random() * deadText.length)] : attacker.currenthp)}** (*-${attdiff}*)`)

  embed.setDescription('This is the order for best outcome:')
    .addField('Attackers:', descriptionArray)
    .addField(`**${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}**:`, `${defender.currenthp} ➔ ${(defender.newhp < 1) ? deadText[Math.floor(Math.random() * deadText.length)] : defender.newhp} (*-${defdiff}*)\n||If splashed: ${defender.currenthp} ➔ ${(defender.newhpSplash < 1) ? deadText[Math.floor(Math.random() * deadText.length)] : defender.newhpSplash} (*-${defdiffSplash}*)||`)

  return embed
}