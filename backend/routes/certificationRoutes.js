    const express = require('express');
    const router = express.Router();
    const auth = require('../middleware/auth'); // Our security middleware
    const {
      createCertification,
      getCertifications,
      updateCertification,
      deleteCertification,
      uploadCertificateFile // <-- IMPORT THIS NEW MIDDLEWARE
    } = require('../controllers/certificationController'); // Import controller functions

    // Middleware to check if user is a student
    const studentOnly = (req, res, next) => {
        if (req.user && req.user.role === 'student') {
            next();
        } else {
            res.status(403).json({ msg: 'Access denied. Students only.' });
        }
    };

    // @route   POST /api/students/profile/certifications
    // @desc    Add a new certification (now accepts file upload)
    // @access  Private (Student only)
    router.post('/', auth, studentOnly, uploadCertificateFile, createCertification); // <-- ADD uploadCertificateFile

    // @route   GET /api/students/profile/certifications
    // @desc    Get all certifications for the logged-in student
    // @access  Private (Student only)
    router.get('/', auth, studentOnly, getCertifications);

    // @route   PUT /api/students/profile/certifications/:certId
    // @desc    Update a specific certification (now accepts file upload)
    // @access  Private (Student only)
    router.put('/:certId', auth, studentOnly, uploadCertificateFile, updateCertification); // <-- ADD uploadCertificateFile

    // @route   DELETE /api/students/profile/certifications/:certId
    // @desc    Delete a specific certification
    // @access  Private (Student only)
    router.delete('/:certId', auth, studentOnly, deleteCertification);

    module.exports = router;
    