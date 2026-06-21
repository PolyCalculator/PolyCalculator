// Static command catalog + the static-content commands (help, links, credits,
// formula). In the old bot these read `message.client.commands` and
// process.env.PREFIX at runtime; serverless we hold the same metadata as a
// literal and use '/' as the prefix (slash commands).
//
// Each renderer takes a fresh replyData (from engine.ts makeReplyData) and
// mutates discord.* exactly as the old commands/*.js did, so the embed output
// is identical.

const PREFIX = '/'

interface CmdMeta {
    name: string
    description: string
    aliases: string[]
    category: 'Main' | 'Advanced' | 'Other' | 'hidden'
    shortUsage: string
    longUsage: string
}

// Mirrors the descriptions/usages from bot/commands/*.js.
export const CATALOG: CmdMeta[] = [
    {
        name: 'calc',
        description:
            'calculate the outcome of a fight in the most simple format.',
        aliases: ['c'],
        category: 'Main',
        shortUsage: `\`${PREFIX}c wa 7, ri 5\` or\n\`${PREFIX}c wa sc, wa bo, wa rm, de d\``,
        longUsage: `\`${PREFIX}c warrior 7, rider 5\` or\n\`${PREFIX}calc warrior scout, warrior bomber, warrior rmmer, defender d\``,
    },
    {
        name: 'units',
        description:
            'show the list of unit codes. ***Units require 2 characters.***',
        aliases: ['u', 'unit'],
        category: 'Main',
        shortUsage: `${PREFIX}units`,
        longUsage: `${PREFIX}units`,
    },
    {
        name: 'optim',
        description:
            'returns the best order to use multiple attackers to kill one unit according to these priorities:\n\n - Kill/inflict most damage to the defending unit,\n - Minimize the number of attacker casualties,\n - Minimize the cumulative damage taken by the attackers left alive.\n - Use the least number of attackers',
        aliases: ['o', 'op', 'opti'],
        category: 'Advanced',
        shortUsage: `\`${PREFIX}o wa sc, wa bo, wa rm, de d\``,
        longUsage: `\`${PREFIX}o wa sc, wa bo, wa rm, de d\``,
    },
    {
        name: 'bulk',
        description:
            'calculate the number of attackers needed to kill the defender.',
        aliases: ['b'],
        category: 'Advanced',
        shortUsage: `${PREFIX}b wa, de d`,
        longUsage: `${PREFIX}b warrior, defender d`,
    },
    {
        name: 'elim',
        description:
            'allow to display the most optimal hp to eliminate units by putting a `?` on either side (attacker or defender).',
        aliases: ['e'],
        category: 'Advanced',
        shortUsage: `This command is too complicated to show an example. Try \`${PREFIX}help elim\``,
        longUsage: `\`${PREFIX}e gi 32, de w ?\`\nThis returns the strongest defender the 32hp giant can kill.\n\n\`${PREFIX}e gi ?, de w 6\`\nThis returns the weakest giant needed to kill a walled defender with 6hp.`,
    },
    {
        name: 'links',
        description:
            "show the link to invite the bot and to the developer's server.",
        aliases: ['link', 'inv', 'invite', 'server'],
        category: 'Other',
        shortUsage: `${PREFIX}links`,
        longUsage: `${PREFIX}links`,
    },
    {
        name: 'credits',
        description: 'show the team!',
        aliases: ['cred', 'credit'],
        category: 'Other',
        shortUsage: `${PREFIX}credits`,
        longUsage: `${PREFIX}credits`,
    },
    {
        name: 'formula',
        description: 'show the formula for calculating hp results.',
        aliases: ['f'],
        category: 'Other',
        shortUsage: `${PREFIX}formula`,
        longUsage: `${PREFIX}formula`,
    },
    {
        name: 'feedback',
        description: 'send feedback to the dev!',
        aliases: ['feed', 'comments', 'comment', 'suggestion'],
        category: 'Other',
        shortUsage: `${PREFIX}feedback`,
        longUsage: `${PREFIX}feedback`,
    },
]

// deno-lint-ignore no-explicit-any
type Reply = any

