const { expect, test } = require('@jest/globals');
const { execute } = require('../commands/calc.js');
const { replyData } = require('./simpleCalc/utils.js');

test('de 1, v ri 2', async () => {
    const reply = replyData();
    await execute({}, 'de 1, v ri 2', reply, {});
    expect(reply.outcome.attackers[0].afterhp).toBe(0);
    expect(reply.outcome.defender.afterhp).toBe(1);
});

test('de 6, ri 8', async () => {
    const reply = replyData();
    await execute({}, 'de 6, ri 8', reply, {});
    expect(reply.outcome.attackers[0].afterhp).toBe(3);
    expect(reply.outcome.defender.afterhp).toBe(6);
});

test('wa, wa, wa', async () => {
    const reply = replyData();
    await execute({}, 'wa, wa, wa', reply, {});
    expect(reply.outcome.attackers[0].afterhp).toBe(5);
    expect(reply.outcome.attackers[1].afterhp).toBe(10);
    expect(reply.outcome.defender.afterhp).toBe(-1);
});

test('ca, de, wa, de d', async () => {
    const reply = replyData();
    await execute({}, 'ca, de, wa, de d', reply, {});
    expect(reply.outcome.attackers[0].afterhp).toBe(10);
    expect(reply.outcome.attackers[1].afterhp).toBe(6);
    expect(reply.outcome.attackers[2].afterhp).toBe(4);
    expect(reply.outcome.defender.afterhp).toBe(1);
});

test('gi 31, wa 10, gi 40', async () => {
    const reply = replyData();
    await execute({}, 'gi 31, wa 10, gi 40', reply, {});
    expect(reply.outcome.attackers[0].afterhp).toBe(22);
    expect(reply.outcome.attackers[1].afterhp).toBe(0);
    expect(reply.outcome.defender.afterhp).toBe(25);
});

test('ex, wa, de', async () => {
    const reply = replyData();
    await execute({}, 'ex, wa, de', reply, {});
    expect(reply.outcome.attackers[0].afterhp).toBe(10);
    expect(reply.outcome.attackers[1].afterhp).toBe(5);
    expect(reply.outcome.defender.afterhp).toBe(2);
});

