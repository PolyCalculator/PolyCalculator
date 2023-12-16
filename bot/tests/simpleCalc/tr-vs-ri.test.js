const { test } = require('@jest/globals');
const { generateTestSuite, runTestCmd } = require('./utils.js');

generateTestSuite('tr', 'wa').forEach((cmd) => {
  test(cmd, () => {
    runTestCmd(cmd);
  });
});
