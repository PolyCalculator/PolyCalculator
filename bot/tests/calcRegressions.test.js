const { expect, test } = require('@jest/globals');
const { execute } = require('../commands/calc.js');
const { replyData } = require('./simpleCalc/utils.js');

test('de 1, v ri 2', () => {
  const reply = replyData();
  execute({}, 'de 1, v ri 2', reply, {});
  expect(reply.outcome.attackers[0].afterhp).toBe(0);
  expect(reply.outcome.defender.afterhp).toBe(1);
});

test('de 6, ri 8', () => {
  const reply = replyData();
  execute({}, 'de 6, ri 8', reply, {});
  expect(reply.outcome.attackers[0].afterhp).toBe(3);
  expect(reply.outcome.defender.afterhp).toBe(6);
});

// TODO: fix this
test.skip('dr s, ri 8', () => {
  const reply = replyData();
  execute({}, 'dr s, ri 8', reply, {});
  expect(reply.outcome.attackers[0].afterhp).toBe(20);
  expect(reply.outcome.defender.afterhp).toBe(0);
});

test('ca, de, wa, de d', () => {
  const reply = replyData();
  execute({}, 'ca, de, wa, de d', reply, {});
  expect(reply.outcome.attackers[0].afterhp).toBe(10);
  expect(reply.outcome.attackers[1].afterhp).toBe(4);
  expect(reply.outcome.attackers[2].afterhp).toBe(1);
  expect(reply.outcome.defender.afterhp).toBe(3);
});

