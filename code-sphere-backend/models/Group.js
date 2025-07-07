const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  isProjectGroup: { type: Boolean, default: false },  
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
