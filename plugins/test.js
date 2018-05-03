const { R, S } = require('../utils')

const { words } = S

const ircFirstWord = m => m[3].slice(1).split(/\s+/)[0]
const toChannel = (channel, message) => `PRIVMSG ${channel} :${message}`
const actChannel = (channel, message) => toChannel(channel, `\x01ACTION ${message}\x01`)

module.exports = messages$ =>
  messages$
    .map(x => words(x))
    .filter(m => ['hello', 'pingme'].filter(cmd => ircFirstWord(m) === `.${cmd}`))
    .map(m => {
      const userNick = m[0].split('!')[0].slice(1)
      return R.cond([
        [R.equals('.hello'), () => toChannel(m[2], `hello ${userNick}`)],
        [R.equals('.pingme'), () => actChannel(m[2], `pings ${userNick}`)],
      ])(ircFirstWord(m))
    })
    .filter(Boolean)
