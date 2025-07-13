const { Notification } = require('../models');

const createNotification = async (userId, message, link = null) => {
  try {
    await Notification.create({
      userId,
      message,
      link,
    });
  } catch (error) {
    console.error(`Failed to create notification for user ${userId}:`, error);
  }
};

module.exports = { createNotification };