import { useState } from "react";
import {
  FaPowerOff,
  FaBriefcase,
  FaGraduationCap,
  FaCalendarAlt,
  FaUser,
  FaThLarge,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from "../../assets/SidebarMenu/logo.svg";

const navItems = [
  { label: "Dashboard", icon: <FaThLarge />, link: "/teacher/dashboard" },
  { label: "Job Opportunities", icon: <FaBriefcase />, link: "/teacher/jobs" },
  {
    label: "Skills & Qualifications",
    icon: <FaGraduationCap />,
    link: "/teacher/skills",
  },
  { label: "Schedule", icon: <FaCalendarAlt />, link: "/teacher/schedule" },
  { label: "My Portfolio", icon: <FaUser />, link: "/teacher/portfolio" },
];

const Sidebar = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`h-screen bg-white border-r shadow-sm flex flex-col justify-between transition-all duration-300 ${
        hovered ? "w-64" : "w-16"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top Logo Section */}
      <div>
        <div className="flex items-center gap-2 p-4">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          {hovered && (
            <span className="text-lg font-semibold text-gray-800">
              LevelMinds
            </span>
          )}
        </div>

        {/* Nav Items */}
        <ul className="mt-4 space-y-1">
          {navItems.map((item, idx) => (
            <li key={idx}>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-md transition cursor-pointer ${
                    isActive
                      ? "bg-black text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                {hovered && (
                  <span className="text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Section */}
      <div className="p-4">
        <div className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
          <FaPowerOff className="text-xl" />
          {hovered && <span className="text-sm">Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
