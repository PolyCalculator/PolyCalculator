const fight = require('../util/fightEngine')
const { getBothUnitsArray, getUnitFromArray } = require('../unit/use-cases')

module.exports = {
    name: 'bulk',
    description:
        'calculate the number of attackers needed to kill the defender.',
    aliases: ['b'],
    shortUsage(prefix) {
        return `${prefix}b wa, de d`
    },
    longUsage(prefix) {
        return `${prefix}b warrior, defender d`
    },
    category: 'Advanced',
    permsAllowed: ['VIEW_CHANNEL'],
    usersAllowed: ['217385992837922819'],
    execute: function (message, argsStr, replyData, dbData) {
        if (argsStr.length === 0 || argsStr.includes('help')) {
            replyData.content.push([
                'Try `.help b` for more information on how to use this command!',
                {},
            ])
            return replyData
        }

        const unitsArray = getBothUnitsArray(argsStr)

        const attackerArray = unitsArray[0].split(/ +/).filter((x) => x != '')
        const defenderArray = unitsArray[1].split(/ +/).filter((x) => x != '')

        const attacker = getUnitFromArray(attackerArray, replyData)
        const defender = getUnitFromArray(defenderArray, replyData)
        replyData = fight.bulk(attacker, defender, replyData)

        dbData.attacker = attacker.name
        dbData.defender = defender.name
        dbData.attacker_description = attacker.description
        dbData.defender_description = defender.description
        dbData.reply_fields = [replyData.discord.fields[0].value.toString()]

        return replyData
    },
}
