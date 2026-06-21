// Register PolyCalculator's slash commands with Discord (global).
//
// Replaces the old deploy-commands.js — no @discordjs/builders, just a single
// PUT of plain command JSON. Option types: 3 = STRING, 6 = USER.
//
// Env:
//   DISCORD_APPLICATION_ID   required
//   DISCORD_BOT_TOKEN        required
//   DISCORD_GUILD_ID         optional — if set, registers to that guild only
//                            (instant; use for dev). Omit for global.
//
// Run: node scripts/register-commands.mjs

const APP_ID = process.env.DISCORD_APPLICATION_ID
const TOKEN = process.env.DISCORD_BOT_TOKEN
const GUILD_ID = process.env.DISCORD_GUILD_ID

if (!APP_ID || !TOKEN) {
    console.error('Set DISCORD_APPLICATION_ID and DISCORD_BOT_TOKEN')
    process.exit(1)
}

const STRING = 3
const USER = 6

const req = (name, description) => ({
    type: STRING,
    name,
    description,
    required: true,
})
const opt = (name, description) => ({
    type: STRING,
    name,
    description,
    required: false,
})

const commands = [
    {
        name: 'c',
        description: 'Calc: Sequential calculation of attacks on one defender!',
        options: [
            req('attackers', 'Enter attackers separated by comma'),
            req('defender', 'Enter a defender'),
        ],
    },
    {
        name: 'o',
        description: 'Optim: Optimal calculation of attacks on one defender!',
        options: [
            req('attackers', 'Enter attackers separated by comma'),
            req('defender', 'Enter an defender'),
            opt(
                'target',
                'Target HP for defender (e.g. "12" for exact, "<12" for below)',
            ),
        ],
    },
    {
        name: 'b',
        description:
            'Bulk: How many of one attacker is needed to kill a defender!',
        options: [
            req('attacker', 'Enter the attacker'),
            req('defender', 'Enter the defender'),
        ],
    },
    {
        name: 'e',
        description:
            "Elim: Use ? on either the attacker or the defender when you don't know the hp!",
        options: [
            req('attacker', 'Enter an attacker'),
            req('defender', 'Enter an defender'),
        ],
    },
    {
        name: 'units',
        description: 'If unspecified, lists all units!',
        options: [
            opt('unit', 'If specified, only stats for the requested unit'),
        ],
    },
    {
        name: 'stats',
        description: 'Check PolyCalculator usage (default you)!',
        options: [
            {
                type: USER,
                name: 'user',
                description:
                    '(Default you) or the user for which to see the stats',
                required: false,
            },
        ],
    },
    {
        name: 'help',
        description: 'If unspecified, lists all commands!',
        options: [
            opt('command', 'If specified, only details for the requested unit'),
        ],
    },
    {
        name: 'links',
        description:
            "Show the links to invite the bot and to the developer's server!",
    },
    { name: 'credits', description: 'PolyCalculator bot credits!' },
    {
        name: 'formula',
        description: 'Get the breakdown of the formula for damage calculator!',
    },
    {
        name: 'feedback',
        description: 'Send feedback to the dev!',
        options: [req('message', 'Required feedback message')],
    },
]

const route = GUILD_ID
    ? `https://discord.com/api/v10/applications/${APP_ID}/guilds/${GUILD_ID}/commands`
    : `https://discord.com/api/v10/applications/${APP_ID}/commands`

const res = await fetch(route, {
    method: 'PUT',
    headers: {
        Authorization: `Bot ${TOKEN}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
})

if (!res.ok) {
    console.error(`Registration failed: ${res.status}`)
    console.error(await res.text())
    process.exit(1)
}

console.log(
    `Registered ${commands.length} commands ${
        GUILD_ID ? `to guild ${GUILD_ID}` : 'globally'
    }.`,
)
