    const Certificate = require('../models/Certificate');
    const StudentProfile = require('../models/StudentProfile');
    const multer = require('multer'); // Import multer
    const path = require('path');     // Import path
    const fs = require('fs');         // Import fs

    // Helper function to get studentProfileId from userId
    const getStudentProfileId = async (userId) => {
        const studentProfile = await StudentProfile.findOne({ where: { userId } });
        if (!studentProfile) {
            return null;
        }
        return studentProfile.id;
    };

    // --- Multer Configuration for Certifications ---
    const uploadsDir = path.join(__dirname, '../uploads'); // Re-use the existing uploads directory

    // Configure Multer storage
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadsDir);
        },
        filename: function (req, file, cb) {
            // Use 'certificate' as fieldname prefix for clarity
            cb(null, 'certificate-' + Date.now() + path.extname(file.originalname));
        }
    });

    // Filter for common document/image types for certificates
    const fileFilter = (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/; // Allow images and PDFs
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, JPG, PNG, or PDF files are allowed for certificates!'), false);
        }
    };

    // Initialize Multer upload middleware for a single file named 'certificate_file'
    const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 1024 * 1024 * 10 // 10MB file size limit for certificates
        }
    }).single('certificate_file'); // The expected field name for the file in form-data

    // Export the Multer middleware so it can be used in routes
    exports.uploadCertificateFile = (req, res, next) => {
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ success: false, message: err.message });
            } else if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            next(); // Proceed to the next middleware/controller if no error
        });
    };

    // @desc    Add a new certification for the logged-in student
    // @route   POST /api/students/profile/certifications
    // @access  Private (Student only)
    exports.createCertification = async (req, res) => {
        // Data from req.body (text fields) and req.file (file upload)
        const { name, given_by, description, date } = req.body;
        const file_url = req.file ? `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}` : null;

        try {
            const studentId = await getStudentProfileId(req.user.id);
            if (!studentId) {
                return res.status(404).json({ msg: 'Student profile not found.' });
            }

            const newCertificate = await Certificate.create({
                name,
                given_by,
                description,
                date,
                file_url, // Save the file URL
                studentId
            });

            res.status(201).json({ success: true, message: 'Certification added successfully', certificate: newCertificate });
        } catch (err) {
            console.error(err.message);
            // If there was an uploaded file and an error occurred, delete the file
            if (req.file) {
                fs.unlink(req.file.path, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
                });
            }
            res.status(500).send('Server Error');
        }
    };

    // @desc    Get all certifications for the logged-in student
    // @route   GET /api/students/profile/certifications
    // @access  Private (Student only)
    exports.getCertifications = async (req, res) => {
        try {
            const studentId = await getStudentProfileId(req.user.id);
            if (!studentId) {
                return res.status(404).json({ msg: 'Student profile not found.' });
            }

            const certifications = await Certificate.findAll({
                where: { studentId },
                order: [['date', 'DESC']]
            });

            res.json({ success: true, certifications });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    };

    // @desc    Update a specific certification for the logged-in student
    // @route   PUT /api/students/profile/certifications/:certId
    // @access  Private (Student only, owner of the cert)
    exports.updateCertification = async (req, res) => {
        // Data from req.body (text fields) and req.file (file upload)
        const { name, given_by, description, date } = req.body;
        const certId = req.params.certId;
        let new_file_url = req.file ? `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}` : undefined; // Use undefined if no new file

        try {
            const studentId = await getStudentProfileId(req.user.id);
            if (!studentId) {
                return res.status(404).json({ msg: 'Student profile not found.' });
            }

            let certificate = await Certificate.findByPk(certId);

            if (!certificate) {
                // If a new file was uploaded for a non-existent cert, delete it
                if (req.file) {
                    fs.unlink(req.file.path, (unlinkErr) => {
                        if (unlinkErr) console.error('Error deleting orphaned uploaded file:', unlinkErr);
                    });
                }
                return res.status(404).json({ msg: 'Certification not found.' });
            }

            // Ensure the certification belongs to the logged-in student
            if (certificate.studentId !== studentId) {
                // If a new file was uploaded for an unauthorized cert, delete it
                if (req.file) {
                    fs.unlink(req.file.path, (unlinkErr) => {
                        if (unlinkErr) console.error('Error deleting unauthorized uploaded file:', unlinkErr);
                    });
                }
                return res.status(403).json({ msg: 'Access denied. This certification does not belong to your profile.' });
            }

            // If a new file is uploaded, and an old file existed, delete the old one
            if (req.file && certificate.file_url) {
                const oldFilePath = path.join(uploadsDir, path.basename(certificate.file_url));
                fs.unlink(oldFilePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting old certificate file:', unlinkErr);
                });
            }

            // Update fields if provided in text body
            certificate.name = name !== undefined ? name : certificate.name;
            certificate.given_by = given_by !== undefined ? given_by : certificate.given_by;
            certificate.description = description !== undefined ? description : certificate.description;
            certificate.date = date !== undefined ? date : certificate.date;
            // Update file_url only if a new file was uploaded
            if (new_file_url !== undefined) {
                certificate.file_url = new_file_url;
            }

            await certificate.save();
            res.json({ success: true, message: 'Certification updated successfully', certificate });
        } catch (err) {
            console.error(err.message);
            // If an error occurred during update, and a new file was uploaded, delete it
            if (req.file) {
                fs.unlink(req.file.path, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting uploaded file on update error:', unlinkErr);
                });
            }
            res.status(500).send('Server Error');
        }
    };

    // @desc    Delete a specific certification for the logged-in student
    // @route   DELETE /api/students/profile/certifications/:certId
    // @access  Private (Student only, owner of the cert)
    exports.deleteCertification = async (req, res) => {
        const certId = req.params.certId;

        try {
            const studentId = await getStudentProfileId(req.user.id);
            if (!studentId) {
                return res.status(404).json({ msg: 'Student profile not found.' });
            }

            const certificate = await Certificate.findByPk(certId);

            if (!certificate) {
                return res.status(404).json({ msg: 'Certification not found.' });
            }

            // Ensure the certification belongs to the logged-in student
            if (certificate.studentId !== studentId) {
                return res.status(403).json({ msg: 'Access denied. This certification does not belong to your profile.' });
            }

            // If there's an associated file, delete it from the uploads directory
            if (certificate.file_url) {
                const filePath = path.join(uploadsDir, path.basename(certificate.file_url));
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting certificate file:', unlinkErr);
                });
            }

            await certificate.destroy();
            res.json({ success: true, message: 'Certification deleted successfully' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    };
    