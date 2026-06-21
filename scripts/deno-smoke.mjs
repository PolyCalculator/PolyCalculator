// Deno smoke test: proves the pure ESM engine loads and runs identically under
// Deno (the Edge Function runtime), not just Node/Jest. Asserts the exact
// replyData from tests/calc.test.js for `wa, ri`.
//
// Run: deno run --allow-read scripts/deno-smoke.mjs

import { execute as calc } from '../engine/commands/calc.js'
import { execute as optim } from '../engine/commands/optim.js'
import { execute as bulk } from '../engine/commands/bulk.js'
import { execute as elim } from '../engine/commands/elim.js'
import { getUnit } from '../engine/commands/units.js'

function makeReply() {
    return {
        content: [],
        deleteContent: false,
        discord: {
            title: undefined,
            description: undefined,
            fields: [],
            footer: undefined,
        },
        outcome: { attackers: [], defender: {} },
    }
}

function sortKeys(v) {
    if (Array.isArray(v)) return v.map(sortKeys)
    if (v && typeof v === 'object')
        return Object.fromEntries(
            Object.keys(v)
                .sort()
                .map((k) => [k, sortKeys(v[k])]),
        )
    return v
}

function assertEqual(actual, expected, label) {
    const a = JSON.stringify(sortKeys(actual))
    const e = JSON.stringify(sortKeys(expected))
    if (a !== e) {
        console.error(`FAIL ${label}\n  expected: ${e}\n  actual:   ${a}`)
        Deno.exit(1)
    }
    console.log(`ok   ${label}`)
}

// calc wa, ri — exact contract from tests/calc.test.js
const r = makeReply()
await calc({}, 'wa, ri', r, {})
assertEqual(
    r.discord.description,
    'The outcome of the fight is:',
    'calc description',
)
assertEqual(
    r.discord.fields[0].value,
    ['**Warrior:** 10 ➔ 8 (**4**)'],
    'calc attacker field',
)
assertEqual(r.discord.fields[1].value, '10 ➔ 4', 'calc defender field')
assertEqual(
    r.outcome.defender,
    { name: 'Rider', currenthp: 10, maxhp: 10, hplost: 6, afterhp: 4 },
    'calc outcome.defender',
)

// optim runs (8-attacker perf path) without throwing
const ro = makeReply()
await optim({}, 'wa, wa, ri, ri, ar, ar, ca, ca, de d', ro, {})
if (ro.discord.fields.length < 2) {
    console.error('FAIL optim produced no fields')
    Deno.exit(1)
}
console.log('ok   optim 8-attacker ran')

// bulk + elim smoke
const rb = makeReply()
bulk({}, 'wa, de d', rb, {})
console.log('ok   bulk ran:', rb.discord.fields[0].value, 'hits')

const re = makeReply()
elim({}, 'gi ?, de w 6', re, {})
console.log('ok   elim ran')

// getUnit standalone (the named export tests rely on)
const wa = getUnit('wa')
assertEqual(
    { name: wa.name, att: wa.att, def: wa.def },
    { name: 'Warrior', att: 2, def: 2 },
    'getUnit wa',
)

console.log('\nALL DENO SMOKE CHECKS PASSED')
