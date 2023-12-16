const { test } = require('@jest/globals');
const { generateTestSuite, runTestCmd } = require('./utils.js');

generateTestSuite('cr', 'gi').forEach((cmd) => {
  test(cmd, () => {
    runTestCmd(cmd);
  });
});
