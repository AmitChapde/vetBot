const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'bot'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const SessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  messages: [MessageSchema],
  context: {
    userId: String,
    userName: String,
    petName: String,
    source: String,
  },
  bookingState: { 
    type: String, 
    enum: ['IDLE', 'ASKING_NAME', 'ASKING_PET', 'ASKING_PHONE', 'ASKING_DATE', 'CONFIRMING'], 
    default: 'IDLE' 
  },
  bookingData: {
    ownerName: String,
    petName: String,
    phoneNumber: String,
    date: String,
    time: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Session', SessionSchema);
