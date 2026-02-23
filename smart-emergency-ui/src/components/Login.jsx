// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react'; // Medical/System icon
import { AuthContext } from '../context/AuthContext';
import { cn } from '../utils/cn';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(email, password);
        if (result.success) {
            window.location.href = '/'; // Redirect to dashboard
        } else {
            setError(result.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-obsidian-900 bg-grid-pattern flex items-center justify-center p-4 relative overflow-hidden">

            {/* Aceternity-style glowing orb in the background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="glass-card rounded-2xl w-full max-w-md p-8 relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 rounded-full bg-obsidian-800 border border-obsidian-700 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    >
                        <Activity className="text-emerald-accent w-8 h-8" />
                    </motion.div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">S.E.R.S. Terminal</h1>
                    <p className="text-sm text-neutral-400 mt-1 uppercase tracking-widest">Authorized Dispatch Only</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            className="p-3 border border-alert-red/50 bg-alert-red/10 text-alert-red rounded-lg text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <div className="relative group">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={cn(
                                    "w-full bg-obsidian-900 border border-obsidian-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500",
                                    "focus:outline-none focus:border-emerald-accent focus:ring-1 focus:ring-emerald-accent transition-all duration-300"
                                )}
                                placeholder="Dispatcher Email"
                            />
                        </div>
                        <div className="relative group">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={cn(
                                    "w-full bg-obsidian-900 border border-obsidian-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500",
                                    "focus:outline-none focus:border-emerald-accent focus:ring-1 focus:ring-emerald-accent transition-all duration-300"
                                )}
                                placeholder="Access Code"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        type="submit"
                        className={cn(
                            "w-full py-3 rounded-lg font-semibold tracking-wide transition-all duration-300",
                            isLoading
                                ? "bg-obsidian-700 text-neutral-500 cursor-not-allowed"
                                : "bg-emerald-accent text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                        )}
                    >
                        {isLoading ? "Authenticating..." : "INITIALIZE SYSTEM"}
                    </motion.button>
                </form>


            </motion.div>
        </div>
    );
};

export default Login;