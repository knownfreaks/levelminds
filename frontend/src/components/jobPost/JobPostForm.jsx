import React, { useState } from "react";

const JobPostForm = () => {
  const [form, setForm] = useState({
    jobTitle: "",
    schoolName: "",
    location: "",
    jobType: "",
    gradeLevel: "",
    startDate: "",
    subjects: "",
    minSalary: "",
    maxSalary: "",
    jobDescription: "",
    requirements: "",
    preferredQualifications: "",
    deadline: "",
    contactEmail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/post-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Job posted successfully!");
      } else {
        alert("Error posting job.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w mx-auto p-6 space-y-6 bg-gray-50"
    >
      {/* Section: Basic Info */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-gray-700 mb-4 border-b pb-1">
          Basic Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Job Title *</label>
            <input
              type="text"
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">School / University Name *</label>
            <input
              type="text"
              name="schoolName"
              value={form.schoolName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Location *</label>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              required
            >
              <option value="">Select Location</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Job Type</label>
            <select
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
            >
              <option value="">Select Job Type</option>
              <option value="Full time">Full time</option>
              <option value="Part time">Part time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Grade Level</label>
            <select
              name="gradeLevel"
              value={form.gradeLevel}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
            >
              <option value="">Select Grade Level</option>
              <option value="Primary">Primary</option>
              <option value="Middle">Middle</option>
              <option value="High School">High School</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>
        </div>
      </div>

      {/* Section: Compensation */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-gray-700 mb-4 border-b pb-1">
          Subjects & Compensation
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Subjects to Teach</label>
            <input
              type="text"
              name="subjects"
              value={form.subjects}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Minimum Salary (Annual)</label>
            <input
              type="number"
              name="minSalary"
              value={form.minSalary}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="e.g. 300000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Maximum Salary (Annual)</label>
            <input
              type="number"
              name="maxSalary"
              value={form.maxSalary}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="e.g. 600000"
            />
          </div>
        </div>
      </div>

      {/* Section: Job Details */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-gray-700 mb-4 border-b pb-1">Job Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Job Description</label>
            <textarea
              name="jobDescription"
              rows="3"
              value={form.jobDescription}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="Describe the role, responsibilities and what makes this position exciting"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium">Requirements</label>
            <textarea
              name="requirements"
              rows="2"
              value={form.requirements}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="List the essential requirements for this position"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium">Preferred Qualifications</label>
            <textarea
              name="preferredQualifications"
              rows="2"
              value={form.preferredQualifications}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="List preferred qualifications & experiences"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Section: Application Details */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-gray-700 mb-4 border-b pb-1">Application Details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Application Deadline</label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="hr@school.edu"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Post Job
        </button>
      </div>
    </form>
  );
};

export default JobPostForm;
