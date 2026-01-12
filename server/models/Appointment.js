const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  ownerName: { type: String, required: true },
  petName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'confirmed' }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
