const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000 // Fail after 5 seconds if not connected
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const { handleChat } = require('./services/chatService');

// Health Check
app.get('/', (req, res) => {
  res.send('Veterinary Chatbot API is running');
});

// Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    const result = await handleChat(sessionId || Date.now().toString(), message);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
