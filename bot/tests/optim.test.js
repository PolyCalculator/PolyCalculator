const { expect, test } = require('@jest/globals')
const { execute } = require('../commands/optim.js')
const { replyData } = require('./commandUtils.js')
const deadTexts = require('../util/deadtexts.js')

deadTexts.length = 1
deadTexts[0] = 'DEAD'

test('/o attackers: ca, de, wa defender: de d', () => {
    const reply = replyData()
    execute({}, 'ca, de, wa, de d', reply, {})
    expect(reply).toEqual({
        content: [],
        deleteContent: false,
        discord: {
            title: undefined,
            description: 'This is the order for best outcome:',
            fields: [
                {
                    name: 'Attacker: startHP ➔ endHP (enemyHP)',
                    value: [
                        'Defender: 15 ➔ 4 (**14**)',
                        'Catapult: 10 ➔ 10 (**5**)',
                        'Warrior: 10 ➔ 10 (**0**)',
                    ],
                },
                {
                    name: '**Defender (protected)**:',
                    value: '15 ➔ (0) DEAD',
                },
            ],
            footer: undefined,
        },
        outcome: {
            attackers: [
                {
                    name: 'Defender',
                    afterhp: 4,
                    beforehp: 15,
                    hpdefender: 14,
                    hplost: 11,
                    maxhp: 15,
                },
                {
                    name: 'Catapult',
                    afterhp: 10,
                    beforehp: 10,
                    hpdefender: 5,
                    hplost: 0,
                    maxhp: 10,
                },
                {
                    name: 'Warrior',
                    afterhp: 10,
                    beforehp: 10,
                    hpdefender: 0,
                    hplost: 0,
                    maxhp: 10,
                },
            ],
            defender: {
                name: 'Defender (protected)',
                afterhp: 0,
                currenthp: 15,
                hplost: 15,
                maxhp: 15,
            },
        },
    })
})

test('/o exact target achievable: wa x8, gi t34', () => {
    const reply = replyData()
    execute({}, 'wa, wa, wa, wa, wa, wa, wa, wa, gi t34', reply, {})
    // 2 warriors leave Giant at exactly 34hp
    expect(reply.outcome.defender.afterhp).toBe(34)
    expect(reply.outcome.attackers.length).toBe(2)
    expect(reply.discord.description).toContain(
        'Target: defender at exactly 34 HP',
    )
})

test('/o exact target impossible: wa x8, gi t12 throws', async () => {
    const reply = replyData()
    await expect(
        execute({}, 'wa, wa, wa, wa, wa, wa, wa, wa, gi t12', reply, {}),
    ).rejects.toMatch('No combination leaves the defender at exactly 12 HP')
})

test('/o below target: wa x3, gi t<35', () => {
    const reply = replyData()
    execute({}, 'wa, wa, wa, gi t<35', reply, {})
    // Only 2 warriors needed to get below 35 (Giant at 34)
    // Below target = "dead", so use minimum units
    expect(reply.outcome.defender.afterhp).toBeLessThan(35)
    expect(reply.outcome.attackers.length).toBe(2)
    expect(reply.discord.description).toContain('Target: defender below 35 HP')
})

test('/o below target uses best solution: ca, wa, wa, gi t<35', () => {
    const reply = replyData()
    execute({}, 'ca, wa, wa, gi t<35', reply, {})
    // Below target = "dead", so prefer fewest units with best attacker outcome
    expect(reply.outcome.defender.afterhp).toBeLessThan(35)
    // 1 catapult alone gets Giant to 30 (below 35), so only 1 unit needed
    expect(reply.outcome.attackers.length).toBe(1)
})

test('/o exact target via targetStr parameter', () => {
    const reply = replyData()
    execute({}, 'wa, wa, wa, wa, wa, wa, wa, wa, gi', reply, {}, '37')
    expect(reply.outcome.defender.afterhp).toBe(37)
    expect(reply.outcome.attackers.length).toBe(1)
})

test('/o below target via targetStr parameter', () => {
    const reply = replyData()
    execute({}, 'wa, wa, wa, wa, wa, wa, wa, wa, gi', reply, {}, '<12')
    expect(reply.outcome.defender.afterhp).toBeLessThan(12)
})

