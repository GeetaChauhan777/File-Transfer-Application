// server/controllers/fileController.js

const File = require('../models/File')

exports.uploadFile = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files were uploaded' })
    }

    const { file } = req.files
    const newFile = new File({
      filename: file.name,
      size: file.size,
      path: `/uploads/${file.name}`,
    })

    await file.mv(`./public/uploads/${file.name}`)
    await newFile.save()

    res.status(201).json({ message: 'File uploaded successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
