/* eslint-disable no-empty-function */
const successDelete = { timeout: 60000 }

module.exports = {
  wa: {
    name: 'Warrior',
    description: '',
    currenthp: 10,
    maxhp: 10,
    vet: true,
    vetNow: false,
    att: 2,
    def: 2,
    bonus: 1,
    fort: true,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    },
    onTheWater(navalArray) {
      if(this.bonus === 4)
        throw 'Are you saying a naval unit can be in a city :thinking:...'

      this.ranged = true
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
    },
    getOverride: function(unitArray) {
      const overrides = unitArray.filter(x => x === 'r' || x === 'nr')
      if(overrides.length > 1)
        throw `Put your beer down and learn to type.\nYou can't put both \`r\` **and** \`nr\` for the ${this.currenthp}hp ${this.name}${this.description}...`
      else if (overrides.length === 0)
        return
      else
        return this.retaliationOverride = overrides[0]
    }
  },
  ri: {
    name: 'Rider',
    description: '',
    currenthp: 10,
    maxhp: 10,
    vet: true,
    vetNow: false,
    att: 2,
    def: 1,
    bonus: 1,
    fort: true,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    },
    onTheWater(navalArray) {
      if(this.bonus === 4)
        throw 'Are you saying a naval unit can be in a city :thinking:...'

      this.ranged = true
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
    },
    getOverride: function(unitArray) {
      const overrides = unitArray.filter(x => x === 'r' || x === 'nr')
      if(overrides.length > 1)
        throw `Put your beer down and learn to type.\nYou can't put both \`r\` **and** \`nr\` for the ${this.currenthp}hp ${this.name}${this.description}...`
      else if (overrides.length === 0)
        return
      else
        return this.retaliationOverride = overrides[0]
    }
  },
  ar: {
    name: 'Archer',
    description: '',
    currenthp: 10,
    maxhp: 10,
    vet: true,
    vetNow: false,
    att: 2,
    def: 1,
    bonus: 1,
    fort: true,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    },
    onTheWater(navalArray) {
      if(this.bonus === 4)
        throw 'Are you saying a naval unit can be in a city :thinking:...'

      this.ranged = true
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
    },
    getOverride: function(unitArray) {
      const overrides = unitArray.filter(x => x === 'r' || x === 'nr')
      if(overrides.length > 1)
        throw `Put your beer down and learn to type.\nYou can't put both \`r\` **and** \`nr\` for the ${this.currenthp}hp ${this.name}${this.description}...`
      else if (overrides.length === 0)
        return
      else
        return this.retaliationOverride = overrides[0]
    }
  },
  de: {
    name: 'Defender',
    description: '',
    currenthp: 15,
    maxhp: 15,
    vet: true,
    vetNow: false,
    att: 1,
    def: 3,
    bonus: 1,
    fort: true,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    },
    onTheWater(navalArray) {
      if(this.bonus === 4)
        throw 'Are you saying a naval unit can be in a city :thinking:...'

      this.ranged = true
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
    },
    getOverride: function(unitArray) {
      const overrides = unitArray.filter(x => x === 'r' || x === 'nr')
      if(overrides.length > 1)
        throw `Put your beer down and learn to type.\nYou can't put both \`r\` **and** \`nr\` for the ${this.currenthp}hp ${this.name}${this.description}...`
      else if (overrides.length === 0)
        return
      else
        return this.retaliationOverride = overrides[0]
    }
  },
  kn: {
    name: 'Knight',
    description: '',
    currenthp: 15,
    maxhp: 15,
    vet: true,
    vetNow: false,
    att: 3.5,
    def: 1,
    bonus: 1,
    fort: true,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    },
    onTheWater(navalArray) {
      if(this.bonus === 4)
        throw 'Are you saying a naval unit can be in a city :thinking:...'

      this.ranged = true
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
    },
    getOverride: function(unitArray) {
      const overrides = unitArray.filter(x => x === 'r' || x === 'nr')
      if(overrides.length > 1)
        throw `Put your beer down and learn to type.\nYou can't put both \`r\` **and** \`nr\` for the ${this.currenthp}hp ${this.name}${this.description}...`
      else if (overrides.length === 0)
        return
      else
        return this.retaliationOverride = overrides[0]
    }
  },
  sw: {
    name: 'Swordsman',
    description: '',
    currenthp: 15,
    maxhp: 15,
    vet: true,
    vetNow: false,
    att: 3,
    def: 3,
    bonus: 1,
    fort: true,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    },
    onTheWater(navalArray) {
      if(this.bonus === 4)
        throw 'Are you saying a naval unit can be in a city :thinking:...'

      this.ranged = true
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
    },
    getOverride: function(unitArray) {
      const overrides = unitArray.filter(x => x === 'r' || x === 'nr')
      if(overrides.length > 1)
        throw `Put your beer down and learn to type.\nYou can't put both \`r\` **and** \`nr\` for the ${this.currenthp}hp ${this.name}${this.description}...`
      else if (overrides.length === 0)
        return
      else
        return this.retaliationOverride = overrides[0]
    }
  },
  ca: {
    name: 'Catapult',
    description: '',
    currenthp: 10,
    maxhp: 10,
    vet: true,
    vetNow: false,
    att: 4,
    def: 0,
    bonus: 1,
    fort: false,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else {
          if(defenseBonus.some(x => x === 'd')) {
            this.bonus = 1.5
          } else {
            this.bonus = 1
          }
        }
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    },
    onTheWater(navalArray) {
      if(this.bonus === 4)
        throw 'Are you saying a naval unit can be in a city :thinking:...'

      this.ranged = true
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
    },
    getOverride: function(unitArray) {
      const overrides = unitArray.filter(x => x === 'r' || x === 'nr')
      if(overrides.length > 1)
        throw `Put your beer down and learn to type.\nYou can't put both \`r\` **and** \`nr\` for the ${this.currenthp}hp ${this.name}${this.description}...`
      else if (overrides.length === 0)
        return
      else
        return this.retaliationOverride = overrides[0]
    }
  },
  gi: {
    name: 'Giant',
    description: '',
    currenthp: 40,
    maxhp: 40,
    vet: false,
    vetNow: false,
    att: 5,
    def: 4,
    bonus: 1,
    fort: false,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else {
          if(defenseBonus.some(x => x === 'd')) {
            this.bonus = 1.5
          } else {
            this.bonus = 1
          }
        }
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    },
    onTheWater(navalArray) {
      if(this.bonus === 4)
        throw 'Are you saying a naval unit can be in a city :thinking:...'

      this.ranged = true
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
    },
    getOverride: function(unitArray) {
      const overrides = unitArray.filter(x => x === 'r' || x === 'nr')
      if(overrides.length > 1)
        throw `Put your beer down and learn to type.\nYou can't put both \`r\` **and** \`nr\` for the ${this.currenthp}hp ${this.name}${this.description}...`
      else if (overrides.length === 0)
        return
      else
        return this.retaliationOverride = overrides[0]
    }
  },
  cr: {
    name: 'Crab',
    description: '',
    currenthp: 40,
    maxhp: 40,
    vet: false,
    vetNow: false,
    att: 4,
    def: 4,
    bonus: 1,
    fort: false,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else {
          if(defenseBonus.some(x => x === 'd')) {
            this.bonus = 1.5
          } else {
            this.bonus = 1
          }
        }
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    }
  },
  tr: {
    name: 'Tridention',
    description: '',
    currenthp: 15,
    maxhp: 15,
    vet: true,
    vetNow: false,
    att: 3,
    def: 1,
    bonus: 1,
    fort: true,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    }
  },
  po: {
    name: 'Polytaur',
    description: '',
    currenthp: 15,
    maxhp: 15,
    vet: true,
    vetNow: false,
    att: 3,
    def: 1,
    bonus: 1,
    fort: true,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else
          this.bonus = 1.5
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    },
    onTheWater(navalArray) {
      if(this.bonus === 4)
        throw 'Are you saying a naval unit can be in a city :thinking:...'

      this.ranged = true
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
    },
    getOverride: function(unitArray) {
      const overrides = unitArray.filter(x => x === 'r' || x === 'nr')
      if(overrides.length > 1)
        throw `Put your beer down and learn to type.\nYou can't put both \`r\` **and** \`nr\` for the ${this.currenthp}hp ${this.name}${this.description}...`
      else if (overrides.length === 0)
        return
      else
        return this.retaliationOverride = overrides[0]
    }
  },
  na: {
    name: 'Navalon',
    description: '',
    currenthp: 30,
    maxhp: 30,
    vet: false,
    vetNow: false,
    att: 4,
    def: 4,
    bonus: 1,
    fort: false,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else {
          if(defenseBonus.some(x => x === 'd')) {
            this.bonus = 1.5
          } else {
            this.bonus = 1
          }
        }
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    }
  },
  ga: {
    name: 'Gaami',
    description: '',
    currenthp: 30,
    maxhp: 30,
    vet: false,
    vetNow: false,
    att: 4,
    def: 4,
    bonus: 1,
    fort: false,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else {
          if(defenseBonus.some(x => x === 'd')) {
            this.bonus = 1.5
          } else {
            this.bonus = 1
          }
        }
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    }
  },
  mb: {
    name: 'Mind Bender',
    description: '',
    currenthp: 10,
    maxhp: 10,
    vet: false,
    vetNow: false,
    att: 0,
    def: 1,
    bonus: 1,
    fort: false,
    retaliation: false,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else {
          if(defenseBonus.some(x => x === 'd')) {
            this.bonus = 1.5
          } else {
            this.bonus = 1
          }
        }
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    },
    onTheWater(navalArray) {
      if(this.bonus === 4)
        throw 'Are you saying a naval unit can be in a city :thinking:...'

      this.ranged = true
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
    },
    getOverride: function(unitArray) {
      const overrides = unitArray.filter(x => x === 'r' || x === 'nr')
      if(overrides.length > 1)
        throw `Put your beer down and learn to type.\nYou can't put both \`r\` **and** \`nr\` for the ${this.currenthp}hp ${this.name}${this.description}...`
      else if (overrides.length === 0)
        return
      else
        return this.retaliationOverride = overrides[0]
    }
  },
  eg: {
    name: 'Dragon Egg',
    description: '',
    currenthp: 10,
    maxhp: 10,
    vet: false,
    vetNow: false,
    att: 0,
    def: 2,
    bonus: 1,
    fort: false,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else {
          if(defenseBonus.some(x => x === 'd')) {
            this.bonus = 1.5
          } else {
            this.bonus = 1
          }
        }
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    },
    onTheWater(navalArray) {
      if(this.bonus === 4)
        throw 'Are you saying a naval unit can be in a city :thinking:...'

      this.ranged = true
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
    },
    getOverride: function(unitArray) {
      const overrides = unitArray.filter(x => x === 'r' || x === 'nr')
      if(overrides.length > 1)
        throw `Put your beer down and learn to type.\nYou can't put both \`r\` **and** \`nr\` for the ${this.currenthp}hp ${this.name}${this.description}...`
      else if (overrides.length === 0)
        return
      else
        return this.retaliationOverride = overrides[0]
    }
  },
  bd: {
    name: 'Baby Dragon',
    description: '',
    currenthp: 15,
    maxhp: 15,
    vet: true,
    vetNow: false,
    att: 3,
    def: 3,
    bonus: 1,
    fort: false,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else {
          if(defenseBonus.some(x => x === 'd')) {
            this.bonus = 1.5
          } else {
            this.bonus = 1
          }
        }
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    }
  },
  dr: {
    name: 'Fire Dragon',
    description: '',
    currenthp: 20,
    maxhp: 20,
    vet: false,
    vetNow: false,
    att: 4,
    def: 3,
    bonus: 1,
    fort: false,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else {
          if(defenseBonus.some(x => x === 'd')) {
            this.bonus = 1.5
          } else {
            this.bonus = 1
          }
        }
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    }
  },
  mo: {
    name: 'Mooni',
    description: '',
    currenthp: 15,
    maxhp: 15,
    vet: true,
    vetNow: false,
    att: 3,
    def: 3,
    bonus: 1,
    fort: false,
    retaliation: false,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else {
          if(defenseBonus.some(x => x === 'd')) {
            this.bonus = 1.5
          } else {
            this.bonus = 1
          }
        }
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    }
  },
  sl: {
    name: 'Battle Sled',
    description: '',
    currenthp: 15,
    maxhp: 15,
    vet: true,
    vetNow: false,
    att: 3,
    def: 2,
    bonus: 1,
    fort: false,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else {
          if(defenseBonus.some(x => x === 'd')) {
            this.bonus = 1.5
          } else {
            this.bonus = 1
          }
        }
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    }
  },
  ic: {
    name: 'Ice Fortress',
    description: '',
    currenthp: 20,
    maxhp: 20,
    vet: true,
    vetNow: false,
    att: 4,
    def: 3,
    bonus: 1,
    fort: false,
    retaliation: true,
    setHP(message, hpArray, willDelete) {
      const currentHPArray = hpArray.filter(x => !isNaN(parseInt(x)))
      const currentHP = Number(currentHPArray[0])
      const vetHP = (this.vet) ? this.maxhp + 5 : this.maxhp
      if(currentHP < 1)
        throw 'One of the units is already dead. RIP.'

      if(hpArray.some(x => x === 'v')) {
        if(this.vet) {
          this.vetNow = true
          this.maxhp = vetHP
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
        } else {
          if(!currentHP || currentHP > this.maxhp)
            this.currenthp = this.maxhp
          else
            this.currenthp = currentHP
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        }
      } else if(currentHP > this.maxhp) {
        if(!this.vet) {
          message.channel.send(`The ${this.name} can't become a veteran, so we'll proceed without it!`)
            .then(x => {
              if(willDelete) {
                x.delete(successDelete).then().catch(console.error)
                message.delete(successDelete).then().catch(console.error)
              }
            }).catch(console.error)
        } else {
          this.vetNow = true
          this.maxhp = vetHP
          if(currentHP > vetHP) {
            this.currenthp = vetHP
            message.channel.send(`You have inputed a current hp higher than the maximum hp for ${this.name}.\nIn the meantime, this result calculates with the highest hp possible, ${vetHP}.`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          } else {
            this.currenthp = currentHP
            message.channel.send(`I just made the ${this.name} into a veteran for you!\nNext time, you can just add a \`v\` in there to ensure it's a veteran!`)
              .then(x => {
                if(willDelete) {
                  x.delete(successDelete).then().catch(console.error)
                  message.delete(successDelete).then().catch(console.error)
                }
              }).catch(console.error)
          }
        }
      } else {
        this.currenthp = currentHP
      }
    },
    addBonus(message, bonusArray, willDelete) {
      let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd')
      defenseBonus = [ ...new Set(defenseBonus) ] // Deletes doubles

      if(defenseBonus.length >= 2) {
        message.channel.send('You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.')
          .then(x => {
            if(willDelete) {
              x.delete(successDelete).then().catch(console.error)
              message.delete(successDelete).then().catch(console.error)
            }
          }).catch(console.error)
        if(defenseBonus.some(x => x === 'w') && this.fort === true) {
          this.bonus = 4
        } else {
          if(defenseBonus.some(x => x === 'd')) {
            this.bonus = 1.5
          } else {
            this.bonus = 1
          }
        }
      } else {
        if(bonusArray[0].toLowerCase() === 'd') {
          this.bonus = 1.5
        } else if(bonusArray[0].toLowerCase() === 'w' && this.fort === true) {
          this.bonus = 4
        } else {
          this.bonus = 1
        }
      }
    }
  }
}