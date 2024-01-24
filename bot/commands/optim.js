const fight = require('../util/fightEngine')
const { getBothUnitsArray, getUnitFromArray } = require('../unit/use-cases')

module.exports = {
    name: 'optim',
    description:
        'returns the best order to use multiple attackers to kill one unit according to these priorities:\n\n - Kill/inflict most damage to the defending unit,\n - Minimize the number of attacker casualties,\n - Minimize the cumulative damage taken by the attackers left alive.\n - Use the least number of attackers',
    aliases: ['o', 'op', 'opti'],
    shortUsage(prefix) {
        return `\`${prefix}o wa sc, wa bo, wa rm, de d\``
    },
    longUsage(prefix) {
        return `\`${prefix}o wa sc, wa bo, wa rm, de d\``
    },
    category: 'Advanced',
    // category: 'Paid',
    permsAllowed: ['VIEW_CHANNEL'],
    usersAllowed: ['217385992837922819'],
    execute: async function (message, argsStr, replyData, dbData) {
        if (argsStr.length === 0 || argsStr.includes('help')) {
            replyData.content.push([
                'Try `.help o` for more information on how to use this command!',
                {},
            ])
            return replyData
        }

        try {
            const unitsArray = getBothUnitsArray(argsStr)

            if (unitsArray.length > 9)
                throw 'You are a greedy (or trolly) little shmuck.\nEntering more than 8 attackers is dangerous for my safety.'

            const defenderStr = unitsArray.pop()
            const defenderArray = defenderStr.split(/ +/).filter((x) => x != '')
            const attackers = []

            const defender = getUnitFromArray(defenderArray, replyData)

            unitsArray.forEach((x) => {
                const attackerArray = x.split(/ +/).filter((y) => y != '')
                const attacker = getUnitFromArray(attackerArray, replyData)
                if (attacker.att !== 0) attackers.push(attacker)
            })
            if (attackers.length === 0)
                throw 'You need to specify at least one unit with more than 0 attack.'

            replyData = await fight.optim(attackers, defender, replyData)

            dbData.attacker = attackers.length
            dbData.defender = defender.name
            dbData.defender_description = defender.description
            if (replyData.discord.fields.length > 1)
                dbData.reply_fields = [
                    replyData.discord.fields[0].value.toString(),
                    replyData.discord.fields[1].value,
                ]

            return replyData
        } catch (error) {
            throw error
        }
    },
}
