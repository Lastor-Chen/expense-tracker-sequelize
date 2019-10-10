// models record.js

// Model setting
// ==============================

const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  merchant: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
})


// export
// ==============================

module.exports = mongoose.model('record', recordSchema)