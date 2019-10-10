// models/seeds seeder.js

// import package
// =========================

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Record = require('../record.js')
const records = require('./records.json')
const User = require('../user.js')
const users = require('./users.json')


// 生成 user 與 record 假資料
// =========================

const MONGODB_URL = process.env.MONGODB_URI || 'mongodb://localhost/record'

mongoose.connect(MONGODB_URL, 
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'mongoDB connection error.'))

db.once('open', async () => {
  console.log('\033[33m[seeder] mongoDB is connected')
  console.log('[seeder] Data is creating...\033[0m')

  // 生成 user docs，密碼加鹽 Sync
  const salt = bcrypt.genSaltSync(10)
  for (const user of users) {
    const hash = bcrypt.hashSync(user.password, salt)
    user.password = hash

    await User.create(user)
  }

  // 生成 record docs，關聯 userId
  User.find(async (err, users) => {
    if (err) console.error(err)

    // 加入 userId
    const length = records.length
    for (let index = 0; index < length; index++) {
      if (index <= (length / 2) - 1) { records[index].userId = users[0].id }
      else { records[index].userId = users[1].id }
    }

    await Record.create(...records)

    console.log('\033[32m[seeder] Sample docs are created from seeder\033[0m')
    process.exit()
  })
})