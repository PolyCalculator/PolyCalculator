const { getUnit } = require('../../commands/units.js');
const { de } = require('../../util/unitsList.js');

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

// TODO:
// Add gaami
// Generate modifiers automatically

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

const replyData = () => ({
  content: [],
  deleteContent: false,
  discord: {
    title: undefined,
    description: undefined,
    fields: [],
    footer: undefined,
  },
  outcome: {
    attackers: [],
    defender: {},
  },
});

module.exports = { generateTests, getTestUnit, generateTestSuite, replyData };
