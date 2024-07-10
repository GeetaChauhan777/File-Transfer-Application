// server/routes/fileRoutes.js

const express = require('express')
const router = express.Router()
const fileController = require('../controllers/fileController')

// POST /api/files/upload
router.post('/upload', fileController.uploadFile)

module.exports = router
