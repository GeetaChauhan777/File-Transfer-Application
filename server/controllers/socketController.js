// server/controllers/socketController.js

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id)
    })

    socket.on('sendFile', (data) => {
      // Handle file transfer logic
      console.log('File received:', data)
      // Implement file transfer logic here
    })
  })
}
