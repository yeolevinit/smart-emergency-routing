import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-obsidian-900 bg-grid-pattern flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-alert-red/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-10 max-w-lg w-full text-center relative z-10 border-alert-red/30 shadow-[0_0_40px_rgba(239,68,68,0.15)]"
            >
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex justify-center mb-6"
                >
                    <div className="w-20 h-20 bg-alert-red/10 rounded-full flex items-center justify-center border border-alert-red/30">
                        <ShieldAlert className="w-10 h-10 text-alert-red" />
                    </div>
                </motion.div>

                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">ERROR 404</h1>
                <h2 className="text-lg text-alert-red uppercase tracking-widest font-semibold mb-6">Sector Not Found</h2>

                <p className="text-neutral-400 mb-8 text-sm leading-relaxed">
                    Clearance denied. The navigational grid sector you are attempting to access does not exist or has been redacted from the active database.
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-obsidian-800 border border-obsidian-600 hover:border-emerald-accent hover:text-emerald-accent text-neutral-300 rounded-lg transition-all duration-300 font-semibold tracking-wide"
                >
                    <ArrowLeft className="w-5 h-5" />
                    RETURN TO COMMAND CENTER
                </button>
            </motion.div>
        </div>
    );
};

export default NotFound;