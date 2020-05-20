module.exports.generateArraySequences = function(length) {
  const array = []
  for(let i = 0; i < length; i++) {
    array.push(i + 1)
  }
  return array
}

module.exports.generateSequences = function(xs) {
  const ret = [];

  for (let i = 0; i < xs.length; i = i + 1) {
    const rest = generateSubsequences(xs.slice(0, i).concat(xs.slice(i + 1)));

    if(!rest.length) {
      ret.push([xs[i]])
    } else {
      for(let j = 0; j < rest.length; j = j + 1) {
        ret.push([xs[i]].concat(rest[j]))
      }
    }
  }
  return ret;
}

function generateSubsequences(xs) {
  const ret = [];

  for (let i = 0; i < xs.length; i = i + 1) {
    const rest = generateSubsequences(xs.slice(0, i).concat(xs.slice(i + 1)));

    if(!rest.length) {
      ret.push([xs[i]])
    } else {
      for(let j = 0; j < rest.length; j = j + 1) {
        ret.push([xs[i]].concat(rest[j]))
      }
    }
  }
  return ret;
}

module.exports.multicombat = function(attackers, defender, sequence) {
  let totalAttackersHP = 0

  attackers.forEach(attacker => {
    totalAttackersHP = totalAttackersHP + attacker.currenthp
  })
  let solution = {
    defenderHP: defender.currenthp,
    attackerCasualties: 0,
    attackersHP: totalAttackersHP,
    hpLoss: [],
    sequence: sequence,
    finalSequence: []
  }

  for (const attacker of attackers) {
    const index = attackers.indexOf(attacker)
    if(solution.defenderHP <= 0)
      break

    if(doesNoDamage(attacker, defender, solution)) // returning -1 if the attacker does 0 dammage to the defender
      continue

    solution = combat(attacker, defender, solution)
    solution.finalSequence.push(sequence[index])
  }

  return solution
}

function doesNoDamage(attacker, defender, solution) {
  const aforce = attacker.att * attacker.currenthp / attacker.maxhp;
  const dforce = defender.def * solution.defenderHP / defender.maxhp * defender.bonus;

  if(attacker.att <= 0)
    return true

  const totaldam = aforce + dforce;
  const defdiff = Math.round(aforce / totaldam * attacker.att * 4.5);

  if(defdiff < 1)
    return true
}

function combat(attacker, defender, solution) {
  const aforce = attacker.att * attacker.currenthp / attacker.maxhp;
  const dforce = defender.def * solution.defenderHP / defender.maxhp * defender.bonus;

  const totaldam = aforce + dforce;
  const defdiff = Math.round(aforce / totaldam * attacker.att * 4.5);

  solution.defenderHP = solution.defenderHP - defdiff

  let attdiff = 0
  let hpattacker
  if(solution.defenderHP <= 0) {
    hpattacker = attacker.currenthp;
    solution.defenderHP = 0;
  } else if(!defender.retaliation || attacker.range) {
    hpattacker = attacker.currenthp
  } else {
    attdiff = Math.round(dforce / totaldam * defender.def * 4.5)
    attacker.attdiff = attdiff
    hpattacker = attacker.currenthp - attdiff;
    if(hpattacker <= 0) {
      hpattacker = 0
      solution.attackerCasualties = solution.attackerCasualties + 1
    }
  }

  if(attacker.currenthp - attdiff < 1)
    solution.hpLoss.push(attacker.currenthp)
  else
    solution.hpLoss.push(attdiff)

  solution.attackersHP = solution.attackersHP - attdiff
  return solution
}

// solution {
//   defenderHP: 15,
//   attackerCasualties: 0,
//   attackersHP: 30,
//   sequence: [1, 2, 3, 4],
//   finalSequence: [1, 2, 3]
//   hploss: [-3, -4, -5]
// }

module.exports.evaluate = function(bestSolution, newSolution) {
  if(newSolution.defenderHP < bestSolution.defenderHP)
    return true
  else {
    if(newSolution.defenderHP === bestSolution.defenderHP) {
      if(bestSolution.attackerCasualties > newSolution.attackerCasualties)
        return true
      else {
        if(bestSolution.attackerCasualties === newSolution.attackerCasualties) {
          if(bestSolution.attackersHP < newSolution.attackersHP)
            return true
          else {
            if(bestSolution.attackersHP === newSolution.attackersHP) {
              if(bestSolution.finalSequence.length > newSolution.finalSequence.length)
                return true
              else
                return false
            }
          }
        } else return false
      }
    } else return false
  }
}