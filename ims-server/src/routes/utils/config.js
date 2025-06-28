'use strict'

// Declare the database object
const db = {
  username: 'admin', // This is the username for the database
  password: 'Password01', // This is the password for the database
  name: 'ims' // This is the name of the database in MongoDB
}

// Declare the config object
const config = {
  port: 3000, // This is the default port for MongoDB
  dbUrl: `mongodb+srv://${db.username}:${db.password}@bellevueuniversity.7gku3.mongodb.net/${db.name}?retryWrites=true&w=majority`,
  dbname: db.name // This is the name of the database in MongoDB
}

module.exports = config // Expose the config as a module