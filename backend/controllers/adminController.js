const { Op } = require('sequelize');
const { User, StudentProfile, SchoolProfile, JobType, Subject, State, City, AssessmentSkillCategory, AssessmentSkill, AssessmentSubSkill, Helptkt, Job, JobApplication, JobTypeAssessmentSkill } = require('../models');
const { sendOnboardingEmail } = require('../services/emailService');
const { createNotification } = require('../services/notificationService');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// --- User Management ---
exports.createUser = async (req, res) => {
    const { email, name, role } = req.body;
    if (!email || !name || !role) {
        return res.status(400).json({ success: false, message: 'Email, name, and role are required.' });
    }

    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ success: false, message: 'User with this email already exists.' });
        }

        const temporaryPassword = uuidv4().split('-')[0]; // Generate a simple temporary password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(temporaryPassword, salt);

        user = await User.create({
            email,
            password: hashedPassword,
            role
        });

        if (role === 'student') {
            await StudentProfile.create({ userId: user.id, first_name: name.split(' ')[0] || '', last_name: name.split(' ').slice(1).join(' ') || '' });
        } else if (role === 'school') {
            await SchoolProfile.create({ userId: user.id, school_name: name });
        }

        await sendOnboardingEmail(email, temporaryPassword);

        res.status(201).json({ success: true, message: `User created and onboarding email sent to ${email}.` });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'email', 'role', 'createdAt', 'updatedAt'],
            include: [
                { model: StudentProfile, attributes: ['first_name', 'last_name'] },
                { model: SchoolProfile, attributes: ['school_name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, users });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findByPk(req.params.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        await user.save();
        res.json({ success: true, message: 'User updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        if (user.id === req.user.id) return res.status(400).json({ success: false, message: 'Cannot delete your own account.' });

        await user.destroy(); // Associated profiles will be deleted via CASCADE
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Dashboard ---
exports.getAdminDashboardMetrics = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalStudents = await User.count({ where: { role: 'student' } });
        const totalSchools = await User.count({ where: { role: 'school' } });
        const totalJobs = await Job.count();
        const totalApplications = await JobApplication.count();
        const pendingApplications = await JobApplication.count({ where: { status: 'applied' } });

        res.json({
            success: true,
            metrics: { totalUsers, totalStudents, totalSchools, totalJobs, totalApplications, pendingApplications }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// --- Generic CRUD Factory for Master Data ---
const createMasterDataController = (model, createFields, updateFields, order = [['name', 'ASC']]) => ({
    getAll: async (req, res) => {
        try {
            const items = await model.findAll({ order });
            res.json({ success: true, items });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    },
    create: async (req, res) => {
        try {
            const body = {};
            for (const field of createFields) {
                if (req.body[field] === undefined) return res.status(400).json({ success: false, message: `${field} is required` });
                body[field] = req.body[field];
            }
            const newItem = await model.create(body);
            res.status(201).json({ success: true, item: newItem });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    update: async (req, res) => {
        try {
            const item = await model.findByPk(req.params.id);
            if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
            for (const field of updateFields) {
                if (req.body[field] !== undefined) item[field] = req.body[field];
            }
            await item.save();
            res.json({ success: true, item });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    delete: async (req, res) => {
        try {
            const item = await model.findByPk(req.params.id);
            if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
            await item.destroy();
            res.json({ success: true, message: 'Item deleted' });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
});

exports.jobTypes = createMasterDataController(JobType, ['name'], ['name']);
exports.subjects = createMasterDataController(Subject, ['name'], ['name']);
exports.states = createMasterDataController(State, ['name'], ['name']);
exports.cities = createMasterDataController(City, ['name', 'stateId'], ['name', 'stateId']);

// Special handlers for Assessment Skills due to associations
exports.assessmentCategories = createMasterDataController(AssessmentSkillCategory, ['name', 'description'], ['name', 'description']);
exports.assessmentSkills = createMasterDataController(AssessmentSkill, ['name', 'description', 'categoryId'], ['name', 'description', 'categoryId']);
exports.assessmentSubSkills = createMasterDataController(AssessmentSubSkill, ['name', 'max_score', 'skillId'], ['name', 'max_score', 'skillId']);

exports.getCitiesByState = async (req, res) => {
    try {
        const cities = await City.findAll({ where: { stateId: req.params.stateId }, order: [['name', 'ASC']] });
        res.json({ success: true, items: cities });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- Help Tickets ---
exports.getHelpTickets = async (req, res) => {
  try {
    const tickets = await Helptkt.findAll({
      include: [{ model: User, attributes: ['email'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateHelpTicketStatus = async (req, res) => {
  try {
    const ticket = await Helptkt.findByPk(req.params.ticketId);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    ticket.status = req.body.status;
    await ticket.save();
    // Notify user about status update
    await createNotification(ticket.userId, `Your help ticket "${ticket.subject}" has been updated to: ${ticket.status}.`);
    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// --- Bulk Upload Placeholders ---
exports.bulkUploadUsers = (req, res) => res.status(501).json({ success: false, message: 'Bulk user upload not yet implemented.' });
exports.bulkUploadScores = (req, res) => res.status(501).json({ success: false, message: 'Bulk score upload not yet implemented.' });