// models user.js

// Model setting
// ==============================

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

// export
// ==============================

module.exports = mongoose.model('User', userSchema)