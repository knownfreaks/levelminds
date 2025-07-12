import React from "react";
import {
  FaLightbulb,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";

const UserProfileCard = () => {
  // Dummy Data Inside Component
  const data = {
    name: "Alfred Bryant",
    email: "adrain.nader@yahoo.com",
    photo: "https://i.pravatar.cc/150?img=12",
    topSkills: ["Skill 1", "Skill 2", "Skill 3"],
    recentActivities: [
      {
        text: "Your application has been accepted by 3 schools",
        type: "success"
      },
      {
        text: "You have an interview at 1 pm today",
        type: "error"
      },
      {
        text: "You have an interview at 1 pm today",
        type: "error"
      }
    ]
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 w-80">
      {/* Profile Photo & Info */}
      <div className="flex flex-col items-center">
        <div className="w-44 h-44 rounded-full border-4 border-green-400 overflow-hidden mb-3">
          <img
            src={data.photo}
            alt={data.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-lg font-semibold">{data.name}</h2>
        <p className="text-sm text-gray-500">{data.email}</p>
      </div>

      {/* Top Skills */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Top Skills</h3>
        <div className="space-y-2">
          {data.topSkills.map((skill, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded border"
            >
              <FaLightbulb className="text-yellow-500" />
              <span className="text-sm text-gray-800">{skill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-gray-700">Recent Activities</h3>
          <a href="#" className="text-green-600 text-xs font-medium">
            View All
          </a>
        </div>

        <div className="space-y-2">
          {data.recentActivities.map((activity, i) => (
            <div
              key={i}
              className="flex items-start gap-2 bg-gray-50 px-3 py-2 rounded border"
            >
              {activity.type === "success" ? (
                <FaCheckCircle className="text-green-500 mt-0.5" />
              ) : (
                <FaTimesCircle className="text-red-500 mt-0.5" />
              )}
              <p className="text-sm text-gray-800 leading-snug">{activity.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
