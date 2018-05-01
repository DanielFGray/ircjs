const R = require('ramda')
const Sanctuary = require('sanctuary')
const { env: flutureEnv } = require('fluture-sanctuary-types')
const IO = require('fluture')

const nodeEnv = process.env.NODE_ENV || 'development'
const checkTypes = nodeEnv === 'development'
const env = Sanctuary.env.concat(flutureEnv)

const S = Sanctuary.create({ checkTypes, env })

module.exports = {
  S,
  R,
  IO,
}
