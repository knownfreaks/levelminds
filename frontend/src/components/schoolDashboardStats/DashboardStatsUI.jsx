import React, { useEffect, useState } from "react";
import { FaUsers, FaClipboardList, FaClock } from "react-icons/fa";

const SchoolDashboardStats = () => {
  const [stats, setStats] = useState({
    jobPostings: 0,
    totalApplications: 0,
    pendingReviews: 0,
  });

  useEffect(() => {
    // Replace with actual API endpoint
    fetch("http://localhost:5000/api/school-dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        console.error("Failed to fetch stats", err);
      });
  }, []);

  const cardData = [
    {
      label: "Active Job Postings",
      count: stats.jobPostings,
      icon: <FaUsers className="text-purple-600 text-xl" />,
      bg: "bg-purple-100",
    },
    {
      label: "Total Applications",
      count: stats.totalApplications,
      icon: <FaClipboardList className="text-yellow-600 text-xl" />,
      bg: "bg-yellow-100",
    },
    {
      label: "Pending Reviews",
      count: stats.pendingReviews,
      icon: <FaClock className="text-red-600 text-xl" />,
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      {cardData.map((card, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border"
        >
          <div>
            <p className="text-sm text-gray-600 font-medium">{card.label}</p>
            <p className="text-2xl font-bold mt-1">{card.count}</p>
          </div>
          <div className={`rounded-full p-3 ${card.bg}`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SchoolDashboardStats;
