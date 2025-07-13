const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { uploadFile } = require('../controllers/uploadController');

// This route is protected, ensuring only logged-in users can upload files.
router.post('/', auth, uploadFile);

module.exports = router;