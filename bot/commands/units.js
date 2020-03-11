module.exports.cmd = {
  name: 'units',
  description: 'Returns the list of unit codes',
  aliases: ['unit', 'u'],
  shortUsage(prefix) {
    return `${prefix}units`
  },
  longUsage(prefix) {
    return `${prefix}u`
  },
  permsAllowed: [],
  usersAllowed: [],
  rolesAllowed: [],
  channelsAllowed: [],
  
  execute(message, args, RichEmbed) {

  }
};

module.exports.unitList = {
  wa: {
    name: 'Warrior',
    maxhp: 10,
    vethp: 15,
    att: 2,
    def: 2,
    fort: true,
    naval: false
  },
  ri: {
    name: 'Rider',
    maxhp: 10,
    vethp: 15,
    att: 2,
    def: 1,
    fort: true,
    naval: false
  },
  ar: {
    name: 'Archer',
    maxhp: 10,
    vethp: 15,
    att: 2,
    def: 1,
    fort: true,
    naval: false
  },
  de: {
    name: 'Defender',
    maxhp: 15,
    vethp: 20,
    att: 1,
    def: 3,
    fort: true,
    naval: false
  },
  kn: {
    name: 'Knight',
    maxhp: 15,
    vethp: 20,
    att: 3.5,
    def: 1,
    fort: true,
    naval: false
  },
  sw: {
    name: 'Swordsman',
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 3,
    fort: true,
    naval: false
  },
  ca: {
    name: 'Catapult',
    maxhp: 10,
    vethp: 15,
    att: 4,
    def: 0,
    fort: false,
    naval: false
  },
  gi: {
    name: 'Giant',
    maxhp: 40,
    vethp: 40,
    att: 5,
    def: 4,
    fort: false,
    naval: false
  },
  cr: {
    name: 'Crab',
    maxhp: 40,
    vethp: 40,
    att: 4,
    def: 4,
    fort: false,
    naval: false
  },
  tr: {
    name: 'Tridention',
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 1,
    fort: true,
    naval: false
  },
  po: {
    name: 'Polytaur',
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 1,
    fort: true,
    naval: false
  },
  na: {
    name: 'Navalon',
    maxhp: 30,
    vethp: 30,
    att: 4,
    def: 4,
    fort: false,
    naval: false
  },
  bo: {
    name: 'Boat',
    maxhp: 'Depends on the unit inside',
    vethp: 'Depends on the unit inside',
    att: 1,
    def: 1,
    fort: false,
    naval: false
  },
  sh: {
    name: 'Ship',
    maxhp: 'Depends on the unit inside',
    vethp: 'Depends on the unit inside',
    att: 2,
    def: 2,
    fort: false,
    naval: false
  },
  bs: {
    name: 'Battleship',
    maxhp: 'Depends on the unit inside',
    vethp: 'Depends on the unit inside',
    att: 4,
    def: 3,
    fort: false,
    naval: false
  },
  ga: {
    name: 'Gaami',
    maxhp: 30,
    vethp: 30,
    att: 4,
    def: 4,
    fort: false,
    naval: false
  },
  mb: {
    name: 'Mind Bender',
    maxhp: 10,
    vethp: 10,
    att: 0,
    def: 1,
    fort: false,
    naval: false
  },
  eg: {
    name: 'Dragon Egg',
    maxhp: 10,
    vethp: 10,
    att: 0,
    def: 2,
    fort: false,
    naval: false
  },
  bd: {
    name: 'Baby Dragon',
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 3,
    fort: false,
    naval: false
  },
  dr: {
    name: 'Fire Dragon',
    maxhp: 20,
    vethp: 20,
    att: 4,
    def: 3,
    fort: false,
    naval: false
  },
  mo: {
    name: 'Mooni',
    maxhp: 10,
    vethp: 10,
    att: 0,
    def: 2,
    fort: false,
    naval: false
  },
  sl: {
    name: 'Battle Sled',
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 2,
    fort: false,
    naval: false
  },
  ic: {
    name: 'Ice Fortress',
    maxhp: 20,
    vethp: 25,
    att: 4,
    def: 3,
    fort: false,
    naval: false
  }
}

