const { test } = require('@jest/globals');
const { generateTestSuite, runTestCmd } = require('./utils.js');

generateTestSuite('kn', 'de').forEach((cmd) => {
  test(cmd, () => {
    runTestCmd(cmd);
  });
});
