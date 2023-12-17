module.exports = function buildMakeUnit ({ unitsList, handleAliases }) {
    return function makeUnit ({
        name = 'Default Warrior',
        plural = 'Default Warriors',
        description = '',
        currenthp = 10,
        maxhp = 10,
        vet = true,
        vetNow = false,
        att = 2,
        def = 2,
        bonus = 1,
        fort = true,
        range = false,
        retaliation = true,
        poisonattack = false,
        poisonexplosion = false,
        canExplode = false,
        exploding = false,
        freeze = false,
        convert = false,
        converted = false,
        splash = false,
        final = false
    } = {}) {
        return Object.freeze({
            name: 'Default Warrior',
            plural: 'Default Warriors',
            description: '',
            currenthp: currenthp,
            maxhp: maxhp,
            vet: vet,
            vetNow: vetNow,
            toVeteran: () => { vet = true},
            att: att,
            def: def,
            bonus: bonus,
            fort: fort,
            range: range,
            retaliation: retaliation,
            poisonattack: poisonattack,
            poisonexplosion: poisonexplosion,
            canExplode: canExplode,
            exploding: exploding,
            toExplode: () => { exploding = true },
            freeze: freeze,
            convert: convert,
            converted: converted,
            toConvert: () => { converted = true },
            splash: splash,
            final: final
          })
    }
}

function addBonus(bonusArray, replyData) {
let defenseBonus = bonusArray.filter(value => value.toLowerCase() === 'w' || value.toLowerCase() === 'd' || value.toLowerCase() === 'p')
defenseBonus = [...new Set(defenseBonus)] // Deletes doubles

if (defenseBonus.length >= 2) {
    replyData.content.push(['You\'ve provided more than one bonus\nBy default, I take `w` over `d` if both are present.', {}])
    replyData.deleteContent = true
    if (defenseBonus.some(x => x.toLowerCase() === 'w') && this.fort === true)
    this.bonus = 4
    else
    this.bonus = 1.5
} else {
    if (defenseBonus[0].toLowerCase() === 'd' || defenseBonus[0].toLowerCase() === 'p')
    this.bonus = 1.5
    else if (defenseBonus[0].toLowerCase() === 'w' && this.fort === true)
    this.bonus = 4
    else
    this.bonus = 1
}
}

// Raft a:0 d:1
// Bomber a:4 d:2
// Rammer a:3 d:3
// Scout a:2 d:1
// Juggernaut a:4 d:4

function onTheWater(navalArray) {
if (this.bonus === 4)
    throw 'Are you saying a naval unit can be in a city :thinking:...'

if (navalArray[0].toLowerCase().startsWith('rf')) {
    this.description = this.description + ' Raft'
    this.att = 0
    this.def = 1
    this.retaliation = false
}
if (navalArray[0].toLowerCase().startsWith('sc')) {
    this.description = this.description + ' Scout'
    this.att = 2
    this.def = 1
    this.range = true
}
if (navalArray[0].toLowerCase().startsWith('rm')) {
    this.description = this.description + ' Rammer'
    this.att = 3
    this.def = 3
    this.range = false
}
if (navalArray[0].toLowerCase().startsWith('bo')) {
    this.description = this.description + ' Bomber'
    this.att = 4
    this.def = 2
    this.retaliation = false
    this.range = true
    this.splash = undefined
}
if (navalArray[0].toLowerCase().startsWith('ob')) {
    this.description = this.description + ' (Old) Boat'
    this.att = 1
    this.def = 1
    this.range = true
}
if (navalArray[0].toLowerCase().startsWith('oh')) {
    this.description = this.description + ' (Old) Ship'
    this.att = 2
    this.def = 2
    this.range = true
}
if (navalArray[0].toLowerCase().startsWith('os')) {
    this.description = this.description + ' (Old) Battleship'
    this.att = 4
    this.def = 3
    this.range = true
}
}

// Get override and exploding
function getOverride(string, replyData) {
const overrides = string.filter(x => x === 'r' || x === 'nr')
const exploding = string.filter(x => x === 'x')

if (overrides.length > 1)
    throw `Put your beer down and learn to type.\nYou can't put both \`r\` **and** \`nr\` for the ${this.currenthp}hp ${this.name}${this.description}...`
else if (overrides.length === 1) {
    if (overrides[0] === 'r')
    this.forceRetaliation = true
    if (overrides[0] === 'nr')
    this.forceRetaliation = false
}

if (exploding.length > 0 && this.canExplode) {
    this.name = `${this.name} 💥`
    this.plural = `${this.plural} 💥`
    this.exploding = true
}

if (exploding.length > 0 && !this.canExplode)
    replyData.content.push([`${this.plural} can't explode, so I calculated it as a direct attack:`, {}])
}