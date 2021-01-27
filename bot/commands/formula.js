module.exports = {
  name: 'formula',
  description: 'show the formula for calculating hp results.',
  aliases: ['f'],
  shortUsage(prefix) {
    return `${prefix}f`
  },
  longUsage(prefix) {
    return `${prefix}formula`
  },
  forceNoDelete: true,
  category: 'Other',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute: function (message, argsStr, replyData) {
    replyData.discord.title = 'Formula!'
    replyData.discord.description = 'Last block here is an arithmetic version.\nThe first blocks is in text format.'

    replyData.discord.fields.push({ name: 'Calculate the attacker\'s **force**', value: 'Multiply the attacker\' attack stat with its current HP and divide it by its max HP' })
    replyData.discord.fields.push({ name: 'Calculate the defender\'s **force**', value: 'Multiply the defender\'s defense stat with its current HP, divide it by its max HP and multiply it by the defense bonus (1, 1.5 or 4)' })
    replyData.discord.fields.push({ name: 'Calculate the total damage', value: 'Add the attacker\'s force with the defender\'s force' })
    replyData.discord.fields.push({ name: 'The defender\'s HP lost', value: 'Divide the attacker\'s force by the total damage, timed by the attacker\'s attack stat and by 4.5\nResult rounded up' })
    replyData.discord.fields.push({ name: 'The attacker\'s HP lost', value: 'Divide the defender\'s force by the total damage, timed by the defender\'s attack stat and by 4.5\nResult rounded down' })

    const shortFormula = []
    shortFormula.push('\nattacker.force = attacker.attackStats x attacker.currentHP / attacker.maxHP\n')
    shortFormula.push('defender.force = defender.defenderStats x solution.defenderHP / defender.maxhp x defender.bonus\n')
    shortFormula.push('totalDamage = attacker.force + defender.force\n')
    shortFormula.push('defender.HPlost = attacker.force / totalDamage x attacker.attackStats x 4.5 rounded up\n')
    shortFormula.push('attacker.HPlost = defender.force / totalDamage x defender.defenderStats x 4.5 round down\n')
    replyData.discord.fields.push({ name: 'Arithmetic format:', value: shortFormula })

    return replyData
  }
};