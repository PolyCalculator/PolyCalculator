const { test } = require('@jest/globals');
const { generateTestSuite, runTestCmd } = require('./utils.js');

generateTestSuite('ca', 'gi').forEach((cmd) => {
  test(cmd, () => {
    runTestCmd(cmd);
  });
});
