import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Briefcase, User, Calendar, Building, PlusCircle } from 'lucide-react';
import logo from '@/assets/logo.png';

const studentNavItems = [
  { label: "Dashboard", icon: <LayoutDashboard size={20} />, link: "/student/dashboard" },
  { label: "Job Opportunities", icon: <Briefcase size={20} />, link: "/student/jobs" },
  { label: "My Profile", icon: <User size={20} />, link: "/student/profile" },
  { label: "My Schedule", icon: <Calendar size={20} />, link: "/student/schedule" },
];

const schoolNavItems = [
  { label: "Dashboard", icon: <LayoutDashboard size={20} />, link: "/school/dashboard" },
  { label: "Job Postings", icon: <Building size={20} />, link: "/school/jobs" },
  { label: "Post a New Job", icon: <PlusCircle size={20} />, link: "/school/jobs/post" },
];

const SidebarLink = ({ to, icon, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
            isActive
                ? "bg-primary text-primary-foreground"
                : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
            }`
        }
    >
        {icon}
        <span>{children}</span>
    </NavLink>
);


const MainSidebar = () => {
    const { user } = useAuth();
    const navItems = user?.role === 'student' ? studentNavItems : schoolNavItems;

    return (
        <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
            <div className="flex items-center justify-center h-16 border-b dark:border-gray-700">
                 <img src={logo} alt="LevelMinds" className="h-8 w-auto" />
                 <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">LevelMinds</span>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <SidebarLink key={item.label} to={item.link} icon={item.icon}>
                        {item.label}
                    </SidebarLink>
                ))}
            </nav>
        </div>
    );
};

export default MainSidebar;