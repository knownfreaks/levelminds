const express = require('express');
     const router = express.Router();
     const auth = require('../middleware/auth');
     const {
       createCertification,
       getCertifications,
       updateCertification,
       deleteCertification,
       uploadCertificateFile
     } = require('../controllers/certificationController');

     const studentOnly = (req, res, next) => {
         if (req.user && req.user.role === 'student') {
             next();
         } else {
             res.status(403).json({ msg: 'Access denied. Students only.' });
         }
     };

     router.post('/', auth, studentOnly, uploadCertificateFile, createCertification);
     router.get('/', auth, studentOnly, getCertifications);
     router.put('/:certId', auth, studentOnly, uploadCertificateFile, updateCertification);
     router.delete('/:certId', auth, studentOnly, deleteCertification);

     module.exports = router;