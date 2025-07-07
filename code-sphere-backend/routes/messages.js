const express = require('express');
const messagesrouter = express.Router();
const { SendAllMessages, AddMessages, AddCodeMessages, AddCodeAndComment, getAllMessages } = require('../controllers/messagesController');

messagesrouter.route('/SendAllMessages').post(SendAllMessages);
messagesrouter.route('/AddMessages').post(AddMessages);
messagesrouter.route('/AddCodeMessages').post(AddCodeMessages);
messagesrouter.route('/AddCodeAndComment').post(AddCodeAndComment);
messagesrouter.route('/getAllMessages').post(getAllMessages);

module.exports = messagesrouter;