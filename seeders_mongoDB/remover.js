// models/seeds remover.js

// import package
// =========================

const mongoose = require('mongoose')
const Record = require('../models/record.js')
const User = require('../models/user.js')


// database 資料歸零
// =========================

const MONGODB_URL = process.env.MONGODB_URI || 'mongodb://localhost/record'

mongoose.connect(MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'mongoDB connection error.'))

db.once('open', async () => {
  console.log('\033[33m[remover] mongoDB is connected')
  console.log('[remover] Data is removing...\033[0m')

  await Record.deleteMany()
  await User.deleteMany()

  console.log('\033[32m[remover] All docs have been cleared\033[0m')
  process.exit()
})