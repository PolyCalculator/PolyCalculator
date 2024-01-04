module.exports = {
    name: 'links',
    description:
        "show the link to invite the bot and to the developer's server.",
    aliases: ['link', 'inv', 'invite', 'server'],
    shortUsage(prefix) {
        return `${prefix}inv`
    },
    longUsage(prefix) {
        return `${prefix}link`
    },
    category: 'Other',
    permsAllowed: ['VIEW_CHANNEL'],
    usersAllowed: ['217385992837922819'],
    execute: function (message, argsStr, replyData /*, dbData*/) {
        replyData.discord.title = 'Links!'
        replyData.discord.fields.push({
            name: 'Invite this bot to your server:',
            value: 'https://discord.com/oauth2/authorize?client_id=593507058905645057&scope=bot%20applications.commands&permissions=2147576904',
        })
        replyData.discord.fields.push({
            name: "PolyCalculator's server link:",
            value: 'https://discord.gg/rtSTmd8',
        })
        // replyData.discord.fields.push({ name: 'Documentation (How-to use the bot):', value: 'https://docs.polycalculatorbot.com/' })
        // replyData.discord.fields.push({ name: 'Web bot (only `.calc`):', value: 'https://cli.polycalculatorbot.com' })

        return replyData
    },
}
