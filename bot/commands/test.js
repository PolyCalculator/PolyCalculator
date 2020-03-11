const units = require('./units')

units.getUnit('wa', '', '.')
  .then(x => console.log(x))
  .catch(x => console.log(x))