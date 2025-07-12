const StudentPersonalSkill = require('../models/StudentPersonalSkill');
const StudentProfile = require('../models/StudentProfile');

// Helper function to get studentProfileId from userId
const getStudentProfileId = async (userId) => {
    const studentProfile = await StudentProfile.findOne({ where: { userId } });
    if (!studentProfile) {
        return null;
    }
    return studentProfile.id;
};

// @desc    Add new personal skills for the logged-in student
// @route   POST /api/students/profile/my-skills
// @access  Private (Student only)
exports.createPersonalSkill = async (req, res) => {
    // Now expecting skill_names as an array
    const { skill_names } = req.body; // Expecting an array of strings

    if (!Array.isArray(skill_names) || skill_names.length === 0) {
        return res.status(400).json({ msg: 'skill_names must be a non-empty array.' });
    }

    try {
        const studentId = await getStudentProfileId(req.user.id);
        if (!studentId) {
            return res.status(404).json({ msg: 'Student profile not found.' });
        }

        const existingSkillsCount = await StudentPersonalSkill.count({ where: { studentId } });
        const skillsToAddCount = skill_names.length;

        // --- Validation: Max 8 skills (total after adding new ones) ---
        if (existingSkillsCount + skillsToAddCount > 8) {
            return res.status(400).json({ msg: `Adding these skills would exceed the maximum of 8 personal skills allowed. You currently have ${existingSkillsCount} skills.` });
        }

        const createdSkills = [];
        for (const skill_name of skill_names) {
            // --- Validation: Character limit for each skill_name ---
            if (skill_name.length > 100) {
                return res.status(400).json({ msg: `Skill name '${skill_name}' exceeds 100 character limit.` });
            }

            const newPersonalSkill = await StudentPersonalSkill.create({
                skill_name,
                studentId
            });
            createdSkills.push(newPersonalSkill);
        }

        res.status(201).json({ success: true, message: 'Personal skills added successfully', skills: createdSkills });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all personal skills for the logged-in student
// @route   GET /api/students/profile/my-skills
// @access  Private (Student only)
exports.getPersonalSkills = async (req, res) => {
    try {
        const studentId = await getStudentProfileId(req.user.id);
        if (!studentId) {
            return res.status(404).json({ msg: 'Student profile not found.' });
        }

        const personalSkills = await StudentPersonalSkill.findAll({
            where: { studentId },
            order: [['createdAt', 'ASC']] // Order by creation date
        });

        res.json({ success: true, personalSkills });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update a specific personal skill for the logged-in student
// @route   PUT /api/students/profile/my-skills/:skillId
// @access  Private (Student only, owner of the skill)
exports.updatePersonalSkill = async (req, res) => {
    const { skill_name } = req.body;
    const skillId = req.params.skillId;

    try {
        const studentId = await getStudentProfileId(req.user.id);
        if (!studentId) {
            return res.status(404).json({ msg: 'Student profile not found.' });
        }

        let personalSkill = await StudentPersonalSkill.findByPk(skillId);

        if (!personalSkill) {
            return res.status(404).json({ msg: 'Personal skill not found.' });
        }

        // Ensure the skill belongs to the logged-in student
        if (personalSkill.studentId !== studentId) {
            return res.status(403).json({ msg: 'Access denied. This personal skill does not belong to your profile.' });
        }

        // --- Validation: Character limit ---
        if (skill_name && skill_name.length > 100) { // Only validate if skill_name is provided
            return res.status(400).json({ msg: 'Skill name exceeds 100 character limit.' });
        }

        personalSkill.skill_name = skill_name || personalSkill.skill_name;

        await personalSkill.save();
        res.json({ success: true, message: 'Personal skill updated successfully', skill: personalSkill });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a specific personal skill for the logged-in student
// @route   DELETE /api/students/profile/my-skills/:skillId
// @access  Private (Student only, owner of the skill)
exports.deletePersonalSkill = async (req, res) => {
    const skillId = req.params.skillId;

    try {
        const studentId = await getStudentProfileId(req.user.id);
        if (!studentId) {
            return res.status(404).json({ msg: 'Student profile not found.' });
        }

        const personalSkill = await StudentPersonalSkill.findByPk(skillId);

        if (!personalSkill) {
            return res.status(404).json({ msg: 'Personal skill not found.' });
        }

        // Ensure the skill belongs to the logged-in student
        if (personalSkill.studentId !== studentId) {
            return res.status(403).json({ msg: 'Access denied. This personal skill does not belong to your profile.' });
        }

        await personalSkill.destroy();
        res.json({ success: true, message: 'Personal skill deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
