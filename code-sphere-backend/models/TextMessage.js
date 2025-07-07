const mongoose = require('mongoose');

const textMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('TextMessage', textMessageSchema);
