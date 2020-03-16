module.exports = {
  wa: {
    name: 'Warrior',
    currenthp: 10,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 10,
    vet: true,
    att: 2,
    def: 2,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: true,
    retaliation: true,
    canBoard: true,
    onTheWater(navalUnit) {
      if(navalUnit === 'bo') {
        this.name = this.name + ' Boat',
        this.maxhp = 1,
        this.vethp = 1
      }
      if(navalUnit === 'sh') {
        this.name = this.name + ' Ship',
        this.maxhp = 2,
        this.vethp = 2
      }
      if(navalUnit === 'bs') {
        this.name = this.name + ' Battleship',
        this.maxhp = 4,
        this.vethp = 3
      }
    }
  },
  ri: {
    name: 'Rider',
    currenthp: 10,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 10,
    vet: true,
    att: 2,
    def: 1,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: true,
    retaliation: true,
    canBoard: true,
    onTheWater(navalUnit) {
      if(navalUnit === 'bo') {
        this.name = this.name + ' Boat',
        this.maxhp = 1,
        this.vethp = 1
      }
      if(navalUnit === 'sh') {
        this.name = this.name + ' Ship',
        this.maxhp = 2,
        this.vethp = 2
      }
      if(navalUnit === 'bs') {
        this.name = this.name + ' Battleship',
        this.maxhp = 4,
        this.vethp = 3
      }
    }
  },
  ar: {
    name: 'Archer',
    currenthp: 10,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 10,
    vet: true,
    att: 2,
    def: 1,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: true,
    retaliation: true,
    canBoard: true,
    onTheWater(navalUnit) {
      if(navalUnit === 'bo') {
        this.name = this.name + ' Boat',
        this.maxhp = 1,
        this.vethp = 1
      }
      if(navalUnit === 'sh') {
        this.name = this.name + ' Ship',
        this.maxhp = 2,
        this.vethp = 2
      }
      if(navalUnit === 'bs') {
        this.name = this.name + ' Battleship',
        this.maxhp = 4,
        this.vethp = 3
      }
    }
  },
  de: {
    name: 'Defender',
    currenthp: 15,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 15,
    vet: true,
    att: 1,
    def: 3,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: true,
    retaliation: true,
    canBoard: true,
    onTheWater(navalUnit) {
      if(navalUnit === 'bo') {
        this.name = this.name + ' Boat',
        this.maxhp = 1,
        this.vethp = 1
      }
      if(navalUnit === 'sh') {
        this.name = this.name + ' Ship',
        this.maxhp = 2,
        this.vethp = 2
      }
      if(navalUnit === 'bs') {
        this.name = this.name + ' Battleship',
        this.maxhp = 4,
        this.vethp = 3
      }
    }
  },
  kn: {
    name: 'Knight',
    currenthp: 15,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 15,
    vet: true,
    att: 3.5,
    def: 1,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: true,
    retaliation: true,
    canBoard: true,
    onTheWater(navalUnit) {
      if(navalUnit === 'bo') {
        this.name = this.name + ' Boat',
        this.maxhp = 1,
        this.vethp = 1
      }
      if(navalUnit === 'sh') {
        this.name = this.name + ' Ship',
        this.maxhp = 2,
        this.vethp = 2
      }
      if(navalUnit === 'bs') {
        this.name = this.name + ' Battleship',
        this.maxhp = 4,
        this.vethp = 3
      }
    }
  },
  sw: {
    name: 'Swordsman',
    currenthp: 15,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 15,
    vet: true,
    att: 3,
    def: 3,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: true,
    retaliation: true,
    canBoard: true,
    onTheWater(navalUnit) {
      if(navalUnit === 'bo') {
        this.name = this.name + ' Boat',
        this.maxhp = 1,
        this.vethp = 1
      }
      if(navalUnit === 'sh') {
        this.name = this.name + ' Ship',
        this.maxhp = 2,
        this.vethp = 2
      }
      if(navalUnit === 'bs') {
        this.name = this.name + ' Battleship',
        this.maxhp = 4,
        this.vethp = 3
      }
    }
  },
  ca: {
    name: 'Catapult',
    currenthp: 10,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 10,
    vet: true,
    att: 4,
    def: 0,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: false,
    retaliation: true,
    canBoard: true,
    onTheWater(navalUnit) {
      if(navalUnit === 'bo') {
        this.name = this.name + ' Boat',
        this.maxhp = 1,
        this.vethp = 1
      }
      if(navalUnit === 'sh') {
        this.name = this.name + ' Ship',
        this.maxhp = 2,
        this.vethp = 2
      }
      if(navalUnit === 'bs') {
        this.name = this.name + ' Battleship',
        this.maxhp = 4,
        this.vethp = 3
      }
    }
  },
  gi: {
    name: 'Giant',
    currenthp: 40,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 40,
    vet: false,
    att: 5,
    def: 4,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: false,
    retaliation: true,
    canBoard: true,
    onTheWater(navalUnit) {
      if(navalUnit === 'bo') {
        this.name = this.name + ' Boat',
        this.maxhp = 1,
        this.vethp = 1
      }
      if(navalUnit === 'sh') {
        this.name = this.name + ' Ship',
        this.maxhp = 2,
        this.vethp = 2
      }
      if(navalUnit === 'bs') {
        this.name = this.name + ' Battleship',
        this.maxhp = 4,
        this.vethp = 3
      }
    }
  },
  cr: {
    name: 'Crab',
    currenthp: 40,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 40,
    vet: false,
    att: 4,
    def: 4,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: false,
    retaliation: true,
    canBoard: false
  },
  tr: {
    name: 'Tridention',
    currenthp: 15,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 15,
    vet: true,
    att: 3,
    def: 1,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: true,
    retaliation: true,
    canBoard: false
  },
  po: {
    name: 'Polytaur',
    currenthp: 15,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 15,
    vet: true,
    att: 3,
    def: 1,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: true,
    retaliation: true,
    canBoard: true,
    onTheWater(navalUnit) {
      if(navalUnit === 'bo') {
        this.name = this.name + ' Boat',
        this.maxhp = 1,
        this.vethp = 1
      }
      if(navalUnit === 'sh') {
        this.name = this.name + ' Ship',
        this.maxhp = 2,
        this.vethp = 2
      }
      if(navalUnit === 'bs') {
        this.name = this.name + ' Battleship',
        this.maxhp = 4,
        this.vethp = 3
      }
    }
  },
  na: {
    name: 'Navalon',
    currenthp: 30,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 30,
    vet: false,
    att: 4,
    def: 4,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: false,
    retaliation: true,
    canBoard: false
  },
  ga: {
    name: 'Gaami',
    currenthp: 30,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 30,
    vet: false,
    att: 4,
    def: 4,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: false,
    retaliation: true,
    canBoard: false
  },
  mb: {
    name: 'Mind Bender',
    currenthp: 10,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 10,
    vet: false,
    att: 0,
    def: 1,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: false,
    retaliation: false,
    canBoard: true,
    onTheWater(navalUnit) {
      if(navalUnit === 'bo') {
        this.name = this.name + ' Boat',
        this.maxhp = 1,
        this.vethp = 1
      }
      if(navalUnit === 'sh') {
        this.name = this.name + ' Ship',
        this.maxhp = 2,
        this.vethp = 2
      }
      if(navalUnit === 'bs') {
        this.name = this.name + ' Battleship',
        this.maxhp = 4,
        this.vethp = 3
      }
    }
  },
  eg: {
    name: 'Dragon Egg',
    currenthp: 10,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 10,
    vet: false,
    att: 0,
    def: 2,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: false,
    retaliation: true,
    canBoard: true,
    onTheWater(navalUnit) {
      if(navalUnit === 'bo') {
        this.name = this.name + ' Boat',
        this.maxhp = 1,
        this.vethp = 1
      }
      if(navalUnit === 'sh') {
        this.name = this.name + ' Ship',
        this.maxhp = 2,
        this.vethp = 2
      }
      if(navalUnit === 'bs') {
        this.name = this.name + ' Battleship',
        this.maxhp = 4,
        this.vethp = 3
      }
    }
  },
  bd: {
    name: 'Baby Dragon',
    currenthp: 15,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 15,
    vet: true,
    att: 3,
    def: 3,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: false,
    retaliation: true,
    canBoard: false
  },
  dr: {
    name: 'Fire Dragon',
    currenthp: 20,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 20,
    vet: false,
    att: 4,
    def: 3,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: false,
    retaliation: true,
    canBoard: false
  },
  mo: {
    name: 'Mooni',
    currenthp: 10,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 10,
    vet: false,
    att: 0,
    def: 2,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: false,
    retaliation: false,
    canBoard: false
  },
  sl: {
    name: 'Battle Sled',
    currenthp: 15,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 15,
    vet: true,
    att: 3,
    def: 2,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: false,
    retaliation: true,
    canBoard: false
  },
  ic: {
    name: 'Ice Fortress',
    currenthp: 20,
    setHP(array, message) {
      const currentHPArray = array.filter(x => !isNaN(parseInt(x)));
      const currentHP = parseInt(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      else if (currentHPArray.length === 0)
        this.currenthp = this.maxhp
      else if(currentHP > vetHP) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(array.some(x => x === 'v')) {
        this.currenthp = currentHP
        this.maxhp = vetHP
      } else
        this.currenthp = currentHP;
    },
    maxhp: 20,
    vet: true,
    att: 4,
    def: 3,
    bonus: 1,
    addBonus(bonus) {
      if(bonus === 'd') {
        this.bonus = 1.5
      }
      if(bonus === 'w' && this.fort === true) {
        this.bonus = 4
      }
    },
    fort: false,
    retaliation: true,
    canBoard: false
  }
}