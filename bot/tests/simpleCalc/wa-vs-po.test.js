const { test } = require('@jest/globals');
const { generateTestSuite, runTestCmd } = require('./utils.js');

generateTestSuite('wa', 'po').forEach((cmd) => {
  test(cmd, () => {
    runTestCmd(cmd);
  });
});