export function renderHelp(replyData: Reply, argsStr: string): Reply {
    const argsArray = argsStr.split(/ +/)
    const query = argsArray[0]
    const command =
        CATALOG.find((c) => c.name === query) ||
        CATALOG.find((c) => c.aliases.includes(query))

    if (argsStr.length != 0) {
        if (!command)
            throw `This command doesn't exist.\nGo get some \`${PREFIX}help\`!`

        replyData.discord.title = `Help card for \`${PREFIX}${command.name}\``
        replyData.discord.description = `**Description:** ${command.description}`
        if (command.name !== 'elim')
            replyData.discord.fields.push({
                name: '**Short usage:**',
                value: command.shortUsage,
            })
        replyData.discord.fields.push({
            name: '**Long usage:**',
            value: command.longUsage,
        })
        replyData.discord.footer = `aliases: ${command.aliases.join(', ')}`
        if (command.category === 'Main' || command.category === 'Advanced') {
            replyData.discord.fields.push({
                name: 'Naval unit codes to add to land units:',
                value: 'Raft: `rf`\nScout: `sc`\nRammer: `rm`\nBomber: `bo`\nAlso old naval units for now:\nBomber (4 attack): `ob`\nShip: `oh`\nBattleship: `os`',
            })
            replyData.discord.fields.push({
                name: 'Current hp:',
                value: 'Any number will be interpreted as current hp with a bunch of fail-safes',
            })
            replyData.discord.fields.push({
                name: 'Modifiers:',
                value: 'Veteran: `v`\nSingle defense bonus: `d`\nWall defense bonus: `w`\nBoosted: `b`\nPoisoned: `p`\nExplode: `x`\nAttack then explode: `ax`\nAttack then instant explode: `axi`\nSplash: `s`\nFloor splash damage: `fl`\nForce retaliation: `r`\nNo retaliation/tentacles: `nr`',
            })
        }
        if (command.name === 'optim') {
            replyData.discord.fields.push({
                name: '`/o` specific modifier:',
                value: 'Only combos with that/those unit(s) doing the final hit: `f`\nTarget HP: `t12` (exactly 12hp) or `t<12` (get below 12hp) on defender',
            })
        }
        return replyData
    }

    const categories: Record<string, CmdMeta[]> = {
        Main: [],
        Advanced: [],
        Other: [],
    }
    for (const cmd of CATALOG) {
        if (cmd.category === 'hidden') continue
        categories[cmd.category].push(cmd)
    }

    replyData.discord.title = 'Help card for all commands'
    replyData.discord.footer = `For more help on a command: ${PREFIX}help {command}\nExample: ${PREFIX}help calc`

    for (const [cat, list] of Object.entries(categories)) {
        const field = list.map((d) => `**${d.name}**: ${d.description}`)
        replyData.discord.fields.push({ name: `**${cat}:**`, value: field })
    }
    return replyData
}

export function renderLinks(replyData: Reply): Reply {
    replyData.discord.title = 'Links!'
    replyData.discord.fields.push({
        name: 'Invite this bot to your server:',
        value: 'https://discord.com/oauth2/authorize?client_id=593507058905645057&scope=bot%20applications.commands&permissions=2147576904',
    })
    replyData.discord.fields.push({
        name: "PolyCalculator's server link:",
        value: 'https://discord.gg/rtSTmd8',
    })
    return replyData
}

export function renderCredits(replyData: Reply): Reply {
    replyData.discord.title = '**PolyCalculator bot credits!**'
    replyData.discord.fields.push({
        name: 'Lead Developer',
        value: 'jd (akajd)',
    })
    replyData.discord.fields.push({
        name: 'Development team',
        value: 'ibra9, ickydime',
    })
    replyData.discord.fields.push({
        name: 'Contributions',
        value: 'penile partay, MYRIAD CARDS, espark, Shiny, LiNoKami, HelloIAmBush, Cake, James.',
    })
    return replyData
}

export function renderFormula(replyData: Reply): Reply {
    replyData.discord.title = 'Formula!'
    replyData.discord.description =
        'Last block here is an arithmetic version.\nThe first blocks is in text format.'
    replyData.discord.fields.push({
        name: "Calculate the attacker's **force**",
        value: "Multiply the attacker' attack stat with its current HP and divide it by its max HP",
    })
    replyData.discord.fields.push({
        name: "Calculate the defender's **force**",
        value: "Multiply the defender's defense stat with its current HP, divide it by its max HP and multiply it by the defense bonus (1, 1.5 or 4)",
    })
    replyData.discord.fields.push({
        name: 'Calculate the total damage',
        value: "Add the attacker's force with the defender's force",
    })
    replyData.discord.fields.push({
        name: "The defender's HP lost",
        value: "Divide the attacker's force by the total damage, timed by the attacker's attack stat and by 4.5\nResult rounded up",
    })
    replyData.discord.fields.push({
        name: "The attacker's HP lost",
        value: "Divide the defender's force by the total damage, timed by the defender's defense stat and by 4.5\nResult rounded down",
    })
    const shortFormula = [
        '\nattacker.force = attacker.attackStats x attacker.currentHP / attacker.maxHP\n',
        'defender.force = defender.defenderStats x solution.defenderHP / defender.maxhp x defender.bonus\n',
        'totalDamage = attacker.force + defender.force\n',
        'defender.HPlost = attacker.force / totalDamage x attacker.attackStats x 4.5 rounded up\n',
        'attacker.HPlost = defender.force / totalDamage x defender.defenderStats x 4.5 round down\n',
    ]
    replyData.discord.fields.push({
        name: 'Arithmetic format:',
        value: shortFormula,
    })
    return replyData
}
