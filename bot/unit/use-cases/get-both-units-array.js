module.exports = function makeGetBothUnitsArray() {
    return function getBothUnitsArray(args) {
        if (args.includes(',')) return args.split(',');
        else throw 'You need an attacker and a defender separated using `,`';
    };
};
