    const AssessmentSkillCategory = require('../models/AssessmentSkillCategory');
    const AssessmentSkill = require('../models/AssessmentSkill');
    const AssessmentSubSkill = require('../models/AssessmentSubSkill');
    const StudentProfile = require('../models/StudentProfile'); // Import StudentProfile
    const StudentSkillAssessment = require('../models/StudentSkillAssessment'); // Import new model
    const StudentSubSkillScore = require('../models/StudentSubSkillScore'); // Import new model
    const { sequelize } = require('sequelize'); // Import sequelize instance for transactions

    // --- Assessment Skill Category Controllers ---

    // @desc    Create a new assessment skill category
    // @route   POST /api/admin/assessment-skill-categories
    // @access  Private (Admin only)
    exports.createAssessmentSkillCategory = async (req, res) => {
      const { name, description } = req.body;
      try {
        const newCategory = await AssessmentSkillCategory.create({ name, description });
        res.status(201).json({ success: true, message: 'Category created successfully', category: newCategory });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    };

    // @desc    Get all assessment skill categories
    // @route   GET /api/admin/assessment-skill-categories
    // @access  Private (Admin only)
    exports.getAssessmentSkillCategories = async (req, res) => {
      try {
        const categories = await AssessmentSkillCategory.findAll({
          order: [['name', 'ASC']]
        });
        res.json({ success: true, categories });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    };

    // @desc    Update an assessment skill category
    // @route   PUT /api/admin/assessment-skill-categories/:id
    // @access  Private (Admin only)
    exports.updateAssessmentSkillCategory = async (req, res) => {
      const { name, description } = req.body;
      const categoryId = req.params.id;
      try {
        let category = await AssessmentSkillCategory.findByPk(categoryId);
        if (!category) {
          return res.status(404).json({ msg: 'Category not found' });
        }
        category.name = name || category.name;
        category.description = description !== undefined ? description : category.description;
        await category.save();
        res.json({ success: true, message: 'Category updated successfully', category });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    };

    // @desc    Delete an assessment skill category
    // @route   DELETE /api/admin/assessment-skill-categories/:id
    // @access  Private (Admin only)
    exports.deleteAssessmentSkillCategory = async (req, res) => {
      const categoryId = req.params.id;
      try {
        const category = await AssessmentSkillCategory.findByPk(categoryId);
        if (!category) {
          return res.status(404).json({ msg: 'Category not found' });
        }
        await category.destroy();
        res.json({ success: true, message: 'Category deleted successfully' });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    };

    // --- Assessment Skill Controllers ---

    // @desc    Create a new assessment skill
    // @route   POST /api/admin/assessment-skills
    // @access  Private (Admin only)
    exports.createAssessmentSkill = async (req, res) => {
      const { name, description, categoryId } = req.body;
      try {
        const newSkill = await AssessmentSkill.create({ name, description, categoryId });
        res.status(201).json({ success: true, message: 'Assessment skill created successfully', skill: newSkill });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    };

    // @desc    Get all assessment skills (optionally by category)
    // @route   GET /api/admin/assessment-skills
    // @route   GET /api/admin/assessment-skills/by-category/:categoryId
    // @access  Private (Admin only)
    exports.getAssessmentSkills = async (req, res) => {
      const { categoryId } = req.params;
      try {
        const whereClause = categoryId ? { categoryId } : {};
        const skills = await AssessmentSkill.findAll({
          where: whereClause,
          include: [{ model: AssessmentSkillCategory, attributes: ['name'] }],
          order: [['name', 'ASC']]
        });
        res.json({ success: true, skills });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    };

    // @desc    Update an assessment skill
    // @route   PUT /api/admin/assessment-skills/:id
    // @access  Private (Admin only)
    exports.updateAssessmentSkill = async (req, res) => {
      const { name, description, categoryId } = req.body;
      const skillId = req.params.id;
      try {
        let skill = await AssessmentSkill.findByPk(skillId);
        if (!skill) {
          return res.status(404).json({ msg: 'Assessment skill not found' });
        }
        skill.name = name || skill.name;
        skill.description = description !== undefined ? description : skill.description;
        skill.categoryId = categoryId || skill.categoryId;
        await skill.save();
        res.json({ success: true, message: 'Assessment skill updated successfully', skill });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    };

    // @desc    Delete an assessment skill
    // @route   DELETE /api/admin/assessment-skills/:id
    // @access  Private (Admin only)
    exports.deleteAssessmentSkill = async (req, res) => {
      const skillId = req.params.id;
      try {
        const skill = await AssessmentSkill.findByPk(skillId);
        if (!skill) {
          return res.status(404).json({ msg: 'Assessment skill not found' });
        }
        await skill.destroy();
        res.json({ success: true, message: 'Assessment skill deleted successfully' });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    };

    // --- Assessment Sub-Skill Controllers ---

    // @desc    Create a new assessment sub-skill
    // @route   POST /api/admin/assessment-sub-skills
    // @access  Private (Admin only)
    exports.createAssessmentSubSkill = async (req, res) => {
      const { name, max_score, skillId } = req.body;
      try {
        const newSubSkill = await AssessmentSubSkill.create({ name, max_score, skillId });
        res.status(201).json({ success: true, message: 'Assessment sub-skill created successfully', subSkill: newSubSkill });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    };

    // @desc    Get all assessment sub-skills (optionally by parent skill)
    // @route   GET /api/admin/assessment-sub-skills
    // @route   GET /api/admin/assessment-sub-skills/by-skill/:skillId
    // @access  Private (Admin only)
    exports.getAssessmentSubSkills = async (req, res) => {
      const { skillId } = req.params;
      try {
        const whereClause = skillId ? { skillId } : {};
        const subSkills = await AssessmentSubSkill.findAll({
          where: whereClause,
          include: [{ model: AssessmentSkill, attributes: ['name'] }],
          order: [['name', 'ASC']]
        });
        res.json({ success: true, subSkills });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    };

    // @desc    Update an assessment sub-skill
    // @route   PUT /api/admin/assessment-sub-skills/:id
    // @access  Private (Admin only)
    exports.updateAssessmentSubSkill = async (req, res) => {
      const { name, max_score, skillId } = req.body;
      const subSkillId = req.params.id;
      try {
        let subSkill = await AssessmentSubSkill.findByPk(subSkillId);
        if (!subSkill) {
          return res.status(404).json({ msg: 'Assessment sub-skill not found' });
        }
        subSkill.name = name || subSkill.name;
        subSkill.max_score = max_score !== undefined ? max_score : subSkill.max_score;
        subSkill.skillId = skillId || subSkill.skillId;
        await subSkill.save();
        res.json({ success: true, message: 'Assessment sub-skill updated successfully', subSkill });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    };

    // @desc    Delete an assessment sub-skill
    // @route   DELETE /api/admin/assessment-sub-skills/:id
    // @access  Private (Admin only)
    exports.deleteAssessmentSubSkill = async (req, res) => {
      const subSkillId = req.params.id;
      try {
        const subSkill = await AssessmentSubSkill.findByPk(subSkillId);
        if (!subSkill) {
          return res.status(404).json({ msg: 'Assessment sub-skill not found' });
        }
        await subSkill.destroy();
        res.json({ success: true, message: 'Assessment sub-skill deleted successfully' });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    };

    // --- NEW: Student Core Skills Assessment Controllers (Admin Upload) ---

    // @desc    Submit a student's core skill assessment scores
    // @route   POST /api/admin/students/:studentUserId/core-skills-assessment
    // @access  Private (Admin only)
    exports.submitStudentSkillAssessment = async (req, res) => {
      const { assessmentSkillId, sub_skill_scores } = req.body; // sub_skill_scores is an array of { subSkillId, score }
      const studentUserId = req.params.studentUserId; // This is the User ID, not StudentProfile ID

      // Validate input
      if (!assessmentSkillId || !Array.isArray(sub_skill_scores) || sub_skill_scores.length !== 4) {
        return res.status(400).json({ msg: 'Invalid input. assessmentSkillId and exactly 4 sub_skill_scores are required.' });
      }

      try {
        // Find the student's profile ID from their User ID
        const studentProfile = await StudentProfile.findOne({ where: { userId: studentUserId } });
        if (!studentProfile) {
          return res.status(404).json({ msg: 'Student profile not found for the given user ID.' });
        }
        const studentId = studentProfile.id;

        // Verify the AssessmentSkill exists and get its associated sub-skills
        const assessmentSkill = await AssessmentSkill.findByPk(assessmentSkillId, {
          include: [{ model: AssessmentSubSkill, as: 'assessmentSubSkills' }]
        });

        if (!assessmentSkill) {
          return res.status(404).json({ msg: 'Assessment skill not found.' });
        }

        // Validate that the provided sub_skill_scores match the expected sub-skills for this assessmentSkill
        const validSubSkillIds = assessmentSkill.assessmentSubSkills.map(s => s.id);
        let totalScore = 0;
        const subScoresToCreate = [];

        for (const inputScore of sub_skill_scores) {
          if (!validSubSkillIds.includes(inputScore.subSkillId)) {
            return res.status(400).json({ msg: `Sub-skill ID ${inputScore.subSkillId} is not valid for this assessment skill.` });
          }
          if (inputScore.score < 0 || inputScore.score > 10) {
            return res.status(400).json({ msg: `Score for sub-skill ${inputScore.subSkillId} must be between 0 and 10.` });
          }
          totalScore += inputScore.score;
          subScoresToCreate.push({ subSkillId: inputScore.subSkillId, score: inputScore.score });
        }

        // Ensure exactly 4 sub-skills were provided and they are unique
        if (new Set(subScoresToCreate.map(s => s.subSkillId)).size !== 4) {
            return res.status(400).json({ msg: 'Exactly 4 unique sub-skill scores are required for this assessment skill.' });
        }


        // Start a transaction to ensure atomicity
        const transaction = await sequelize.transaction();

        try {
          // Create the main StudentSkillAssessment record
          const studentSkillAssessment = await StudentSkillAssessment.create({
            studentId,
            assessmentSkillId,
            total_score: totalScore,
          }, { transaction });

          // Create the individual StudentSubSkillScore records
          for (const subScore of subScoresToCreate) {
            await StudentSubSkillScore.create({
              assessmentId: studentSkillAssessment.id,
              subSkillId: subScore.subSkillId,
              score: subScore.score,
            }, { transaction });
          }

          await transaction.commit();

          res.status(201).json({
            success: true,
            message: 'Student skill assessment submitted successfully',
            assessment: {
              id: studentSkillAssessment.id,
              studentId: studentId,
              assessmentSkillId: assessmentSkillId,
              total_score: totalScore,
              sub_skill_scores: subScoresToCreate
            }
          });

        } catch (dbErr) {
          await transaction.rollback();
          console.error('Database transaction failed:', dbErr.message);
          res.status(500).send('Server Error during transaction');
        }

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    };
    