module.exports.getFightUnit = function(array, prefix) {
  // return new Promise((resolve, reject) => {

  const unitKeys = Object.keys(all);
  let unitKey = array.filter(value => unitKeys.includes(value.substring(0, 2)))
  if(unitKey.length === 0)
    throw `We couldn't find one of the units.n*REQUIRED: You need to type at least two characters of the unit.*nnYou can module.exports.get the list is available with \`${prefix}units\``
  unitKey = unitKey.filter(x => nonnaval.hasOwnProperty(x.substring(0, 2)));

  if(unitKey.length === 0)
    throw `For naval units, make sure you include which unit is in.n   Long ex: \`${prefix}calc warrior boat vet, warrior ship\`\n   Short ex: \`${prefix}c wa bo v, wa sh\``
  unitKey = unitKey.toString().substring(0, 2)
  let unit = Object.assign({}, nonnaval[unitKey])

  if(array.some(x => x.startsWith('bo'))) {
    if(unit.name.toLowerCase() === 'navalon' || unit.name.toLowerCase() === 'tridention' || unit.name.toLowerCase() === 'crab' || unit.name.toLowerCase() === 'baby dragon' || unit.name.toLowerCase() === 'fire dragon' || unit.name.toLowerCase() === 'navalon' || unit.name.toLowerCase() === 'battle sled' || unit.name.toLowerCase() === 'ice fortress') {
      throw `This ${unit.name.toLowerCase()} can't go in a naval unit`
    } else {
      unit.name = unit.name + ' Boat';
      unit.att = bo.att;
      unit.def = bo.def;
      unit.fort = bo.fort;
    }
  } else if(array.some(x => x.startsWith('sh'))) {
    if(unit.name.toLowerCase() === 'navalon' || unit.name.toLowerCase() === 'tridention' || unit.name.toLowerCase() === 'crab' || unit.name.toLowerCase() === 'baby dragon' || unit.name.toLowerCase() === 'fire dragon' || unit.name.toLowerCase() === 'navalon' || unit.name.toLowerCase() === 'battle sled' || unit.name.toLowerCase() === 'ice fortress') {
      throw `This ${unit.name.toLowerCase()} can't go in a naval unit`
    } else {
      unit.name = unit.name + ' Ship';
      unit.att = sh.att;
      unit.def = sh.def;
      unit.fort = sh.fort;
    }
  } else if(array.some(x => (x.startsWith('ba') || x.startsWith('bs')))) {
    if(unit.name.toLowerCase() === 'navalon' || unit.name.toLowerCase() === 'tridention' || unit.name.toLowerCase() === 'crab' || unit.name.toLowerCase() === 'baby dragon' || unit.name.toLowerCase() === 'fire dragon' || unit.name.toLowerCase() === 'navalon' || unit.name.toLowerCase() === 'battle sled' || unit.name.toLowerCase() === 'ice fortress') {
      throw `This ${unit.name.toLowerCase()} can't go in a naval unit`
    } else {
      unit.name = unit.name + ' Battleship';
      unit.att = bs.att;
      unit.def = bs.def;
      unit.fort = bs.fort;
    }
  }
  return unit
}

module.exports.getUnit = function(unitPartial, prefix) {
  allUnits = this.unitList
  return new Promise(function(resolve, reject) {
    if(unitPartial.length < 2)
      reject('You need a minimum of two characters to return the stats for a specific unit!')
    if(!allUnits[unitPartial])
      reject(`The unit you are looking for doesn't exist or is under a different code.\nTry ${prefix}units to get the list of all units codes!`)
    resolve([allUnits[unitPartial], ])
  })
}

module.exports.getUnits = function() {
  return all
}

module.exports.getMaxHP = function(array, unit) {
  if (array.some(x => x.startsWith('v')) || array.some(x => Number(x) > unit.maxhp)) {
    return unit.vethp;
  }
  else {
    return unit.maxhp;
  }
}

module.exports.getCurrentHP = function(array, maxhp, message) {
  if (array.some(x => !isNaN(Number(x)))) {
    index = array.findIndex(x => !isNaN(Number(x)));
    currenthp = parseInt(array[index]);
    if (currenthp > maxhp) {
      message.channel.send('You have inputed a current hp higher than the veteran hp.nIn the meantime, this result calculates with the veteran hp as current hp.');
      return maxhp;
    }
    else if (currenthp < 1) {
      message.channel.send('One of the units is already dead. RIP.');
      return undefined;
    }
    else
      return currenthp;
  }
  else {
    return maxhp;
  }
}

module.exports.getBonus = function(array) {
  if (array.some(x => x === 'w')) {
    return [4, ' (walled)'];
  } else if (array.some(x => x === 'd')) {
    return [1.5, ' (protected)'];
  } else {
    return [1, ''];
  }
}

module.exports.getRetaliation = function(array) {
  if (array.some(x => x === 'nr'))
    return false;
  else
    return true;
}