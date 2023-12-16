const { test } = require('@jest/globals');
const { generateTestSuite, runTestCmd } = require('./utils.js');

generateTestSuite('tr', 'po').forEach((cmd) => {
  test(cmd, () => {
    runTestCmd(cmd);
  });
});
