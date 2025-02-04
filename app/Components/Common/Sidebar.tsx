'use client'
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/Context/AuthContext';
import { FiUsers, FiList, FiLogOut, FiX } from 'react-icons/fi';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isSidebarOpen, toggleSidebar }: { isSidebarOpen: boolean, toggleSidebar: () => void }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    // Helper function to determine if the link is active
    const isActive = (path: string) => pathname === path ? 'bg-gray-700' : '';

    return (
        <aside
            className={`h-full p-5 space-y-6 fixed md:static inset-y-0 left-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            {/* Close Button for Mobile */}
            <button
                className="md:hidden absolute top-4 right-4 text-white"
                onClick={toggleSidebar}
            >
                <FiX size={24} />
            </button>

            {/* Welcome Message */}
            <h2 className="text-xl font-bold pt-3">Welcome, {user?.name || 'User'}</h2>

            {/* Navigation Links */}
            <nav className="space-y-4">
                <Link
                    href="/"
                    className={`block p-2 rounded ${isActive('/')} hover:bg-gray-700 flex items-center`}
                >
                    <FiUsers className="inline-block mr-2" />
                    Dashboard
                </Link>
                {
                    user?.type === 'admin' &&
                    <Link
                        href="/users"
                        className={`block p-2 rounded ${isActive('/users')} hover:bg-gray-700 flex items-center`}
                    >
                        <FiUsers className="inline-block mr-2" />
                        Users
                    </Link>
                }
                <Link
                    href="/tasks"
                    className={`block p-2 rounded ${isActive('/tasks')} hover:bg-gray-700 flex items-center`}
                >
                    <FiList className="inline-block mr-2" />
                    Tasks
                </Link>
                <button
                    onClick={logout}
                    className={`w-full p-2 rounded hover:bg-gray-700 flex items-center`}
                >
                    <FiLogOut className="inline-block mr-2" />
                    Logout
                </button>
            </nav>
        </aside>
    );
}
