const deadText = require('./deadtexts')
const { attackerCalc, defenderCalc } = require('./util')

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

  const defdiff = attackerCalc(aforce, totaldam, attacker);
  const defdiffSplash = Math.floor(attackerCalc(aforce, totaldamSplash, attacker) / 2)

  defender.newhp = defender.currenthp - defdiff
  defender.newhpSplash = defender.currenthp - defdiffSplash

  let attdiff = 0
  if (defender.newhp <= 0) {
    defender.newhp = 0;
  } else {
    attdiff = defenderCalc(dforce, totaldam, defender)
    attacker.currenthp = attacker.currenthp - attdiff;
  }

  const defenderBonus = ({
    0.8: ' (poisoned)',
    1: '',
    1.5: ' (protected)',
    4: ' (walled)'
  })[defender.bonus]

  replyData.description = 'This is the order for best outcome:'
  replyData.fields.push({ name: 'Attackers:', value: `**${attacker.vetNow ? 'Veteran ' : ''}${attacker.name}${attacker.description}:** ${attacker.currenthp} ➔ **${(attacker.currenthp < 1 ? deadText[Math.floor(Math.random() * deadText.length)] : attacker.currenthp)}** (*-${attdiff}*)` })
  replyData.fields.push({ name: `**${defender.vetNow ? 'Veteran ' : ''}${defender.name}${defender.description}${defenderBonus}**:`, value: `${defender.currenthp} ➔ ${(defender.newhp < 1) ? deadText[Math.floor(Math.random() * deadText.length)] : defender.newhp} (*-${defdiff}*)\nIf splashed: ${defender.currenthp} ➔ ${(defender.newhpSplash < 1) ? deadText[Math.floor(Math.random() * deadText.length)] : defender.newhpSplash} (*-${defdiffSplash}*)` })

  return replyData
}