const express = require('express');
const groupsrouter = express.Router();
const { AllJoinedGroups } = require('../controllers/groupsController');

groupsrouter.route('/AllJoinedGroups').post(AllJoinedGroups);

module.exports = groupsrouter;
