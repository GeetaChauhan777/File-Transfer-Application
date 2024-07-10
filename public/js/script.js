document.addEventListener('DOMContentLoaded', function () {
  // Socket.io initialization
  const socket = io()

  // DOM elements
  const fileInput = document.getElementById('fileInput')
  const uploadButton = document.querySelector('.upload-btn')
  const uploadProgress = document.getElementById('uploadProgress')
  const progressBar = document.querySelector('.progress-bar')
  const progressText = document.querySelector('.progress-text')
  const notificationSuccess = document.querySelector('.notification.success')
  const notificationError = document.querySelector('.notification.error')
  const closeSuccessBtn = document.querySelector(
    '.notification.success .close-btn'
  )
  const closeErrorBtn = document.querySelector('.notification.error .close-btn')
  const pauseBtn = document.querySelector('.pause-btn')
  const resumeBtn = document.querySelector('.resume-btn')
  const cancelBtn = document.querySelector('.cancel-btn')
  const ongoingCount = document.getElementById('ongoingCount')
  const completedCount = document.getElementById('completedCount')
  const pendingCount = document.getElementById('pendingCount')
  const fileNameSpan = document.getElementById('fileName')
  const fileSizeSpan = document.getElementById('fileSize')

  let files = []
  let fileIndex = 0
  let paused = false

  // Event listeners
  fileInput.addEventListener('change', handleFileSelect)
  uploadButton.addEventListener('click', handleUpload)
  closeSuccessBtn.addEventListener('click', closeNotification)
  closeErrorBtn.addEventListener('click', closeNotification)
  pauseBtn.addEventListener('click', pauseUpload)
  resumeBtn.addEventListener('click', resumeUpload)
  cancelBtn.addEventListener('click', cancelUpload)

  // Function to handle file selection
  function handleFileSelect(event) {
    files = event.target.files
    if (files.length > 0) {
      const { name, size } = files[fileIndex]
      fileNameSpan.textContent = name
      fileSizeSpan.textContent = `${(size / (1024 * 1024)).toFixed(2)} MB`
    }
  }

  // Function to handle file upload
  function handleUpload() {
    if (files.length === 0) {
      alert('Please select a file to upload.')
      return
    }

    const file = files[fileIndex]
    const formData = new FormData()
    formData.append('file', file)

    // Simulate uploading progress
    simulateUploadProgress()

    // Update UI for ongoing transfer
    ongoingCount.textContent = parseInt(ongoingCount.textContent) + 1

    // Emit socket event for file upload
    socket.emit('uploadFile', formData)

    // Reset file input
    fileInput.value = ''
    files = []
    fileIndex = 0
  }

  // Function to simulate upload progress
  function simulateUploadProgress() {
    let progress = 0
    const interval = setInterval(() => {
      if (paused) return
      progress += Math.random() * 10
      progressBar.style.width = `${progress}%`
      progressText.textContent = `${progress.toFixed(0)}%`

      if (progress >= 100) {
        clearInterval(interval)
        progressBar.style.width = '0%'
        progressText.textContent = '0%'
        // Update UI for completed transfer
        ongoingCount.textContent = parseInt(ongoingCount.textContent) - 1
        completedCount.textContent = parseInt(completedCount.textContent) + 1
        // Show success notification
        notificationSuccess.style.display = 'block'
        setTimeout(() => {
          notificationSuccess.style.display = 'none'
        }, 3000)
      }
    }, 500)
  }

  // Function to handle pause upload
  function pauseUpload() {
    paused = true
    pauseBtn.disabled = true
    resumeBtn.disabled = false
  }

  // Function to handle resume upload
  function resumeUpload() {
    paused = false
    pauseBtn.disabled = false
    resumeBtn.disabled = true
  }

  // Function to handle cancel upload
  function cancelUpload() {
    paused = false
    progressBar.style.width = '0%'
    progressText.textContent = '0%'
    ongoingCount.textContent = parseInt(ongoingCount.textContent) - 1
    // Show error notification
    notificationError.style.display = 'block'
    setTimeout(() => {
      notificationError.style.display = 'none'
    }, 3000)
  }

  // Function to close notifications
  function closeNotification(event) {
    event.target.parentNode.style.display = 'none'
  }
})
