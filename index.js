const net = require('net')
const { Observable } = require('rxjs')
const { R, S } = require('./bloat')

const {
  test, is, pipe, lines, words, equals,
} = S
const {
  cond, once, replace, nth,
} = R

const T = () => true
const isString = is(String)
const thread = (x, ...xs) => (typeof x === 'function' ? pipe([x, ...xs]) : pipe(xs, x))
const tap = (...fn) => v => thread(v, ...fn, () => v)
const log = tap(console.log)

const client = net.connect({ host: 'irc.rizon.net', port: '6667' })
client.setEncoding('utf-8')

const nick = 'dysfiguredBot'

const write = thread(tap(x => client.write(`${x}\r\n`)), x => log(`--> ${x}`))

const connection$ = Observable.create(o => {
  client.on('data', x => o.next(x))
  client.on('error', x => o.next(x))
})
  .flatMap(x => cond([
    [isString, thread(replace('\r', ''), lines)],
    [T, thread(log, Array.of)],
  ])(x))
  .filter(Boolean)
  .do(x => log(`<-- ${x}`))
  .publishReplay()
  .refCount()

connection$
  .filter(x => test(/hostname/, x))
  .flatMap(once(() => Observable.of(`NICK ${nick}`, `USER ${nick} a b :${nick}`)))
  .subscribe(write, console.error)

connection$
  .filter(x => thread(x, words, nth(1), equals('001')))
  .mapTo('JOIN #dysfigured')
  .subscribe(write, console.error)

connection$
  .filter(x => test(/^PING/, x))
  .map(s => 'PONG '.concat(s.slice(5)))
  .subscribe(write, console.error)

const processOn = (events, fn) => events.forEach(e => process.on(e, fn))
processOn(['SIGTERM', 'SIGINT', 'exit'], () => {
  write('QUIT Bot terminated')
  process.exit()
})
