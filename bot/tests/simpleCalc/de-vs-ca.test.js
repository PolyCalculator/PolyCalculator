const { test } = require('@jest/globals');
const { generateTestSuite, runTestCmd } = require('./utils.js');

generateTestSuite('de', 'ca').forEach((cmd) => {
  test(cmd, () => {
    runTestCmd(cmd);
  });
});
