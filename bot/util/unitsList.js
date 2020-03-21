module.exports = {
  wa: {
    name: 'Warrior',
    description: '',
    currenthp: 10,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.vetNow = true
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.vetNow = true
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.vetNow = true
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 10,
    vet: true,
    vetNow: false,
    att: 2,
    def: 2,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: true,
    retaliation: true,
    canBoard: true,
    onTheWater(navalArray) {
      if(navalArray[0].toLowerCase().startsWith('bo')) {
        this.description = this.description + ' Boat'
        this.att = 1
        this.def = 1
      }
      if(navalArray[0].toLowerCase().startsWith('sh')) {
        this.description = this.description + ' Ship'
        this.att = 2
        this.def = 2
      }
      if(navalArray[0].toLowerCase().startsWith('bs')) {
        this.description = this.description + ' Battleship'
        this.att = 4
        this.def = 3
      }
    }
  },
  ri: {
    name: 'Rider',
    description: '',
    currenthp: 10,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 10,
    vet: true,
    vetNow: false,
    att: 2,
    def: 1,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: true,
    retaliation: true,
    canBoard: true,
    onTheWater(navalArray) {
      if(navalArray[0].toLowerCase().startsWith('bo')) {
        this.description = this.description + ' Boat'
        this.att = 1
        this.def = 1
      }
      if(navalArray[0].toLowerCase().startsWith('sh')) {
        this.description = this.description + ' Ship'
        this.att = 2
        this.def = 2
      }
      if(navalArray[0].toLowerCase().startsWith('bs')) {
        this.description = this.description + ' Battleship'
        this.att = 4
        this.def = 3
      }
    }
  },
  ar: {
    name: 'Archer',
    description: '',
    currenthp: 10,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 10,
    vet: true,
    vetNow: false,
    att: 2,
    def: 1,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: true,
    retaliation: true,
    canBoard: true,
    onTheWater(navalArray) {
      if(navalArray[0].toLowerCase().startsWith('bo')) {
        this.description = this.description + ' Boat'
        this.att = 1
        this.def = 1
      }
      if(navalArray[0].toLowerCase().startsWith('sh')) {
        this.description = this.description + ' Ship'
        this.att = 2
        this.def = 2
      }
      if(navalArray[0].toLowerCase().startsWith('bs')) {
        this.description = this.description + ' Battleship'
        this.att = 4
        this.def = 3
      }
    }
  },
  de: {
    name: 'Defender',
    description: '',
    currenthp: 15,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 15,
    vet: true,
    vetNow: false,
    att: 1,
    def: 3,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: true,
    retaliation: true,
    canBoard: true,
    onTheWater(navalArray) {
      if(navalArray[0].toLowerCase().startsWith('bo')) {
        this.description = this.description + ' Boat'
        this.att = 1
        this.def = 1
      }
      if(navalArray[0].toLowerCase().startsWith('sh')) {
        this.description = this.description + ' Ship'
        this.att = 2
        this.def = 2
      }
      if(navalArray[0].toLowerCase().startsWith('bs')) {
        this.description = this.description + ' Battleship'
        this.att = 4
        this.def = 3
      }
    }
  },
  kn: {
    name: 'Knight',
    description: '',
    currenthp: 15,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 15,
    vet: true,
    vetNow: false,
    att: 3.5,
    def: 1,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: true,
    retaliation: true,
    canBoard: true,
    onTheWater(navalArray) {
      if(navalArray[0].toLowerCase().startsWith('bo')) {
        this.description = this.description + ' Boat'
        this.att = 1
        this.def = 1
      }
      if(navalArray[0].toLowerCase().startsWith('sh')) {
        this.description = this.description + ' Ship'
        this.att = 2
        this.def = 2
      }
      if(navalArray[0].toLowerCase().startsWith('bs')) {
        this.description = this.description + ' Battleship'
        this.att = 4
        this.def = 3
      }
    }
  },
  sw: {
    name: 'Swordsman',
    description: '',
    currenthp: 15,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 15,
    vet: true,
    vetNow: false,
    att: 3,
    def: 3,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: true,
    retaliation: true,
    canBoard: true,
    onTheWater(navalArray) {
      if(navalArray[0].toLowerCase().startsWith('bo')) {
        this.description = this.description + ' Boat'
        this.att = 1
        this.def = 1
      }
      if(navalArray[0].toLowerCase().startsWith('sh')) {
        this.description = this.description + ' Ship'
        this.att = 2
        this.def = 2
      }
      if(navalArray[0].toLowerCase().startsWith('bs')) {
        this.description = this.description + ' Battleship'
        this.att = 4
        this.def = 3
      }
    }
  },
  ca: {
    name: 'Catapult',
    description: '',
    currenthp: 10,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 10,
    vet: true,
    vetNow: false,
    att: 4,
    def: 0,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: false,
    retaliation: true,
    canBoard: true,
    onTheWater(navalArray) {
      if(navalArray[0].toLowerCase().startsWith('bo')) {
        this.description = this.description + ' Boat'
        this.att = 1
        this.def = 1
      }
      if(navalArray[0].toLowerCase().startsWith('sh')) {
        this.description = this.description + ' Ship'
        this.att = 2
        this.def = 2
      }
      if(navalArray[0].toLowerCase().startsWith('bs')) {
        this.description = this.description + ' Battleship'
        this.att = 4
        this.def = 3
      }
    }
  },
  gi: {
    name: 'Giant',
    description: '',
    currenthp: 40,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 40,
    vet: false,
    vetNow: false,
    att: 5,
    def: 4,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: false,
    retaliation: true,
    canBoard: true,
    onTheWater(navalArray) {
      if(navalArray[0].toLowerCase().startsWith('bo')) {
        this.description = this.description + ' Boat'
        this.att = 1
        this.def = 1
      }
      if(navalArray[0].toLowerCase().startsWith('sh')) {
        this.description = this.description + ' Ship'
        this.att = 2
        this.def = 2
      }
      if(navalArray[0].toLowerCase().startsWith('bs')) {
        this.description = this.description + ' Battleship'
        this.att = 4
        this.def = 3
      }
    }
  },
  cr: {
    name: 'Crab',
    description: '',
    currenthp: 40,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 40,
    vet: false,
    vetNow: false,
    att: 4,
    def: 4,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: false,
    retaliation: true,
    canBoard: false
  },
  tr: {
    name: 'Tridention',
    description: '',
    currenthp: 15,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 15,
    vet: true,
    vetNow: false,
    att: 3,
    def: 1,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: true,
    retaliation: true,
    canBoard: false
  },
  po: {
    name: 'Polytaur',
    description: '',
    currenthp: 15,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 15,
    vet: true,
    vetNow: false,
    att: 3,
    def: 1,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: true,
    retaliation: true,
    canBoard: true,
    onTheWater(navalArray) {
      if(navalArray[0].toLowerCase().startsWith('bo')) {
        this.description = this.description + ' Boat'
        this.att = 1
        this.def = 1
      }
      if(navalArray[0].toLowerCase().startsWith('sh')) {
        this.description = this.description + ' Ship'
        this.att = 2
        this.def = 2
      }
      if(navalArray[0].toLowerCase().startsWith('bs')) {
        this.description = this.description + ' Battleship'
        this.att = 4
        this.def = 3
      }
    }
  },
  na: {
    name: 'Navalon',
    description: '',
    currenthp: 30,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 30,
    vet: false,
    vetNow: false,
    att: 4,
    def: 4,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: false,
    retaliation: true,
    canBoard: false
  },
  ga: {
    name: 'Gaami',
    description: '',
    currenthp: 30,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 30,
    vet: false,
    vetNow: false,
    att: 4,
    def: 4,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: false,
    retaliation: true,
    canBoard: false
  },
  mb: {
    name: 'Mind Bender',
    description: '',
    currenthp: 10,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 10,
    vet: false,
    vetNow: false,
    att: 0,
    def: 1,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: false,
    retaliation: false,
    canBoard: true,
    onTheWater(navalArray) {
      if(navalArray[0].toLowerCase().startsWith('bo')) {
        this.description = this.description + ' Boat'
        this.att = 1
        this.def = 1
      }
      if(navalArray[0].toLowerCase().startsWith('sh')) {
        this.description = this.description + ' Ship'
        this.att = 2
        this.def = 2
      }
      if(navalArray[0].toLowerCase().startsWith('bs')) {
        this.description = this.description + ' Battleship'
        this.att = 4
        this.def = 3
      }
    }
  },
  eg: {
    name: 'Dragon Egg',
    description: '',
    currenthp: 10,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 10,
    vet: false,
    vetNow: false,
    att: 0,
    def: 2,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: false,
    retaliation: true,
    canBoard: true,
    onTheWater(navalArray) {
      if(navalArray[0].toLowerCase().startsWith('bo')) {
        this.description = this.description + ' Boat'
        this.att = 1
        this.def = 1
      }
      if(navalArray[0].toLowerCase().startsWith('sh')) {
        this.description = this.description + ' Ship'
        this.att = 2
        this.def = 2
      }
      if(navalArray[0].toLowerCase().startsWith('bs')) {
        this.description = this.description + ' Battleship'
        this.att = 4
        this.def = 3
      }
    }
  },
  bd: {
    name: 'Baby Dragon',
    description: '',
    currenthp: 15,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 15,
    vet: true,
    vetNow: false,
    att: 3,
    def: 3,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: false,
    retaliation: true,
    canBoard: false
  },
  dr: {
    name: 'Fire Dragon',
    description: '',
    currenthp: 20,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 20,
    vet: false,
    vetNow: false,
    att: 4,
    def: 3,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: false,
    retaliation: true,
    canBoard: false
  },
  mo: {
    name: 'Mooni',
    description: '',
    currenthp: 10,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 10,
    vet: false,
    vetNow: false,
    att: 0,
    def: 2,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: false,
    retaliation: false,
    canBoard: false
  },
  sl: {
    name: 'Battle Sled',
    description: '',
    currenthp: 15,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 15,
    vet: true,
    vetNow: false,
    att: 3,
    def: 2,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: false,
    retaliation: true,
    canBoard: false
  },
  ic: {
    name: 'Ice Fortress',
    description: '',
    currenthp: 20,
    setHP(message, hpArray) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = currentHPArray[0]
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if (currentHP < 1)
        throw 'One of the units is already dead. RIP.';
      if(hpArray.some(x => x === 'v')) {
        if(currentHP)
          this.currenthp = currentHP
        this.maxhp = vetHP
      }

      if(currentHP > vetHP && this.vet) {
        this.currenthp = vetHP
        this.maxhp = vetHP
        message.channel.send(`You have inputed a current hp higher than the maximum hp.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else if(currentHP > this.maxhp && this.vet) {
        this.currenthp = currentHP
        this.maxhp = vetHP
        message.channel.send('I just made your unit into a veteran for you!\nNext time, you can just add a `v` in there to ensure it\'s a veteran!')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
      } else
        this.currenthp = currentHP;
    },
    maxhp: 20,
    vet: true,
    vetNow: false,
    att: 4,
    def: 3,
    bonus: 1,
    addBonus(message, bonusArray) {
      let defenseBonus = bonusArray.filter(value => value === 'w' || value === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => x.delete(10000).then().catch(console.error)).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        }
        if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        }
      }
    },
    fort: false,
    retaliation: true,
    canBoard: false
  }
}