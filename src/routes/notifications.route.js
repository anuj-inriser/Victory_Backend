const express = require('express');
const { getAllNotifications, getNotificationById, createNotification, updateNotification, deleteNotification } = require('../controllers/notifications.controller');
const router = express.Router();


router.get('/', getAllNotifications);
router.get('/:id', getNotificationById);
router.post('/', createNotification);
router.put('/:id', updateNotification);
router.delete('/:id', deleteNotification);

module.exports =router