const { expect, test } = require('@jest/globals');
const { execute } = require('../commands/calc-new.js');
const { replyData } = require('./commandUtils.js');

// simple test
test('/c attackers: wa defender: ri', () => {
  const reply = replyData();
  execute({}, 'wa, ri', reply, {});
  expect(reply).toEqual({
    content: [],
    deleteContent: false,
    discord: {
      title: undefined,
      description: 'The outcome of the fight is:',
      fields: [
        {
          name: 'Attacker: startHP ➔ endHP (enemyHP)',
          value: ['**Warrior:** 10 ➔ 8 (**4**)'],
        },
        {
          name: '**Rider**:',
          value: '10 ➔ 4',
        },
      ],
      footer: undefined,
    },
    outcome: {
      attackers: [
        {
          name: 'Warrior',
          beforehp: 10,
          maxhp: 10,
          hplost: 2,
          hpdefender: 4,
          afterhp: 8,
        },
      ],
      defender: {
        name: 'Rider',
        currenthp: 10,
        maxhp: 10,
        hplost: 6,
        afterhp: 4,
      },
    },
  });
});
