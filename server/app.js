// server/app.js

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const fileUpload = require('express-fileupload')
const socketio = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())

// Routes
const authRoutes = require('./routes/authRoutes')
const fileRoutes = require('./routes/fileRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/files', fileRoutes)

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, '../public')))

// Socket.io connection
require('./controllers/socketController')(io)

module.exports = server
