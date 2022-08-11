const Discord = require('discord.js')

// your bot token
const token = 'NzM4MDk2NjA4NDQwNDgzODcw.XyG8CA.RbwIBFnAbrRDYOlTdLYgG_T4CMk'
const discordUsername = 'example#1234'
const roleToAdd = 'Cool Person'
const guildName = 'Your Guild Name'

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}
async function go() {
  const client = new Discord.Client()
  const clientReadyDeferred = deferred()

  client.on('ready', error => {
    if (error) {
      clientReadyDeferred.reject(error)
    } else {
      clientReadyDeferred.resolve()
    }
  })

  client.login(token)

  await clientReadyDeferred.promise

  const guild = client.guilds.cache.find(({name}) => name === guildName)

  const role = guild.roles.cache.find(({name}) => name === roleToAdd)
  const member = guild.members.cache.find(
    ({user: {username, discriminator}}) =>
      `${username}#${discriminator}` === discordUsername,
  )

  member.roles.add(role)
}

go()
