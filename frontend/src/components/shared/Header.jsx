import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDisplayName = () => {
        if (!user) return '';
        if (user.role === 'admin') return 'Administrator';
        return user.profile?.first_name || user.profile?.school_name || user.email;
    };

    return (
        <header className="flex items-center justify-end h-16 px-4 sm:px-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <div className="flex items-center gap-4">
                <button className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                    <Bell size={20} />
                    {/* Add a dot for unread notifications */}
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                </button>
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{getDisplayName()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                </div>
                <button onClick={handleLogout} className="text-gray-500 hover:text-destructive dark:text-gray-400 dark:hover:text-destructive">
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};

export default Header;