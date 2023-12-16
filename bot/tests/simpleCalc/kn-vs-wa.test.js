const { test } = require('@jest/globals');
const { generateTestSuite, runTestCmd } = require('./utils.js');

generateTestSuite('kn', 'wa').forEach((cmd) => {
  test(cmd, () => {
    runTestCmd(cmd);
  });
});
