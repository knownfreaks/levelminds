import React from "react";
import ProgressBar from "../progress/ProgressBar";

const SkillsSection = () => {
  const teachingSkills = [
    { label: "Mathematics Education", value: 95 },
    { label: "Lesson Planning", value: 92 },
    { label: "Classroom Management", value: 88 },
    { label: "Student Assessment", value: 80 },
    { label: "Educational Technology", value: 90 },
  ];

  const personalStrengths = [
    { label: "Communication", value: 95 },
    { label: "Adaptability", value: 92 },
    { label: "Creativity", value: 88 },
    { label: "Patience", value: 80 },
    { label: "Collaboration", value: 90 },
    { label: "Problem Solving", value: 95 },
  ];

  const tools = [
    "Literature Review",
    "Data Analysis",
    "Mathematical Modeling",
    "Statistical Inference",
    "Academic Presentations",
    "Peer Review",
    "Grant Writing",
    "Conference Presentations",
  ];

  const achievements = [
    {
      title: "Dean’s List",
      subtitle: "State University Education Department",
      details: "Maintained GPA above 3.7 throughout senior year",
      year: "2023 – 2024",
    },
    {
      title: "Education Technology Innovation Certificate",
      subtitle: "State University",
      details:
        "Completed advanced coursework in integrating technology into mathematics education",
      year: "2024",
    },
    {
      title: "Volunteer Teaching Excellence",
      subtitle: "Community Learning Center",
      details:
        "Over 200 hours of volunteer tutoring in mathematics for underserved students",
      year: "2022 – 2024",
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Section */}
      <div className="space-y-6">
        {/* Tools */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="font-semibold text-lg mb-2">
            📁 Educational Technology & Tools
          </h2>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool, idx) => (
              <span
                key={idx}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="font-semibold text-lg mb-4">
            📌 Academic Achievements & Recognition
          </h2>
          <div className="space-y-4">
            {achievements.map((item, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.subtitle}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.details}</p>
                  </div>
                  <span className="text-green-600 text-sm font-semibold bg-green-100 px-2 py-0.5 rounded">
                    {item.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="space-y-6">
        {/* Teaching Skills */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="font-semibold text-lg mb-4">💡 Teaching Skills</h2>
          {teachingSkills.map((skill, idx) => (
            <ProgressBar key={idx} label={skill.label} value={skill.value} />
          ))}
        </div>

        {/* Personal Strengths */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="font-semibold text-lg mb-4">💡 Personal Strengths</h2>
          {personalStrengths.map((skill, idx) => (
            <ProgressBar key={idx} label={skill.label} value={skill.value} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
