// server/server.js

const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const PORT = process.env.PORT || 3000
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/myDatabase'

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
  console.log('MongoDB connected')
})

// Define Schema and Model for Transfers
const transferSchema = new mongoose.Schema({
  fileName: String,
  fileSize: Number,
  status: String,
  createdAt: { type: Date, default: Date.now },
})

const Transfer = mongoose.model('Transfer', transferSchema)

// Multer Configuration for File Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads')
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath)
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const upload = multer({ storage: storage })

// Express Routes
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post('/upload', upload.array('files'), async (req, res) => {
  try {
    const files = req.files
    if (!files) {
      return res.status(400).send('No files were uploaded.')
    }

    // Save transfer details to MongoDB
    const promises = files.map(async (file) => {
      const newTransfer = new Transfer({
        fileName: file.originalname,
        fileSize: file.size,
        status: 'Pending', // Example status
      })
      await newTransfer.save()
    })

    await Promise.all(promises)

    res.status(200).send('Files uploaded successfully.')
  } catch (error) {
    console.error('Error uploading files:', error)
    res.status(500).send('Error uploading files.')
  }
})

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)

  // Example: Emitting data to client
  socket.emit('message', 'Hello from server!')
})

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
