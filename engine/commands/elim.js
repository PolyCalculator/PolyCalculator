import * as fight from '../combat/fightEngine.js'
import {
    getBothUnitsArray,
    getUnitFromArray,
} from '../units/use-cases/index.js'

export const name = 'elim'
export const description =
    'allow to display the most optimal hp to eliminate units by putting a `?` on either side (attacker or defender).'
export const aliases = ['e']
export function shortUsage(prefix) {
    return `This command is too complicated to show an example. Try \`${prefix}help elim\``
}
export function longUsage(prefix) {
    return `\`${prefix}e gi 32, de w ?\`\nThis returns the strongest defender the 32hp giant can kill.\n\n\`${prefix}e gi ?, de w 6\`\nThis returns the weakest giant needed to kill a walled defender with 6hp.`
}
export const category = 'Advanced'
export const permsAllowed = ['VIEW_CHANNEL']
export const usersAllowed = ['217385992837922819']

export function execute(message, argsStr, replyData, dbData) {
    if (argsStr.length === 0 || argsStr.includes('help')) {
        replyData.content.push([
            'Try `.help e` for more information on how to use this command!',
            {},
        ])
        return replyData
    }

    const unitsArray = getBothUnitsArray(argsStr)

    const attackerArray = unitsArray[0].split(/ +/).filter((x) => x != '')
    const defenderArray = unitsArray[1].split(/ +/).filter((x) => x != '')

    const attacker = getUnitFromArray(attackerArray, replyData)
    const defender = getUnitFromArray(defenderArray, replyData)

    if (unitsArray[0].includes('?') && unitsArray[1].includes('?')) {
        throw 'I do not support elim with `?` on each side anymore.\nPlease add it either the attacker or the defender.'
    } else if (unitsArray[0].includes('?')) {
        replyData = fight.provideDefHP(attacker, defender, replyData)
    } else if (unitsArray[1].includes('?')) {
        replyData = fight.provideAttHP(attacker, defender, replyData)
    } else {
        throw 'You need a `?` on one of the side to use `/e`\n You can try `/help e` to understand more of it'
    }
    dbData.attacker = attacker.name
    dbData.defender = defender.name
    if (replyData.discord.fields.length < 1)
        dbData.reply_fields = ["Can't kill"]
    else {
        if (replyData.discord.fields[0])
            dbData.reply_fields = [replyData.discord.fields[0].value.toString()]
    }

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
