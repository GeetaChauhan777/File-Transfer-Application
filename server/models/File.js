// server/models/File.js

const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('File', fileSchema)
