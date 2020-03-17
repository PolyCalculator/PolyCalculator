const fight = require('../util/fightEngine')
const units = require('./units')

module.exports = {
  name: 'bulk',
  description: 'calculate the number of attackers needed to kill the defender.',
  aliases: ['b'],
  shortUsage(prefix) {
    return `${prefix}b wa, de d`
  },
  longUsage(prefix) {
    return `${prefix}bulk warrior, defender d`
  },
  category: 'Advanced',
  permsAllowed: ['VIEW_CHANNEL'],
  usersAllowed: ['217385992837922819'],
  execute(message, argsStr, embed) {
    if(argsStr.length === 0)
      throw 'try `.help b` for more information on how to use this command!'


    message.channel.send(result.bulk())
      .then(x => {
        if(!botChannel.some(y => y === message.channel.id)) {
          x.delete(60000)
            .then()
            .catch(console.error)
          message.delete(60000)
            .then(() => {
              logChannel.send(`Message deleted in ${message.channel.name} after 1 min`)
              console.log(`Message deleted in ${message.channel.name} after 1 min`)
            })
            .catch(console.error)
        }
      })
      .catch(console.error)
  },
};