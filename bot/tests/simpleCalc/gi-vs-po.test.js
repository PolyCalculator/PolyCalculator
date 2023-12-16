const { test, expect } = require('@jest/globals');
const { execute } = require('../../commands/calc.js');
const { generateTestSuite, replyData } = require('./utils.js');

const testData = () =>
  generateTestSuite('gi', ['b'], 'po', [
    'd',
    'd v',
    'p',
    'p v',
    'w',
    'w v',
    'v',
  ]);

testData().forEach((cmd) => {
  test(cmd, () => {
    const reply = replyData();
    execute({}, cmd, reply, {});
    const result = {
      _cmd: cmd, // use underscore to put it on top of the snapshot
      attacker: reply.outcome.attackers[0].afterhp,
      defender: reply.outcome.defender.afterhp,
    };

    expect(result).toMatchSnapshot();
  });
});
