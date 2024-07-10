// server/controllers/authController.js

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, password: hashedPassword, email })
    await newUser.save()
    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1h',
    })
    res.json({ token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
