const sequelize = require('./config/db');
const { User, StudentProfile, SchoolProfile, Job, JobApplication, JobType, Subject, State, City, AssessmentSkillCategory, AssessmentSkill, AssessmentSubSkill, StudentSkillAssessment, StudentSubSkillScore, StudentPersonalSkill, Certificate } = require('./models'); // Adjust this import based on your models/index.js
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    // Sync all models - force: true will drop tables if they exist
    await sequelize.sync({ force: true });
    console.log('Database synced!');

    // --- Create Users ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({ email: 'admin@levelminds.com', password: hashedPassword, role: 'admin' });
    const schoolUser = await User.create({ email: 'school@greenwood.edu', password: hashedPassword, role: 'school' });
    const studentUser1 = await User.create({ email: 'student.jane@example.com', password: hashedPassword, role: 'student' });
    const studentUser2 = await User.create({ email: 'student.john@example.com', password: hashedPassword, role: 'student' });
    console.log('Users created.');

    // --- Create Profiles ---
    const schoolProfile = await SchoolProfile.create({
      userId: schoolUser.id,
      school_name: 'Greenwood High',
      about: 'A leading institution focused on holistic development.',
      website: 'https://greenwood.edu',
      address: '123 Education Lane',
      pincode: '110011',
      onboarded: true
    });

    const studentProfile1 = await StudentProfile.create({
      userId: studentUser1.id,
      first_name: 'Jane',
      last_name: 'Doe',
      mobile: '9876543210',
      about: 'Passionate educator specializing in modern teaching methodologies for mathematics.',
      college_name: 'State University',
      university_name: 'Central University',
      course_name: 'Bachelor of Education',
      course_year: '2022-2024',
      onboarded: true,
    });
     const studentProfile2 = await StudentProfile.create({
      userId: studentUser2.id,
      first_name: 'John',
      last_name: 'Smith',
      mobile: '9876543211',
      about: 'Enthusiastic science teacher with a knack for hands-on experiments.',
      college_name: 'City College',
      university_name: 'Regional University',
      course_name: 'Bachelor of Science',
      course_year: '2021-2023',
      onboarded: true,
    });
    console.log('Profiles created.');

    // --- Master Data ---
    const state = await State.create({ name: 'Delhi' });
    const city = await City.create({ name: 'New Delhi', stateId: state.id });
    await schoolProfile.update({ stateId: state.id, cityId: city.id });

    const jobType1 = await JobType.create({ name: 'Mathematics Teacher' });
    const jobType2 = await JobType.create({ name: 'Science Teacher' });

    const subject1 = await Subject.create({ name: 'Mathematics' });
    const subject2 = await Subject.create({ name: 'Physics' });
    console.log('Master data created.');

    // --- Assessment Skills ---
    const cat1 = await AssessmentSkillCategory.create({ name: 'Pedagogical Skills' });
    const cat2 = await AssessmentSkillCategory.create({ name: 'Subject Matter Expertise' });

    const assessSkill1 = await AssessmentSkill.create({ name: 'Classroom Management', categoryId: cat1.id });
    const assessSkill2 = await AssessmentSkill.create({ name: 'Lesson Planning', categoryId: cat1.id });
    const assessSkill3 = await AssessmentSkill.create({ name: 'Algebraic Concepts', categoryId: cat2.id });

    await AssessmentSubSkill.bulkCreate([
      { name: 'Student Engagement', max_score: 10, skillId: assessSkill1.id },
      { name: 'Discipline', max_score: 10, skillId: assessSkill1.id },
      { name: 'Time Management', max_score: 10, skillId: assessSkill1.id },
      { name: 'Conflict Resolution', max_score: 10, skillId: assessSkill1.id },
      { name: 'Curriculum Alignment', max_score: 10, skillId: assessSkill2.id },
      { name: 'Activity Design', max_score: 10, skillId: assessSkill2.id },
      { name: 'Assessment Creation', max_score: 10, skillId: assessSkill2.id },
      { name: 'Differentiation', max_score: 10, skillId: assessSkill2.id },
    ]);
    console.log('Assessment skills created.');
    
    // Link JobTypes (Categories) to AssessmentSkills
    await jobType1.addAssessmentSkill(assessSkill1);
    await jobType1.addAssessmentSkill(assessSkill3);
    await jobType2.addAssessmentSkill(assessSkill2);
    console.log('Job Types linked to Assessment Skills.');

    // --- Student Data ---
    await StudentPersonalSkill.bulkCreate([
        { skill_name: 'Communication', studentId: studentProfile1.id },
        { skill_name: 'Creativity', studentId: studentProfile1.id },
        { skill_name: 'Python', studentId: studentProfile2.id },
    ]);
     await Certificate.create({
        name: 'Certified Google Educator',
        given_by: 'Google',
        date: '2023-05-15',
        studentId: studentProfile1.id
    });
    
    const studentAssessment = await StudentSkillAssessment.create({ studentId: studentProfile1.id, assessmentSkillId: assessSkill1.id, total_score: 34 });
    const subSkills = await assessSkill1.getAssessmentSubSkills();
    await StudentSubSkillScore.bulkCreate([
        { assessmentId: studentAssessment.id, subSkillId: subSkills[0].id, score: 9 },
        { assessmentId: studentAssessment.id, subSkillId: subSkills[1].id, score: 8 },
        { assessmentId: studentAssessment.id, subSkillId: subSkills[2].id, score: 10 },
        { assessmentId: studentAssessment.id, subSkillId: subSkills[3].id, score: 7 },
    ]);
    console.log('Student data and assessments created.');
    
    // --- Jobs and Applications ---
    const job1 = await Job.create({
        title: 'Senior Mathematics Teacher',
        jobTypeId: jobType1.id,
        subjectId: subject1.id,
        schoolId: schoolProfile.id,
        min_salary: 8,
        max_salary: 12,
        description: 'Seeking an experienced mathematics teacher for senior secondary classes.',
        responsibilities: 'Curriculum design, student assessment, and mentoring.',
        requirements: 'Masters in Mathematics, B.Ed, 5+ years of experience.',
        application_deadline: new Date(new Date().setDate(new Date().getDate() + 30))
    });
     const job2 = await Job.create({
        title: 'Middle School Physics Teacher',
        jobTypeId: jobType2.id,
        subjectId: subject2.id,
        schoolId: schoolProfile.id,
        min_salary: 5,
        max_salary: 7,
        description: 'Dynamic physics teacher for grades 6-8.',
        responsibilities: 'Conducting labs, preparing lesson plans.',
        requirements: 'Bachelors in Physics, B.Ed.',
        application_deadline: new Date(new Date().setDate(new Date().getDate() + 15))
    });

    await JobApplication.create({
        jobId: job1.id,
        studentId: studentProfile1.id,
        status: 'applied'
    });
     await JobApplication.create({
        jobId: job1.id,
        studentId: studentProfile2.id,
        status: 'shortlisted'
    });
    console.log('Jobs and applications created.');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();