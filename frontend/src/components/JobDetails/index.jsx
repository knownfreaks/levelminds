import React from "react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaMoneyBillAlt,
  FaUserCircle,
} from "react-icons/fa";
import cardicon from "../../assets/card-icon.png";
const jobData = {
  title: "Elementary Mathematics Teacher",
  location: "Delhi, India",
  type: "Full-time",
  postedDate: "14th August 2025",
  endDate: "14th September 2025",
  jobLevel: "Entry - level",
  salary: "₹ 10-11 LPA",
  institution: "University / School Name",
  overview:
    "We are seeking a passionate and dedicated Elementary Math Teacher to join our vibrant academic team at [Insert School Name]. This role is ideal for an educator who is enthusiastic about shaping young minds and making math engaging, fun, and understandable for students in grades 1 to 5. If you're committed to fostering a love for learning and promoting mathematical thinking from an early age, we'd love to meet you!",
  responsibilities: [
    "Design and deliver creative, age-appropriate math lessons aligned with the curriculum.",
    "Use various instructional strategies to accommodate different learning styles.",
    "Create a positive and inclusive classroom environment that encourages participation and curiosity.",
    "Assess student performance through tests, quizzes, assignments, and observations.",
    "Provide regular feedback to students and communicate progress with parents and guardians.",
    "Collaborate with other teachers and staff to enhance overall student learning and school initiatives.",
    "Participate in professional development programs and staff meetings.",
    "Maintain classroom discipline and uphold school policies and procedures.",
  ],
  education: [
    "Bachelor's degree in Education, Mathematics",
    "State teaching certification/license for elementary education",
  ],
  skills: [
    "Prior experience teaching math at the elementary level is highly preferred",
    "Strong understanding of child development and early mathematics concepts",
    "Excellent communication and classroom management skills",
    "Creativity, curiosity, and a passion for teaching young learners",
    "Ability to plan lessons and assess learning outcomes effectively",
  ],
  about:
    "We are seeking a passionate and dedicated Elementary Math Teacher to join our vibrant academic team at [Insert School Name]. This role is ideal for an educator who is enthusiastic about shaping young minds and making math engaging, fun, and understandable for students in grades 1 to 5.",
  aboutLink: "https://silent-profit.name/",
};

export default function JobDetails() {
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Job Details</h2>
          {/* Header with Profile Picture */}
          <div className="flex items-start md:items-center justify-between mb-6 flex-col md:flex-row gap-4">
            <div className="items-center gap-4">
              <div className="flex">
                <img
                  src={cardicon}
                  alt="cardIcon"
                  className="w-[80px] h-[70px] rounded-sm"
                />

                <div className="gap-1 mx-2">
                  <h3 className="text-2xl font-bold text-black nunito-text ">
                    {jobData.title}
                  </h3>
                  <p className="text-gray-500">{jobData.institution}</p>
                </div>
              </div>

              <div className="mt-2 flex gap-2 text-sm text-green-600">
                <span className="bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                  <FaMapMarkerAlt /> {jobData.location}
                </span>
                <span className="bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                  <FaClock /> {jobData.type}
                </span>
              </div>
            </div>
          </div>
          {/* Overview */}
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-2">Overview</h4>
            <p className="text-gray-700">{jobData.overview}</p>
          </div>
          {/* Key Responsibilities */}
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-2">Key Responsibilities</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {jobData.responsibilities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          {/* Requirements Section */}
          <div>
            <h4 className="font-semibold text-lg mb-2">Requirements</h4>
            <h5 className="font-medium text-md mt-2">Education</h5>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              {jobData.education.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <h5 className="font-medium text-md mt-2">Experience & Skills</h5>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {jobData.skills.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-lg font-semibold mb-4">Job Overview</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div className=" items-center gap-2 text-green-600">
                <FaCalendarAlt />
                <span className="text-gray-700">
                  <span className="font-medium">Job Post Date:</span>
                  <br />
                  {jobData.postedDate}
                </span>
              </div>
              <div className=" items-center gap-2 text-green-600">
                <FaCalendarAlt />
                <span className="text-gray-700">
                  <span className="font-medium">Application ends on:</span>
                  <br />
                  {jobData.endDate}
                </span>
              </div>
              <div className=" items-center gap-2 text-green-600">
                <FaClock />
                <span className="text-gray-700">
                  <span className="font-medium">Job Type:</span>
                  <br />
                  {jobData.jobLevel}
                </span>
              </div>
              <div className="items-center gap-2 text-green-600">
                <FaMoneyBillAlt />
                <span className="text-gray-700">
                  <span className="font-medium">CTC:</span>
                  <br />
                  {jobData.salary}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-lg font-semibold mb-4">About School</h4>
            <p className="text-sm text-gray-700 mb-2">{jobData.about}</p>
            <a
              href={jobData.aboutLink}
              className="text-blue-600 underline text-sm"
            >
              Know more about us
            </a>
          </div>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
