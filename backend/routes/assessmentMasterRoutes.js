const express = require('express');
     const router = express.Router();
     const auth = require('../middleware/auth');
     const {
       createAssessmentSkillCategory,
       getAssessmentSkillCategories,
       updateAssessmentSkillCategory,
       deleteAssessmentSkillCategory,
       createAssessmentSkill,
       getAssessmentSkills,
       updateAssessmentSkill,
       deleteAssessmentSkill,
       createAssessmentSubSkill,
       getAssessmentSubSkills,
       updateAssessmentSubSkill,
       deleteAssessmentSubSkill,
       submitStudentSkillAssessment
     } = require('../controllers/assessmentMasterController');

     const adminOnly = (req, res, next) => {
         if (req.user && req.user.role === 'admin') {
             next();
         } else {
             res.status(403).json({ msg: 'Access denied. Admins only.' });
         }
     };

     // Assessment Skill Category Routes
     router.post('/assessment-skill-categories', auth, adminOnly, createAssessmentSkillCategory);
     router.get('/assessment-skill-categories', auth, adminOnly, getAssessmentSkillCategories);
     router.put('/assessment-skill-categories/:id', auth, adminOnly, updateAssessmentSkillCategory);
     router.delete('/assessment-skill-categories/:id', auth, adminOnly, deleteAssessmentSkillCategory);

     // Assessment Skill Routes
     router.post('/assessment-skills', auth, adminOnly, createAssessmentSkill);
     router.get('/assessment-skills', auth, adminOnly, getAssessmentSkills);
     router.get('/assessment-skills/by-category/:categoryId', auth, adminOnly, getAssessmentSkills);
     router.put('/assessment-skills/:id', auth, adminOnly, updateAssessmentSkill);
     router.delete('/assessment-skills/:id', auth, adminOnly, deleteAssessmentSkill);

     // Assessment Sub-Skill Routes
     router.post('/assessment-sub-skills', auth, adminOnly, createAssessmentSubSkill);
     router.get('/assessment-sub-skills', auth, adminOnly, getAssessmentSubSkills);
     router.get('/assessment-sub-skills/by-skill/:skillId', auth, adminOnly, getAssessmentSubSkills);
     router.put('/assessment-sub-skills/:id', auth, adminOnly, updateAssessmentSubSkill);
     router.delete('/assessment-sub-skills/:id', auth, adminOnly, deleteAssessmentSubSkill);

     // Student Core Skills Assessment Routes (Admin Only)
     router.post('/students/:studentUserId/core-skills-assessment', auth, adminOnly, submitStudentSkillAssessment);

     module.exports = router;