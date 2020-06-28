const whatIsGooch = ['He pretty chill', 'He my homeboy', 'He my fav Polytopia Moderator', 'He my UKanian', 'He englishman', 'He da man']

module.exports = {
  name: 'Goochie',
  description: 'show fax.',
  aliases: ['goochie', 'gooch'],
  shortUsage() {
    return `${process.env.PREFIX}Goochie`
  },
  longUsage() {
    return `${process.env.PREFIX}gooch`
  },
  forceNoDelete: false,
  category: 'hidden',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  // eslint-disable-next-line no-unused-vars
  execute: function(message, argsStr, embed, trashEmoji, data) {
    return whatIsGooch[Math.floor(Math.random() * whatIsGooch.length)]
  },
};