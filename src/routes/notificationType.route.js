const express = require('express');
const { getAllNotificationTypes } = require('../controllers/notificationType.controller');
const router = express.Router();

router.get('/', getAllNotificationTypes);

module.exports = router