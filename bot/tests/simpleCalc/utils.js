const { getUnit } = require('../../commands/units.js');

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

const generateTestSuite = (
  attCode,
  attModifierList,
  defCode,
  defModifierList,
) => {
  const result = [];
  attModifierList.concat(['']).forEach((attModifier) => {
    defModifierList.concat(['']).forEach((defModifier) => {
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
