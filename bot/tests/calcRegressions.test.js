const { expect, test } = require('@jest/globals')
const { execute } = require('../commands/calc.js')
const { replyData } = require('./simpleCalc/utils.js')

test('de bo s, de', async () => {
    const reply = replyData()
    await execute({}, 'de bo s, de', reply, {})
    expect(reply.outcome.attackers[0].afterhp).toBe(15)
    expect(reply.outcome.defender.afterhp).toBe(12)
})

test('de bo, de', async () => {
    const reply = replyData()
    await execute({}, 'de bo, de', reply, {})
    expect(reply.outcome.attackers[0].afterhp).toBe(15)
    expect(reply.outcome.defender.afterhp).toBe(8)
})

test('de 1, v ri 2', async () => {
    const reply = replyData()
    await execute({}, 'de 1, v ri 2', reply, {})
    expect(reply.outcome.attackers[0].afterhp).toBe(0)
    expect(reply.outcome.defender.afterhp).toBe(1)
})

test('de 6, ri 8', async () => {
    const reply = replyData()
    await execute({}, 'de 6, ri 8', reply, {})
    expect(reply.outcome.attackers[0].afterhp).toBe(3)
    expect(reply.outcome.defender.afterhp).toBe(6)
})

test('wa, wa, wa', async () => {
    const reply = replyData()
    await execute({}, 'wa, wa, wa', reply, {})
    expect(reply.outcome.attackers[0].afterhp).toBe(5)
    expect(reply.outcome.attackers[1].afterhp).toBe(10)
    expect(reply.outcome.defender.afterhp).toBe(-1)
})

test('ca, de, wa, de d', async () => {
    const reply = replyData()
    await execute({}, 'ca, de, wa, de d', reply, {})
    expect(reply.outcome.attackers[0].afterhp).toBe(10)
    expect(reply.outcome.attackers[1].afterhp).toBe(6)
    expect(reply.outcome.attackers[2].afterhp).toBe(4)
    expect(reply.outcome.defender.afterhp).toBe(1)
})

test('gi 31, wa 10, gi 40', async () => {
    const reply = replyData()
    await execute({}, 'gi 31, wa 10, gi 40', reply, {})
    expect(reply.outcome.attackers[0].afterhp).toBe(22)
    expect(reply.outcome.attackers[1].afterhp).toBe(0)
    expect(reply.outcome.defender.afterhp).toBe(25)
})

test('ex, wa, de', async () => {
    const reply = replyData()
    await execute({}, 'ex, wa, de', reply, {})
    expect(reply.outcome.attackers[0].afterhp).toBe(10)
    expect(reply.outcome.attackers[1].afterhp).toBe(6)
    expect(reply.outcome.defender.afterhp).toBe(2)
})

test('se, ce 6, wa v — floored segment explosion (in-game verified)', async () => {
    // Segment explosion is halved AND floored: 2.5 -> 2, taking the vet
    // Warrior 15 -> 13 and poisoning it, then the Centipede deals 10 to the
    // poisoned Warrior (13 -> 3) and takes 4 retaliation (6 -> 2).
    const reply = replyData()
    await execute({}, 'se, ce 6, wa v', reply, {})
    expect(reply.outcome.attackers[0].name).toBe('Segment')
    expect(reply.outcome.attackers[0].hpdefender).toBe(13)
    expect(reply.outcome.attackers[1].name).toBe('Centipede')
    expect(reply.outcome.attackers[1].afterhp).toBe(2)
    expect(reply.outcome.attackers[1].hpdefender).toBe(3)
    expect(reply.outcome.defender.afterhp).toBe(3)
})

test('ce 6, se, ki 3, wa v — halved+floored explosion, Warrior survives', async () => {
    const reply = replyData()
    await execute({}, 'ce 6, se, ki 3, wa v', reply, {})
    expect(reply.outcome.attackers[0].hpdefender).toBe(8)
    expect(reply.outcome.attackers[1].hpdefender).toBe(5)
    expect(reply.outcome.attackers[2].hpdefender).toBe(3)
    expect(reply.outcome.defender.afterhp).toBe(3)
})

test('cl, wa — cloak attacks with 2 att and warns about infiltration', async () => {
    const reply = replyData()
    await execute({}, 'cl, wa', reply, {})
    expect(reply.content.length).toBe(1)
    expect(reply.content[0][0]).toContain('infiltrating a city')
    expect(reply.outcome.attackers[0].name).toBe('Cloak')
    expect(reply.outcome.attackers[0].hpdefender).toBe(5)
    expect(reply.outcome.attackers[0].afterhp).toBe(0)
    expect(reply.outcome.defender.afterhp).toBe(5)
})

test('wa, cl — no infiltration warning when a Cloak defends', async () => {
    const reply = replyData()
    await execute({}, 'wa, cl', reply, {})
    expect(reply.content).toEqual([])
    expect(reply.outcome.attackers[0].afterhp).toBe(10)
    expect(reply.outcome.defender.afterhp).toBe(-2)
})
