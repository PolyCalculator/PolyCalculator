// Pure combat-effect helpers and the alias map.
// This is the runtime-neutral half of the old bot/util/util.js — it has no
// discord.js or database coupling, so it loads identically under Node (Jest)
// and Deno (Edge Functions). The Discord/DB half of the old util.js
// (buildEmbed, saveStats, milestoneMsg, logInteraction) lives in the Edge
// Function _shared layer, not here.

function Round(n) {
    const num = (n / 10n) * 10n
    const num2 = num + 10n
    if (n - num < num2 - n) {
        return num
    }
    return num2
}

export function attackerCalc(aforce, totaldam, attacker) {
    return Round((aforce * attacker.iAtt() * 450n) / (1000n * totaldam)) / 10n
}

export function defenderCalc(aforce, totaldam, defender) {
    return (
        Round(
            (aforce * defender.iDef() * 45000n) /
                (1000n * totaldam * defender.iBonus()),
        ) / 10n
    )
}

export function poison(unit) {
    if (!unit.poisoned) {
        unit.bonus = Math.floor(unit.bonus * 5) / 10
        unit.poisoned = true
    }
}

export function freeze(unit) {
    if (!unit.frozen) {
        unit.description = `${unit.description} (frozen)`
        unit.retaliation = false
        unit.frozen = true
    }
}

export function boost(unit) {
    unit.name = `Boosted ${unit.name}`
    unit.plural = `Boosted ${unit.plural}`
    unit.att = unit.att + 0.5
}

export function convert(unit) {
    if (unit.converted) return

    unit.description = `${unit.description} (converted)`
    // unit.currenthp = 'Converted'
    unit.retaliation = false
    unit.converted = true
}

export function handleAliases(array) {
    const newArray = []

    const aliases = new Map(
        [...aliasMap.entries()].map(([key, value]) => [
            key.toLowerCase(),
            value,
        ]),
    )

    array.forEach((el) => {
        const lowerEl = el.toLowerCase()

        if (aliases.has(lowerEl)) {
            const aliasExpansion = aliases.get(lowerEl)
            // Always replace with two elements, even if one is empty
            newArray.push(aliasExpansion[0])
            if (aliasExpansion[1]) {
                newArray.push(aliasExpansion[1])
            }
        } else {
            newArray.push(el)
        }
    })

    return newArray
}

const aliasMap = new Map()

aliasMap.set('dsh', ['de', 'sc'])
aliasMap.set('dsc', ['de', 'sc'])
aliasMap.set('dbs', ['de', 'bo'])
aliasMap.set('dbo', ['de', 'bo'])
aliasMap.set('drm', ['de', 'rm'])

aliasMap.set('wsh', ['wa', 'sc'])
aliasMap.set('wsc', ['wa', 'sc'])
aliasMap.set('wbo', ['wa', 'bo'])
aliasMap.set('wbs', ['wa', 'bo'])
aliasMap.set('wrm', ['wa', 'rm'])

aliasMap.set('gbs', ['ju', ''])

aliasMap.set('dd', ['de', 'd'])
aliasMap.set('dw', ['de', 'w'])

aliasMap.set('am', ['ri', ''])
aliasMap.set('shark', ['sk', ''])

aliasMap.set('shaman', ['sh', ''])

aliasMap.set('?d', ['?', 'd'])
aliasMap.set('d?', ['d', '?'])

aliasMap.set('?w', ['?', 'w'])
aliasMap.set('w?', ['w', '?'])

export { aliasMap }
