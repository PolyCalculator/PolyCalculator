const wa = {
    name: "Warrior",
    maxhp: 10,
    vethp: 15,
    att: 2,
    def: 2
}

const ri = {
    name: "Rider",
    maxhp: 10,
    vethp: 15,
    att: 2,
    def: 1
}

const ar = {
    name: "Archer",
    maxhp: 10,
    vethp: 15,
    att: 2,
    def: 1
}

const de = {
    name: "Defender",
    maxhp: 15,
    vethp: 20,
    att: 1,
    def: 3
}

const kn = {
    name: "Knight",
    maxhp: 15,
    vethp: 20,
    att: 3.5,
    def: 1
}

const sw = {
    name: "Swordsman",
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 3
}

const ca = {
    name: "Catapult",
    maxhp: 10,
    vethp: 15,
    att: 4,
    def: 0
}

const gi = {
    name: "Giant",
    maxhp: 40,
    vethp: 40,
    att: 5,
    def: 4
}

const cr = {
    name: "Crab",
    maxhp: 40,
    vethp: 40,
    att: 4,
    def: 4
}

const tr = {
    name: "Tridention",
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 1
}

const po = {
    name: "Polytaur",
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 1
}

const na = {
    name: "Navalon",
    maxhp: 30,
    vethp: 30,
    att: 4,
    def: 4
}

const bo = {
    name: "Boat",
    maxhp: undefined,
    vethp: undefined,
    att: 1,
    def: 1
}

const sh = {
    name: "Ship",
    maxhp: undefined,
    vethp: undefined,
    att: 2,
    def: 2
}

const bs = {
    name: "Battleship",
    maxhp: undefined,
    vethp: undefined,
    att: 4,
    def: 3
}

const ga = {
    name: "Gaami",
    maxhp: 30,
    vethp: 30,
    att: 4,
    def: 4
}

const mb = {
    name: "Mind Bender",
    maxhp: 10,
    vethp: 10,
    att: 0,
    def: 1
}

const bd = {
    name: "Baby Dragon",
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 3
}

const dr = {
    name: "Fire Dragon",
    maxhp: 20,
    vethp: 20,
    att: 4,
    def: 3
}

const mo = {
    name: "Mooni",
    maxhp: 10,
    vethp: 10,
    att: 0,
    def: 2
}

const sl = {
    name: "Battle Sled",
    maxhp: 15,
    vethp: 20,
    att: 3,
    def: 2
}

const ic = {
    name: "Ice Fortress",
    maxhp: 20,
    vethp: 25,
    att: 4,
    def: 3
}

const nonnaval = { wa, ri, ar, de, kn, sw, ca, gi, cr, tr, po, na, ga, mb, bd, dr, mo, sl, ic }

const all = { wa, ri, ar, de, kn, sw, ca, gi, cr, tr, po, na, ga, mb, bd, dr, mo, sl, ic, bo, sh, bs }

module.exports.getFightUnit = function (array) {
    return new Promise((resolve, reject) => {
        unitKeys = Object.keys(all);
        console.log("unitKeys:", unitKeys)
        let unitKey = array.filter(value => unitKeys.includes(value.substring(0,2)))
        unitKey = unitKey.toString().substring(0,2)
        console.log("unitKey (post-substring):", unitKey)
        unit = all[unitKey]
        console.log("unit:", unit)

        if(unit) {
            if(unit.name.toLowerCase() === "navalon" || unit.name.toLowerCase() === "tridention" || unit.name.toLowerCase() === "crab" || unit.name.toLowerCase() === "baby dragon" || unit.name.toLowerCase() === "fire dragon" || unit.name.toLowerCase() === "navalon" || unit.name.toLowerCase() === "battle sled" || unit.name.toLowerCase() === "ice fortress")
                resolve(`This ${unit.name.toLowerCase()} can't go in a naval unit`)
            else {
                if(array.some(x => x.startsWith("bo"))) {
                    unit.name = unit.name + " Boat";
                    unit.att = 1;
                    unit.def = 1;
                } else if(array.some(x => x.startsWith("sh"))) {
                    unit.name = unit.name + " Ship";
                    unit.att = 2;
                    unit.def = 2;
                } else if(array.some(x => (x.startsWith("ba") || x.startsWith("bs")))) {
                    unit.name = unit.name + " Battleship";
                    unit.att = 4;
                    unit.def = 3;
                }
            }
        } else
            resolve(`**ERROR:** We couldn't find one of the units.\n*REQUIRED: You need to type at least two characters of the unit. The list is available with \`${prefix}units\`*\n\nFor naval units, make sure you include which unit is in.\n   Long ex: \`${prefix}calc boat warrior vet, ship warrior\`\n   Short ex: \`${prefix}calc bo wa v, sh wa\``)
    })
}

module.exports.getUnit = function (unitName) {
    return new Promise((resolve, reject) => {

    })
}

module.exports.all = all

module.exports.nonnaval = nonnaval