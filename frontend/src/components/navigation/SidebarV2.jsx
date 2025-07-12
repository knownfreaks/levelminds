import React, { useState, useRef, useEffect } from "react";
import { LayoutDashboard, User, Settings, Bell, Menu } from "lucide-react";
import logo from "../../assets/logo.png";
import { Power } from "lucide-react";

const navItems = [
  { id: 1, icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { id: 2, icon: <User size={20} />, label: "Profile" },
  { id: 3, icon: <Settings size={20} />, label: "Settings" },
  { id: 4, icon: <Bell size={20} />, label: "Notifications" },
];

export default function SidebarV2({ collapsed, active, setActive }) {
  const indicatorRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const activeItem = itemRefs.current[active];
    if (activeItem && indicatorRef.current) {
      indicatorRef.current.style.top = `${activeItem.offsetTop}px`;
      indicatorRef.current.style.height = `${activeItem.offsetHeight}px`;
    }
  }, [active, collapsed]);

  return (
    <div
      className={`h-screen bg-white border-r transition-all duration-300 flex flex-col relative ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="LevelMinds Logo" className="w-6 h-6" />
          {!collapsed && (
            <span className="text-lg font-bold whitespace-nowrap">
              LevelMinds
            </span>
          )}
        </div>
      </div>
      {/* Active Indicator */}
      <span
        ref={indicatorRef}
        className="absolute left-0 w-1 bg-green-500 rounded-r-lg transition-all duration-300"
      />

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2 mt-4">
        {navItems.map((item) => (
          <div
            key={item.id}
            ref={(el) => (itemRefs.current[item.id] = el)}
            onClick={() => setActive(item.id)}
            className={`relative flex items-center gap-3 cursor-pointer rounded-md px-3 py-2 transition-all group ${
              active === item.id
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            {!collapsed && (
              <span className="text-sm font-medium whitespace-nowrap">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div
          className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-md transition-all
      text-gray-600 hover:bg-gray-100`}
        >
          <Power size={20} />
          {!collapsed && <span className="text-sm">Logout</span>}
        </div>
      </div>
    </div>
  );
}
