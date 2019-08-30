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
    maxhp: "Depends on the unit inside",
    vethp: "Depends on the unit inside",
    att: 1,
    def: 1
}

const sh = {
    name: "Ship",
    maxhp: "Depends on the unit inside",
    vethp: "Depends on the unit inside",
    att: 2,
    def: 2
}

const bs = {
    name: "Battleship",
    maxhp: "Depends on the unit inside",
    vethp: "Depends on the unit inside",
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
    //return new Promise((resolve, reject) => {

        unitKeys = Object.keys(all);
        let unitKey = array.filter(value => unitKeys.includes(value.substring(0,2)))
        if(unitKey.length === 0)
            throw `We couldn't find one of the units.\n*REQUIRED: You need to type at least two characters of the unit.*\n\nYou can get the list is available with \`${prefix}units\``
        unitKey = unitKey[0].substring(0,2);
        if(!nonnaval.hasOwnProperty(unitKey))
            throw `For naval units, make sure you include which unit is in.\n   Long ex: \`${prefix}calc warrior boat vet, warrior ship\`\n   Short ex: \`${prefix}calc wa bo v, wa sh\``
        unitKey = unitKey.toString().substring(0,2)
        unit = Object.assign({},nonnaval[unitKey])

        if(array.some(x => x.startsWith("bo"))) {
            if(unit.name.toLowerCase() === "navalon" || unit.name.toLowerCase() === "tridention" || unit.name.toLowerCase() === "crab" || unit.name.toLowerCase() === "baby dragon" || unit.name.toLowerCase() === "fire dragon" || unit.name.toLowerCase() === "navalon" || unit.name.toLowerCase() === "battle sled" || unit.name.toLowerCase() === "ice fortress") {
                throw `This ${unit.name.toLowerCase()} can't go in a naval unit`
            } else {
                unit.name = unit.name + " Boat";
                unit.att = bo.att;
                unit.def = bo.def;
            }
        } else if(array.some(x => x.startsWith("sh"))) {
            if(unit.name.toLowerCase() === "navalon" || unit.name.toLowerCase() === "tridention" || unit.name.toLowerCase() === "crab" || unit.name.toLowerCase() === "baby dragon" || unit.name.toLowerCase() === "fire dragon" || unit.name.toLowerCase() === "navalon" || unit.name.toLowerCase() === "battle sled" || unit.name.toLowerCase() === "ice fortress") {
                throw `This ${unit.name.toLowerCase()} can't go in a naval unit`
            } else {
                unit.name = unit.name + " Ship";
                unit.att = sh.att;
                unit.def = sh.def;
            }
        } else if(array.some(x => (x.startsWith("ba") || x.startsWith("bs")))) {
            if(unit.name.toLowerCase() === "navalon" || unit.name.toLowerCase() === "tridention" || unit.name.toLowerCase() === "crab" || unit.name.toLowerCase() === "baby dragon" || unit.name.toLowerCase() === "fire dragon" || unit.name.toLowerCase() === "navalon" || unit.name.toLowerCase() === "battle sled" || unit.name.toLowerCase() === "ice fortress") {
                throw `This ${unit.name.toLowerCase()} can't go in a naval unit`
            } else {
                unit.name = unit.name + " Battleship";
                unit.att = bs.att;
                unit.def = bs.def;
            }
        }
        return unit
}

module.exports.getUnit = function (unitPartial) {
    const all = { wa, ri, ar, de, kn, sw, ca, gi, cr, tr, po, na, ga, mb, bd, dr, mo, sl, ic, bo, sh, bs }

    unitKeys = Object.keys(all);
    let unitKey = unitPartial.substring(0,2)
    return all[unitKey]
}

module.exports.getUnits = function () {
    return all
}

module.exports.getMaxHP = function (array, unit) {
    if (array.some(x => x.startsWith('v'))) {
        return unit.vethp;
    }
    else {
        return unit.maxhp;
    }
}

module.exports.getCurrentHP = function (array, maxhp, message) {
    if (array.some(x => !isNaN(Number(x)))) {
        index = array.findIndex(x => !isNaN(Number(x)));
        currenthp = parseInt(array[index]);
        if (currenthp > maxhp) {
            message.channel.send(`You have inputed a current hp higher than the max hp.\nYou can add a \`v\` (if you haven't already) to get a veteran max hp.\nIn the meantime, this result calculates with the max hp as current hp.`);
            return maxhp;
        }
        else if (currenthp < 1) {
            message.channel.send(`One of the units is already dead. RIP.`);
            return undefined;
        }
        else
            return currenthp;
    }
    else {
        return maxhp;
    }
}

module.exports.getBonus = function (array, unit) {
    if (array.some(x => x === 'w') && array.some(x => x === 'd'))
        return "You've put both `d` and `w`. By default, it'll take `w` over `d` if it's present.";
    if (array.some(x => x === 'w')) {
        return [4,  " (walled)"];
    }
    else if (array.some(x => x === 'd')) {
        return [1.5, " (protected)"];
    }
    else {
        return [1, " "];
    }
}

module.exports.getRetaliation = function (array) {
    if (array.some(x => x === 'nr'))
        return false;
    else
        return true;
}