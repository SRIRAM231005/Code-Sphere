const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const codeVersionSchema = new mongoose.Schema({
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  code: String,
  timestamp: { type: Date, default: Date.now },
  comments: [commentSchema]
});

const codeMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  description: String, 
  codeSnippet: String, 
  codeHistory: [codeVersionSchema],
}, { timestamps: true });

module.exports = mongoose.model('CodeMessage', codeMessageSchema);
