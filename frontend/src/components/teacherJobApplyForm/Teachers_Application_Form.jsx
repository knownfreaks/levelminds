import React, { useState } from "react";

const TeacherApplicationForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    coverLetter: "",
    experience: "",
    availability: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data for backend
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    try {
      const res = await fetch("http://localhost:5000/api/submit-form", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Application submitted!");
      } else {
        alert("Failed to submit.");
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <form
      className="bg-gray-50 p-4 sm:p-8 rounded-lg w-full mx-auto space-y-6"
      onSubmit={handleSubmit}
    >
      {/* Section: Personal Info */}
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="font-semibold text-gray-700 mb-4 border-b pb-1">Personal Information</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={form.middleName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Email Address *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              required
            />
          </div>
        </div>
      </div>

      {/* Section: Cover Letter */}
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="font-semibold text-gray-700 mb-4 border-b pb-1">Cover Letter</h2>
        <label className="block text-sm font-medium mb-1">
          Tell us why you are interested in this position *
        </label>
        <textarea
          name="coverLetter"
          rows="4"
          value={form.coverLetter}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
          placeholder="Share your passion for teaching, relevant experience and what you can bring to this role"
        ></textarea>
      </div>

      {/* Section: Experience */}
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="font-semibold text-gray-700 mb-4 border-b pb-1">
          Experience & Availability
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Years of Teaching Experience</label>
            <input
              type="text"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g. 5 years"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">When can you start?</label>
            <input
              type="text"
              name="availability"
              value={form.availability}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g. Immediately, 2 weeks notice"
            />
          </div>
        </div>
      </div>

      {/* Section: Upload */}
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="font-semibold text-gray-700 mb-4 border-b pb-1">Documents</h2>
        <div className="border-dashed border-2 border-gray-300 rounded-md p-6 text-center">
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="mb-2 mx-auto"
            accept=".pdf,.doc,.docx"
          />
          <p className="text-sm font-medium">Upload your resume, certifications and other relevant documents</p>
          <p className="text-xs text-gray-500">Accepted formats: .pdf, .doc, .docx (Max 10MB each)</p>
        </div>
      </div>

      {/* Submit */}
      <div className="text-right">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Submit Application
        </button>
      </div>
    </form>
  );
};

export default TeacherApplicationForm;

