import * as fight from '../combat/fightEngine.js'
import {
    getBothUnitsArray,
    getUnitFromArray,
} from '../units/use-cases/index.js'

export const name = 'bulk'
export const description =
    'calculate the number of attackers needed to kill the defender.'
export const aliases = ['b']
export function shortUsage(prefix) {
    return `${prefix}b wa, de d`
}
export function longUsage(prefix) {
    return `${prefix}b warrior, defender d`
}
export const category = 'Advanced'
export const permsAllowed = ['VIEW_CHANNEL']
export const usersAllowed = ['217385992837922819']

export function execute(message, argsStr, replyData, dbData) {
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
}

export default {
    name,
    description,
    aliases,
    shortUsage,
    longUsage,
    category,
    permsAllowed,
    usersAllowed,
    execute,
}