test('/o target HP must be less than defender current HP', async () => {
    const reply = replyData()
    await expect(execute({}, 'wa, wa, gi t50', reply, {})).rejects.toMatch(
        'Target HP (50) must be less than',
    )
})

test('/o without target behaves as before', () => {
    const reply = replyData()
    execute({}, 'wa, wa, wa, gi', reply, {})
    // Normal optim: should use all attackers and maximize damage
    expect(reply.outcome.attackers.length).toBe(3)
    expect(reply.discord.description).toBe(
        'This is the order for best outcome:',
    )
})

test('/o do (no modifier) — just attacks, no explosion', () => {
    const reply = replyData()
    execute({}, 'do, wa, wa, gi', reply, {})
    // Doomux should appear once (no explosion)
    const doomEntries = reply.outcome.attackers.filter((a) =>
        a.name.includes('Doomux'),
    )
    expect(doomEntries.length).toBe(1)
    expect(doomEntries[0].name).not.toContain('💥')
    expect(reply.outcome.defender.afterhp).toBe(25)
})

test('/o do x — just explodes, no hit first', () => {
    const reply = replyData()
    execute({}, 'do x, wa, wa, gi', reply, {})
    // Doomux should appear once as explosion only
    const doomEntries = reply.outcome.attackers.filter((a) =>
        a.name.includes('Doomux'),
    )
    expect(doomEntries.length).toBe(1)
    expect(doomEntries[0].name).toContain('💥')
    expect(reply.outcome.defender.afterhp).toBe(26.5)
})

test('/o do ax — attack then explode, others can go between', () => {
    const reply = replyData()
    execute({}, 'do ax, wa, wa, gi', reply, {})
    // Doomux should appear twice (hit + explode)
    const doomEntries = reply.outcome.attackers.filter((a) =>
        a.name.includes('Doomux'),
    )
    expect(doomEntries.length).toBe(2)
    expect(doomEntries[1].name).toContain('💥')
    expect(reply.outcome.defender.afterhp).toBe(20.5)
})

test('/o do axi — attack then instant explode', () => {
    const reply = replyData()
    execute({}, 'do axi, wa, wa, gi', reply, {})
    // Doomux should appear twice, explosion immediately after hit
    const doomEntries = reply.outcome.attackers.filter((a) =>
        a.name.includes('Doomux'),
    )
    expect(doomEntries.length).toBe(2)
    // Verify explosion is immediately after hit in the sequence
    const names = reply.outcome.attackers.map((a) => a.name)
    const hitIdx = names.findIndex(
        (n) => n.includes('Doomux') && !n.includes('💥'),
    )
    const explodeIdx = names.findIndex((n) => n.includes('💥'))
    expect(explodeIdx).toBe(hitIdx + 1)
})

test('/o attackers: ca f, de, wa defender: de d', () => {
    const reply = replyData()
    execute({}, 'ca f, de, wa, de d', reply, {})
    expect(reply).toEqual({
        content: [],
        deleteContent: false,
        discord: {
            title: undefined,
            description: 'This is the order for best outcome:',
            fields: [
                {
                    name: 'Attacker: startHP ➔ endHP (enemyHP)',
                    value: [
                        'Defender: 15 ➔ 4 (**14**)',
                        'Warrior: 10 ➔ 1 (**11**)',
                        'Catapult: 10 ➔ 10 (**1**)',
                    ],
                },
                {
                    name: '**Defender (protected)**:',
                    value: '15 ➔ 1',
                },
            ],
            footer: undefined,
        },
        outcome: {
            attackers: [
                {
                    name: 'Defender',
                    afterhp: 4,
                    beforehp: 15,
                    hpdefender: 14,
                    hplost: 11,
                    maxhp: 15,
                },
                {
                    name: 'Warrior',
                    afterhp: 1,
                    beforehp: 10,
                    hpdefender: 11,
                    hplost: 9,
                    maxhp: 10,
                },
                {
                    name: 'Catapult',
                    afterhp: 10,
                    beforehp: 10,
                    hpdefender: 1,
                    hplost: 0,
                    maxhp: 10,
                },
            ],
            defender: {
                name: 'Defender (protected)',
                afterhp: 1,
                currenthp: 15,
                hplost: 14,
                maxhp: 15,
            },
        },
    })
})
