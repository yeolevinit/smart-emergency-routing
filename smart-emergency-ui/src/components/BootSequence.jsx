import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const BootSequence = () => {
    const [textIndex, setTextIndex] = useState(0);

    const bootLogs = [
        "INITIALIZING S.E.R.S. KERNEL...",
        "ESTABLISHING SECURE HANDSHAKE...",
        "VERIFYING DISPATCHER CLEARANCE (JWT)...",
        "CONNECTING TO MONGODB SATELLITE UPLINK...",
        "LOADING CITY NETWORK GRAPH...",
        "SYSTEM ONLINE. GRANTING ACCESS."
    ];

    useEffect(() => {
        // Cycle through the terminal logs rapidly
        if (textIndex < bootLogs.length - 1) {
            const timer = setTimeout(() => {
                setTextIndex(prev => prev + 1);
            }, 300); // 300ms per line
            return () => clearTimeout(timer);
        }
    }, [textIndex, bootLogs.length]);

    return (
        <div className="min-h-screen bg-obsidian-900 bg-grid-pattern flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono">
            {/* Background ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-accent/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-md w-full">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mb-8 p-4 rounded-full border border-dashed border-emerald-accent/50"
                >
                    <Activity className="w-8 h-8 text-emerald-accent" />
                </motion.div>

                <div className="w-full bg-obsidian-800/80 border border-obsidian-700 rounded-lg p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <div className="flex gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-alert-red/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-accent/80"></div>
                    </div>

                    <div className="space-y-2 h-40 overflow-hidden flex flex-col justify-end">
                        {bootLogs.slice(0, textIndex + 1).map((log, index) => (
                            <motion.p
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`text-sm ${index === textIndex ? 'text-emerald-accent font-bold' : 'text-neutral-500'}`}
                            >
                                {`> ${log}`}
                            </motion.p>
                        ))}
                        {textIndex < bootLogs.length - 1 && (
                            <motion.span
                                animate={{ opacity: [0, 1] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="w-2 h-4 bg-emerald-accent inline-block mt-1"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BootSequence;