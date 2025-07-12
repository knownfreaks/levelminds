const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth'); // For authentication if needed

const router = express.Router();

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); // Store files in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        // Create a unique filename: fieldname-timestamp.ext
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Filter for image files
const fileFilter = (req, file, cb) => {
    // Accept only image mimetypes
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        // If not an image, reject the file with a specific error message
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Initialize Multer upload middleware
// 'image' is the name of the field in the form data that contains the file
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    }
});

// @route   POST /api/upload-image
// @desc    Upload a single image file
// @access  Private (e.g., student or school profile update)
router.post('/', auth, (req, res, next) => {
    // Manually call upload.single and handle its errors
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(400).json({ success: false, message: err.message });
        }
        // Everything went fine with Multer, proceed to the next middleware (our route handler)
        next();
    });
}, (req, res) => {
    // This is the actual route handler after Multer has processed the file
    if (!req.file) {
        // This case should ideally be caught by MulterError, but as a fallback
        return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }
    // Return the URL of the uploaded image
    const imageUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl });
});

module.exports = router;
