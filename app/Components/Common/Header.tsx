'use client'
import React from 'react';
import { useAuth } from '../../Context/AuthContext';
import { FiMenu, FiUser } from 'react-icons/fi';
import Image from 'next/image';

export default function Header({ toggleSidebar, isSidebarOpen }: { toggleSidebar: () => void, isSidebarOpen: boolean }) {
    const { user } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    return (
        <header className="w-full flex items-center justify-between px-5">
            {/* Hamburger Button for Mobile */}
            <div className="flex items-center gap-3">
                <button className="md:hidden text-2xl" onClick={toggleSidebar}>
                    <FiMenu />
                </button>
                <Image width={40} height={40} src={'/images/icon.png'} alt='icon' />
            </div>

            {/* Profile Section */}
            <div className="relative">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center">
                    <FiUser className="text-xl text-black" />
                </button>
                {isProfileOpen && (
                    <div className="absolute top-10 right-0 w-48 bg-white text-black rounded-md shadow-lg p-2">
                        <p className="text-center font-bold">{user?.name}</p>
                        <p className="text-sm text-center text-gray-500">{user?.email}</p>
                    </div>
                )}
            </div>
        </header>
    );
}
