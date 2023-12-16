const { test } = require('@jest/globals');
const { generateTestSuite, runTestCmd } = require('./utils.js');

generateTestSuite('tr', 'gi').forEach((cmd) => {
  test(cmd, () => {
    runTestCmd(cmd);
  });
});
