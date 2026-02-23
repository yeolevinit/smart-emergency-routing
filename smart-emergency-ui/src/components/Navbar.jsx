import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Activity, LogOut, ShieldCheck, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { cn } from '../utils/cn';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="sticky top-0 z-50 w-full px-6 py-4"
        >
            <div className="glass-card max-w-7xl mx-auto rounded-xl px-6 py-3 flex items-center justify-between">

                {/* Brand / Logo Area */}
                <div className="flex items-center space-x-3">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-obsidian-800 border border-obsidian-700 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                        <Activity className="text-emerald-accent w-6 h-6" />
                        {/* Ping animation for "Live" status */}
                        <span className="absolute top-0 right-0 flex h-2.5 w-2.5 -mt-1 -mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-accent"></span>
                        </span>
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg tracking-wide">S.E.R.S.</h1>
                        <p className="text-[10px] text-emerald-accent uppercase tracking-widest leading-none">Smart Emergency Routing</p>
                    </div>
                </div>

                {/* Dispatcher Info & Controls */}
                <div className="flex items-center space-x-6">
                    {/* System Status */}
                    <div className="hidden md:flex items-center space-x-2 border-r border-obsidian-700 pr-6">
                        <ShieldCheck className="w-4 h-4 text-emerald-accent" />
                        <span className="text-xs text-neutral-400 uppercase tracking-wider">Network Secure</span>
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center space-x-3">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-semibold text-white">{user?.username || "Dispatcher"}</p>
                            <p className="text-xs text-neutral-500 uppercase">Clearance: Level 1</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-obsidian-800 border border-obsidian-700 flex items-center justify-center">
                            <User className="w-4 h-4 text-neutral-400" />
                        </div>
                    </div>

                    {/* Logout Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={logout}
                        className="p-2 rounded-lg text-neutral-400 hover:text-alert-red hover:bg-alert-red/10 border border-transparent hover:border-alert-red/30 transition-all duration-300"
                        title="Disconnect Terminal"
                    >
                        <LogOut className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;