const { test } = require('@jest/globals');
const { generateTestSuite, runTestCmd } = require('./utils.js');

generateTestSuite('ca', 'ri').forEach((cmd) => {
  test(cmd, () => {
    runTestCmd(cmd);
  });
});
