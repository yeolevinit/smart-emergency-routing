import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-obsidian-900 bg-grid-pattern relative overflow-x-hidden">
            {/* Background ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-accent/5 rounded-full blur-[150px] pointer-events-none" />

            <Navbar />

            {/* The main content area grows to push the footer down */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default Layout;