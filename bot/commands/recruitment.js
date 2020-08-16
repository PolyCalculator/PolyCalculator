const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
  name: 'recruitment',
  description: 'Crawfish stats csv.',
  aliases: ['recruit', 'ul'],
  shortUsage(prefix) {
    return `${prefix}ul`
  },
  longUsage(prefix) {
    return `${prefix}recruitment`
  },
  forceNoDelete: true,
  category: 'hidden',
  permsAllowed: ['MANAGE_GUILD', 'ADMINISTRATOR'],
  usersAllowed: ['217385992837922819', '246540371847413760'],
  // eslint-disable-next-line no-unused-vars
  execute: function(message, argsStr, embed) {
    const threeServers = message.client.guilds.cache.filter(x => x.id === '447883341463814144' || x.id === '492753802450173987' || x.id === '283436219780825088')
    threeServers.sort()
    // console.log('threeServers', threeServers)
    const polyChampions = threeServers.get('447883341463814144')

    const crawfish = polyChampions.members.cache.filter(x => x.roles.cache.has('572069751992483840'))

    // const now = Date.now()
    // console.log(now.toDateString())
    const csvWriter = createCsvWriter({
      path: './csv/updated.csv',
      header: [
        { id: 'username', title: 'username' },
        { id: 'registered', title: 'registered' },
        { id: 'joinedPolytopia', title: 'joinedPolytopia' },
        { id: 'rolesPolytopia', title: 'rolesPolytopia' },
        { id: 'joinedPolyChampions', title: 'joinedPolyChampions' },
        { id: 'rolesPolyChampions', title: 'rolesPolyChampions' },
        { id: 'joinedCrawfish', title: 'joinedCrawfish' },
        { id: 'rolesCrawfish', title: 'rolesCrawfish' },
      ]
    });

    const result = []
    let member = {}
    crawfish.forEach(x => {
      member = {}
      member.username = x.user.username
      member.registered = x.user.createdAt.toDateString()

      threeServers.forEach(y => {
        const roles = 'roles' + y.name
        const joined = 'joined' + y.name
        const thisMember = y.member(x.user)
        if(thisMember) {
          member[joined] = thisMember.joinedAt.toDateString()
          member[roles] = []
          if(thisMember.roles.cache.size > 0) {
            thisMember.roles.cache.forEach(z => {
              if(z.name !== '@everyone')
                member[roles].push(z.name)
            })
          }
        } else {
          member[joined] = 'NOT IN'
          member[roles] = 'NOT IN'
        }
        // console.log(member)
      })
      result.push(member)
    })

    csvWriter.writeRecords(result)
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('...CSV made');
      });

    message.channel.send('', { files: ['./csv/updated.csv'] })
    return
  }
};