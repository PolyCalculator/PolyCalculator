const { expect, test } = require('@jest/globals');
const { execute } = require('../../commands/calc.js');
const { getUnit } = require('../../commands/units.js');
const { replyData } = require('../commandUtils.js');

const getTestUnit = (code, modifier) => {
  const unit = getUnit(code);
  unit.code = code;
  if (modifier) {
    unit.modifiers = ' ' + modifier;
  } else {
    unit.modifiers = '';
  }
  return unit;
};

const getMaxHp = (unit) => {
  if (unit.modifiers.includes('v') && unit.vet) {
    return unit.maxhp + 5;
  }
  return unit.maxhp;
};

const generateTests = (attacker, defender) => {
  const tests = [];
  for (let a = 1; a <= getMaxHp(attacker); a++) {
    for (let d = 1; d <= getMaxHp(defender); d++) {
      tests.push(
        `${attacker.code}${attacker.modifiers} ${a}, ${defender.code}${defender.modifiers} ${d}`,
      );
    }
  }
  return tests;
};

const generateTestSuite = (attCode, defCode) => {
  const result = [];
  const attacker = getUnit(attCode);
  const attModifiers = ['b'];
  if (attacker.vet) {
    attModifiers.push('v');
    attModifiers.push('b v');
  }
  if (attacker.splash !== false) {
    attModifiers.push('s');
    attModifiers.push('b s');
  }
  if (attacker.splash !== false && attacker.vet) {
    attModifiers.push('s v');
    attModifiers.push('b s v');
  }
  attModifiers.push('');

  const defender = getUnit(defCode);
  const defModifiers = [];
  if (defender.def > 0) {
    defModifiers.push('d');
    if (defender.vet) {
      defModifiers.push('d v');
    }
  }
  defModifiers.push('p');
  if (defender.vet) {
    defModifiers.push('p v');
  }
  if (defender.fort) {
    defModifiers.push('w');
    if (defender.vet) {
      defModifiers.push('w v');
    }
  }
  if (defender.vet) {
    defModifiers.push('v');
  }
  defModifiers.push('');

  attModifiers.forEach((attModifier) => {
    defModifiers.forEach((defModifier) => {
      const att = getTestUnit(attCode, attModifier);
      const def = getTestUnit(defCode, defModifier);
      result.push(...generateTests(att, def));
    });
  });
  return result;
};

const defenders = ['ca', 'de', 'dr', 'ga', 'gi', 'po', 'ri', 'wa'];

const runTestSuite = (attacker) => {
  defenders.forEach((defender) => {
    generateTestSuite(attacker, defender).forEach((cmd) => {
      test(cmd, () => {
        const reply = replyData();
        execute({}, cmd, reply, {});
        const result = {
          _cmd: cmd, // use underscore to put it on top of the snapshot
          attacker: Math.max(reply.outcome.attackers[0].afterhp, 0),
          defender: Math.max(reply.outcome.defender.afterhp, 0),
        };

        expect(result).toMatchSnapshot();
      });
    });
  });
};

module.exports = {
  runTestSuite,
  replyData,
};
