const { expect, test } = require('@jest/globals')
const { execute } = require('../commands/optim.js')
const { replyData } = require('./commandUtils.js')
const deadTexts = require('../util/deadtexts.js')

deadTexts.length = 1
deadTexts[0] = 'DEAD'

test('/o attackers: ca, de, wa defender: de d', () => {
    const reply = replyData()
    execute({}, 'ca, de, wa, de d', reply, {})
    expect(reply).toEqual({
        content: [],
        deleteContent: false,
        discord: {
            title: undefined,
            description: 'This is the order for best outcome:',
            fields: [
                {
                    name: 'Attacker: startHP ➔ endHP (enemyHP)',
                    value: [
                        'Defender: 15 ➔ 4 (**14**)',
                        'Catapult: 10 ➔ 10 (**5**)',
                        'Warrior: 10 ➔ 10 (**0**)',
                    ],
                },
                {
                    name: '**Defender (protected)**:',
                    value: '15 ➔ DEAD',
                },
            ],
            footer: undefined,
        },
        outcome: {
            attackers: [
                {
                    name: 'Defender',
                    afterhp: 4,
                    beforehp: 15,
                    hpdefender: 14,
                    hplost: 11,
                    maxhp: 15,
                },
                {
                    name: 'Catapult',
                    afterhp: 10,
                    beforehp: 10,
                    hpdefender: 5,
                    hplost: 0,
                    maxhp: 10,
                },
                {
                    name: 'Warrior',
                    afterhp: 10,
                    beforehp: 10,
                    hpdefender: 0,
                    hplost: 0,
                    maxhp: 10,
                },
            ],
            defender: {
                name: 'Defender (protected)',
                afterhp: 0,
                currenthp: 15,
                hplost: 15,
                maxhp: 15,
            },
        },
    })
})

test('/o attackers: ca f, de, wa defender: de d', () => {
    const reply = replyData()
    execute({}, 'ca f, de, wa, de d', reply, {})
    expect(reply).toEqual({
        content: [],
        deleteContent: false,
        discord: {
            title: undefined,
            description: 'This is the order for best outcome:',
            fields: [
                {
                    name: 'Attacker: startHP ➔ endHP (enemyHP)',
                    value: [
                        'Defender: 15 ➔ 4 (**14**)',
                        'Warrior: 10 ➔ 1 (**11**)',
                        'Catapult: 10 ➔ 10 (**1**)',
                    ],
                },
                {
                    name: '**Defender (protected)**:',
                    value: '15 ➔ 1',
                },
            ],
            footer: undefined,
        },
        outcome: {
            attackers: [
                {
                    name: 'Defender',
                    afterhp: 4,
                    beforehp: 15,
                    hpdefender: 14,
                    hplost: 11,
                    maxhp: 15,
                },
                {
                    name: 'Warrior',
                    afterhp: 1,
                    beforehp: 10,
                    hpdefender: 11,
                    hplost: 9,
                    maxhp: 10,
                },
                {
                    name: 'Catapult',
                    afterhp: 10,
                    beforehp: 10,
                    hpdefender: 1,
                    hplost: 0,
                    maxhp: 10,
                },
            ],
            defender: {
                name: 'Defender (protected)',
                afterhp: 1,
                currenthp: 15,
                hplost: 14,
                maxhp: 15,
            },
        },
    })
})
