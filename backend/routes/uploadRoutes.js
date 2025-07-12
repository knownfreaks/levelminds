const express = require('express');
     const multer = require('multer');
     const path = require('path');
     const fs = require('fs');
     const auth = require('../middleware/auth');

     const router = express.Router();

     const uploadsDir = path.join(__dirname, '../uploads');
     if (!fs.existsSync(uploadsDir)) {
         fs.mkdirSync(uploadsDir);
     }

     const storage = multer.diskStorage({
         destination: function (req, file, cb) {
             cb(null, uploadsDir);
         },
         filename: function (req, file, cb) {
             cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
         }
     });

     const fileFilter = (req, file, cb) => {
         if (file.mimetype.startsWith('image/')) {
             cb(null, true);
         } else {
             cb(new Error('Only image files are allowed!'), false);
         }
     };

     const upload = multer({
         storage: storage,
         fileFilter: fileFilter,
         limits: {
             fileSize: 1024 * 1024 * 5
         }
     }).single('image');

     router.post('/', auth, (req, res, next) => {
         upload(req, res, (err) => {
             if (err instanceof multer.MulterError) {
                 return res.status(400).json({ success: false, message: err.message });
             } else if (err) {
                 return res.status(400).json({ success: false, message: err.message });
             }
             next();
         });
     }, (req, res) => {
         if (!req.file) {
             return res.status(400).json({ success: false, message: 'No image file uploaded.' });
         }
         const imageUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`;
         res.json({ success: true, imageUrl });
     });

     module.exports = router;
     