'use strict'

const { MongoClient } = require('mongodb')
const config = require('./config')

const MONGO_URL = config.dbUrl
const DB_NAME = config.dbname

const debug = process.env.DEBUG_MONGO === 'true'

let client = null
let db = null

const mongo = async (operations, next) => {
  try {
    if (!client) {
      if (debug) console.log('Connecting to MongoDB Atlas...', MONGO_URL)
      client = await MongoClient.connect(MONGO_URL, {
      })
      db = client.db(DB_NAME)
      if (debug) console.log('Connected to MongoDB Atlas')
    }

    await operations(db)
    if (debug) console.log('Operation was successful')
  } catch (err) {
    if (debug) console.log('Error connecting to db', err)
    const error = new Error('Error connecting to db ' + err)
    error.status = 500
    next(error)
  }
}

// Gracefully close MongoDB connection on app termination
process.on('SIGINT', async () => {
  if (client) {
    if (debug) console.log('Closing connection to MongoDB Atlas...')
    await client.close()
  }
  process.exit(0)
})

module.exports = { mongo }
