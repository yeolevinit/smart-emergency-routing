import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { cn } from '../utils/cn';

const Register = () => {
    const { registerUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        // Frontend Validation
        if (formData.password !== formData.confirmPassword) {
            return setError("Security protocols failed: Passwords do not match.");
        }
        if (formData.password.length < 6) {
            return setError("Clearance denied: Password must be at least 6 characters.");
        }

        setIsLoading(true);

        const result = await registerUser(formData.username, formData.email, formData.password);
        if (result.success) {
            setSuccessMsg("System Access Granted. Redirecting to login terminal...");
            setTimeout(() => {
                navigate('/login');
            }, 2000);
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
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
                        className="w-16 h-16 rounded-full bg-obsidian-800 border border-obsidian-700 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    >
                        <UserPlus className="text-emerald-accent w-8 h-8" />
                    </motion.div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Dispatcher Enrollment</h1>
                    <p className="text-sm text-neutral-400 mt-1 uppercase tracking-widest">S.E.R.S. Network</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 border border-alert-red/50 bg-alert-red/10 text-alert-red rounded-lg text-sm text-center">
                            {error}
                        </motion.div>
                    )}
                    {successMsg && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 border border-emerald-accent/50 bg-emerald-accent/10 text-emerald-accent rounded-lg text-sm text-center">
                            {successMsg}
                        </motion.div>
                    )}

                    <input type="text" required name="username" value={formData.username} onChange={handleChange} placeholder="Dispatcher Callsign (Username)" className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-accent focus:ring-1 focus:ring-emerald-accent transition-all duration-300" />
                    <input type="email" required name="email" value={formData.email} onChange={handleChange} placeholder="Official Email" className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-accent focus:ring-1 focus:ring-emerald-accent transition-all duration-300" />
                    <input type="password" required name="password" value={formData.password} onChange={handleChange} placeholder="Create Access Code" className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-accent focus:ring-1 focus:ring-emerald-accent transition-all duration-300" />
                    <input type="password" required name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Verify Access Code" className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-accent focus:ring-1 focus:ring-emerald-accent transition-all duration-300" />

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isLoading} type="submit" className={cn("w-full py-3 mt-2 rounded-lg font-semibold tracking-wide transition-all duration-300", isLoading ? "bg-obsidian-700 text-neutral-500 cursor-not-allowed" : "bg-emerald-accent text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]")}>
                        {isLoading ? "ENROLLING..." : "REGISTER CLEARANCE"}
                    </motion.button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-neutral-400 text-sm">
                        Already have clearance? <Link to="/login" className="text-emerald-accent hover:underline hover:text-emerald-400 transition-colors">Initialize Login</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;