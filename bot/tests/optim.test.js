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

test('/o with exact target HP via prefix modifier: wa x8, gi t12', () => {
    const reply = replyData()
    execute(
        {},
        'wa, wa, wa, wa, wa, wa, wa, wa, gi t12',
        reply,
        {},
    )
    // Should get as close to 12 as possible from above
    expect(reply.outcome.defender.afterhp).toBeGreaterThanOrEqual(12)
    // Should use fewer than all 8 attackers
    expect(reply.outcome.attackers.length).toBeLessThan(8)
    expect(reply.discord.description).toContain('Target: defender at 12 HP')
})

test('/o with below target HP via prefix modifier: wa x3, gi t<35', () => {
    const reply = replyData()
    execute({}, 'wa, wa, wa, gi t<35', reply, {})
    // Should get below 35
    expect(reply.outcome.defender.afterhp).toBeLessThan(35)
    // Should use only 2 warriors (34 HP is below 35)
    expect(reply.outcome.attackers.length).toBe(2)
    expect(reply.discord.description).toContain(
        'Target: defender below 35 HP',
    )
})

test('/o with exact target HP via targetStr parameter', () => {
    const reply = replyData()
    execute({}, 'wa, wa, wa, wa, wa, wa, wa, wa, gi', reply, {}, '12')
    expect(reply.outcome.defender.afterhp).toBeGreaterThanOrEqual(12)
    expect(reply.outcome.attackers.length).toBeLessThan(8)
})

test('/o with below target HP via targetStr parameter', () => {
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
