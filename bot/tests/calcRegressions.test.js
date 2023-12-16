const { expect, test } = require('@jest/globals');
const { execute } = require('../commands/calc.js');
const { replyData } = require('./simpleCalc/utils.js');

// tests for the calc command.
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
