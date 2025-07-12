const express = require('express');
     const router = express.Router();
     const auth = require('../middleware/auth');
     const { getProfile, updateProfile } = require('../controllers/profileController');

     router.route('/')
       .get(auth, getProfile)
       .put(auth, updateProfile);

     module.exports = router;