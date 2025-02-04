'use client';

import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    // Don't render the layout for /login and /register
    if (pathname === '/login' || pathname === '/register') {
        return <>{children}</>;
    }

    return (
        <div className="w-[100dvw] h-[100dvh] flex">
            {/* Sidebar */}
            <div className={`fixed md:static h-full bg-gray-900 text-white transition-transform ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'} md:w-64 md:translate-x-0 z-50`}>
                <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-col transition-all duration-300">
                {/* Header */}
                <div className=" z-10 w-full h-16 flex items-center bg-white ">
                    <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                </div>

                {/* Page Content */}
                <main className="flex-1 bg-gray-100 p-2 md:p-5 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
