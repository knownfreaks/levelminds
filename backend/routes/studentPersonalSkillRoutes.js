const express = require('express');
     const router = express.Router();
     const auth = require('../middleware/auth');
     const {
       createPersonalSkill,
       getPersonalSkills,
       updatePersonalSkill,
       deletePersonalSkill
     } = require('../controllers/studentPersonalSkillController');

     const studentOnly = (req, res, next) => {
         if (req.user && req.user.role === 'student') {
             next();
         } else {
             res.status(403).json({ msg: 'Access denied. Students only.' });
         }
     };

     router.post('/', auth, studentOnly, createPersonalSkill);
     router.get('/', auth, studentOnly, getPersonalSkills);
     router.put('/:skillId', auth, studentOnly, updatePersonalSkill);
     router.delete('/:skillId', auth, studentOnly, deletePersonalSkill);

     module.exports = router;