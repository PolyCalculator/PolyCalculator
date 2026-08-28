const { expect, test } = require('@jest/globals')
const { execute } = require('../commands/bulk.js')
const { replyData } = require('./commandUtils.js')

test('/b attackers: wa defender: de', () => {
    const reply = replyData()
    execute({}, 'wa, de', reply, {})
    expect(reply).toEqual({
        content: [],
        deleteContent: false,
        discord: {
            title: "You'll need this many hits from a Warrior to kill the Defender:",
            description: undefined,
            fields: [
                {
                    name: '**Number of Warriors**:',
                    value: '4',
                },
            ],
            footer: undefined,
        },
        outcome: {
            attackers: [
                {
                    name: 'Warrior',
                    currenthp: 10,
                    maxhp: 10,
                },
            ],
            defender: {
                name: 'Defender',
                currenthp: 15,
                maxhp: 15,
            },
            response: 4,
        },
    })
})

test('/b attackers: cl defender: wa — cloak infiltration warning', () => {
    const reply = replyData()
    execute({}, 'cl, wa', reply, {})
    expect(reply.content.length).toBe(1)
    expect(reply.content[0][0]).toContain('infiltrating a city')
    expect(reply.outcome.response).toBe(2)
})
