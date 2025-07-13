import React, { useState } from "react";

const ApplicantDetails = () => {
  // ---------------- Core‑skill dummy data (will come from API later) -------------
  const coreSkills = [
    {
      title: "Skill 1",
      score: "36/40",
      subSkills: [
        { title: "Sub Skill 1", score: "5/10" },
        { title: "Sub Skill 2", score: "6/10" },
        { title: "Sub Skill 3", score: "9/10" },
        { title: "Sub Skill 4", score: "9/10" },
      ],
    },
    {
      title: "Skill 2",
      score: "36/40",
      subSkills: [
        { title: "Sub Skill 1", score: "9/10" },
        { title: "Sub Skill 2", score: "9/10" },
        { title: "Sub Skill 3", score: "9/10" },
        { title: "Sub Skill 4", score: "9/10" },
      ],
    },
    {
      title: "Skill 3",
      score: "36/40",
      subSkills: [
        { title: "Sub Skill 1", score: "9/10" },
        { title: "Sub Skill 2", score: "9/10" },
        { title: "Sub Skill 3", score: "9/10" },
        { title: "Sub Skill 4", score: "9/10" },
      ],
    },
    {
      title: "Skill 4",
      score: "36/40",
      subSkills: [
        { title: "Sub Skill 1", score: "9/10" },
        { title: "Sub Skill 2", score: "9/10" },
        { title: "Sub Skill 3", score: "9/10" },
        { title: "Sub Skill 4", score: "9/10" },
      ],
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const toggleSkill = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  return (
    <div className="max-w-6xl w-full mx-auto p-6">
      {/* ---------------- Header ---------------- */}
      <div className="bg-green-100 rounded-lg p-6 flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="w-24 h-24 rounded-full border object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">Amy Cooper</h1>
            <p className="text-gray-600">Elementary Mathematics Teacher</p>
            <p className="text-sm text-gray-500 mt-1">davidwhite@gmail.com • +234 8173978906 • Delhi, India</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {['Mathematics','Science','STEM'].map((t)=>(
                <span key={t} className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">Schedule Interview</button>
          <button className="border px-4 py-2 rounded-md text-sm">Download Resume</button>
        </div>
      </div>

      {/* ---------------- Main Grid ---------------- */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Teaching Experience */}
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Teaching Experience</h2>
          <p className="text-sm font-medium">Mathematics Peer Tutor</p>
          <p className="text-xs text-gray-500">Boston University Learning Center | 2021 - 2023</p>
          <p className="text-sm mt-2 text-gray-700">Provided academic support to undergraduate students in various mathematics courses. Facilitated study groups and developed supplementary learning materials.</p>
        </div>

        {/* Education */}
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Education</h2>
          <p className="text-sm font-medium">Bachelor of Science in Elementary Education</p>
          <p className="text-xs text-gray-500">San Francisco State University</p>
          <p className="text-sm mt-2 text-gray-700">Graduated 2014 • GPA: 4.0</p>
        </div>

        {/* Certifications */}
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Certifications & Training</h2>
          {[
            "Graduate Teaching Assistant Certification",
            "Research Methods in Mathematics",
            "Academic Writing for Graduates",
            "Python for Data Science",
          ].map((c) => (
            <div key={c} className="mb-2">
              <p className="text-sm font-medium">{c}</p>
              <p className="text-xs text-gray-500">MIT / Harvard • 2023</p>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full inline-block mt-1">Active</span>
            </div>
          ))}
        </div>

        {/* --------- NEW Collapsible Core Skills --------- */}
        <div className="border rounded-md p-4">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-1 text-gray-800"><span className="text-green-500">🟢</span>Core Skills</h2>
          {coreSkills.map((skill, idx) => (
            <div key={skill.title} className="mb-3 border rounded-md cursor-pointer hover:shadow" onClick={() => toggleSkill(idx)}>
              {/* Skill header */}
              <div className="flex justify-between items-center p-4">
                <div>
                  <p className="font-medium text-gray-800">{skill.title}</p>
                  <p className="text-sm text-yellow-600">{openIndex===idx ? 'Hide Sub Skills' : 'View Sub Skills'}</p>
                </div>
                <span className="text-sm font-bold text-gray-800">{skill.score}</span>
              </div>
              {/* Sub skills */}
              {openIndex===idx && (
                <div className="border-t p-4 space-y-3">
                  {skill.subSkills.map((sub)=>(
                    <div key={sub.title} className="flex justify-between text-sm text-gray-700">
                      <span>{sub.title}</span>
                      <span className="font-semibold">{sub.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Academic Skills */}
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Academic Skills</h2>
          <div className="flex flex-wrap gap-2">
            {["Lecture Notes","Peer Review","Grant Writing","Math Modeling","Statistical Inference","Conference Presentations"].map((tag)=>(
              <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>

        {/* Publications */}
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Publications & Research (optional)</h2>
          {[
            {title:'Stochastic Models in Environmental Risk Assessment', role:'First Author'},
            {title:'Optimization Techniques in Resource Management', role:'Co-Author'},
          ].map((pub)=>(
            <div key={pub.title} className="mb-4">
              <p className="text-sm font-medium">{pub.title}</p>
              <p className="text-xs text-gray-500">Journal of Applied Mathematics • 2024</p>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full inline-block mt-1">{pub.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;
