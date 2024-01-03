const { expect, test } = require('@jest/globals');
const { execute } = require('../commands/elim.js');
const { replyData } = require('./commandUtils.js');

test('/e gi 32, de w ?', () => {
    const reply = replyData();
    execute({}, 'gi 32, de w ?', reply, {});
    expect(reply).toEqual({
        content: [],
        deleteContent: false,
        discord: {
            title: 'A 32hp Giant will kill a defending:',
            description: undefined,
            fields: [
                {
                    name: '**Defender (walled)**:',
                    value: 'Max: 8hp',
                },
            ],
            footer: undefined,
        },
        outcome: {
            attackers: [
                {
                    name: 'Giant',
                    maxhp: 40,
                },
            ],
            defender: {
                name: 'Defender (walled)',
                currenthp: 8,
                maxhp: 15,
            },
            response: 8,
        },
    });
});
