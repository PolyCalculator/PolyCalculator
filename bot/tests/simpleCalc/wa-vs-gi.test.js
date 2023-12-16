const { test } = require('@jest/globals');
const { generateTestSuite, runTestCmd } = require('./utils.js');

generateTestSuite('wa', 'gi').forEach((cmd) => {
  test(cmd, () => {
    runTestCmd(cmd);
  });
});
