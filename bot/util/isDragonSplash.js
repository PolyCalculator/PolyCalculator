const deadText = require('./deadtexts')

module.exports = function (attackers, defender, replyData) {
  if (attackers.length > 1)
    return [false]

  if (attackers[0].name !== 'Fire Dragon')
    return [false]

  replyData = combat(attackers[0], defender, replyData)
  return [true, replyData]
}

function combat(attacker, defender, replyData) {
  const aforce = attacker.att * attacker.currenthp / attacker.maxhp;
  const aforceSplash = attacker.att * attacker.currenthp / attacker.maxhp;
  const dforce = defender.def * defender.currenthp / defender.maxhp * defender.bonus;

  const totaldam = aforce + dforce;
  const totaldamSplash = aforceSplash + dforce;

  const defdiff = Math.round(aforce / totaldam * attacker.att * 4.5);
  const defdiffSplash = Math.floor(Math.round(aforceSplash / totaldamSplash * attacker.att * 4.5) / 2);
  defender.newhp = defender.currenthp - defdiff
  defender.newhpSplash = defender.currenthp - defdiffSplash

  let attdiff = 0
  if (defender.newhp <= 0) {
    defender.newhp = 0;
  } else {
    attdiff = Math.round(dforce / totaldam * defender.def * 4.5)
    attacker.currenthp = attacker.currenthp - attdiff;
  }

  replyData.description = 'This is the order for best outcome:'
  replyData.fields.push({ name: 'Attackers:', value: `**${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description}:** ${attacker.currenthp} ➔ **${(attacker.currenthp < 1 ? deadText[Math.floor(Math.random() * deadText.length)] : attacker.currenthp)}** (*-${attdiff}*)` })
  replyData.fields.push({ name: `**${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defender.bonus === 1 ? '' : defender.bonus === 1.5 ? ' (protected)' : ' (walled)'}**:`, value: `${defender.currenthp} ➔ ${(defender.newhp < 1) ? deadText[Math.floor(Math.random() * deadText.length)] : defender.newhp} (*-${defdiff}*)\nIf splashed: ${defender.currenthp} ➔ ${(defender.newhpSplash < 1) ? deadText[Math.floor(Math.random() * deadText.length)] : defender.newhpSplash} (*-${defdiffSplash}*)` })

  return replyData
}