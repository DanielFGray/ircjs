const R = require('ramda')
const Sanctuary = require('sanctuary')

const nodeEnv = process.env.NODE_ENV || 'development'
const checkTypes = nodeEnv === 'development'
const env = Sanctuary.env

const S = Sanctuary.create({ checkTypes, env })

module.exports = {
  S,
  R,
}
