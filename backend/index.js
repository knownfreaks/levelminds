const express = require('express');
const sequelize = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// --- Import all models here to ensure they are loaded for Sequelize sync ---
require('./models/User');
require('./models/StudentProfile');
require('./models/SchoolProfile');
require('./models/Job');
require('./models/JobApplication');
require('./models/Interview');
require('./models/JobType');
require('./models/Subject');
require('./models/State');
require('./models/City');
require('./models/Skill'); 
require('./models/SubSkill'); 
require('./models/Certificate'); // <-- ADDED THIS LINE: Import the new Certificate model
require('./models/StudentPersonalSkill'); // Import StudentPersonalSkill model
require('./models/AssessmentSkillCategory'); // Import AssessmentSkillCategory model
require('./models/AssessmentSkill'); // Import AssessmentSkill model
require('./models/AssessmentSubSkill'); // Import AssessmentSubSkill model
require('./models/StudentSkillAssessment'); // Import StudentSkillAssessment model
require('./models/StudentSubSkillScore'); // Import StudentSubSkillScore model

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test DB Connection
sequelize
  .authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log('Error: ' + err));

// Sync database & create tables if they don't exist
// This will now pick up the Certificate model because it's required above
sequelize.sync({ alter: true })
  .then(() => console.log('Tables created successfully!'))
  .catch(err => console.error('Unable to create tables:', err));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload-image', require('./routes/uploadRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin', require('./routes/assessmentMasterRoutes')); 
app.use('/api/schools', require('./routes/schoolRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
// ... (existing student routes) ...
app.use('/api/students/profile/my-skills', require('./routes/studentPersonalSkillRoutes')); // <-- ADD THIS LINE
// ... (existing routes) ...
app.use('/api/students/profile/certifications', require('./routes/certificationRoutes')); // <-- ADD THIS LINE
// ... (rest of index.js) ...


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
