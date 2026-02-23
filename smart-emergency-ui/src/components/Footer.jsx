import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full border-t border-obsidian-700 bg-obsidian-900/80 backdrop-blur-sm py-4 mt-auto">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between">
                <p className="text-xs text-neutral-500 tracking-wider">
                    &copy; {new Date().getFullYear()} S.E.R.S. NETWORK. ALL RIGHTS RESERVED.
                </p>
                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                    <span className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-accent shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
                        <span className="text-xs text-neutral-400 uppercase">API Online</span>
                    </span>
                    <span className="text-obsidian-700">|</span>
                    <span className="text-xs text-neutral-400 uppercase">v2.0.4-Stable</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;