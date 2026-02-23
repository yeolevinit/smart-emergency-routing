import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ServerCrash, AlertTriangle } from 'lucide-react';
import apiClient from '../api/client';
import { cn } from '../utils/cn';

const CapacitySimulator = () => {
    const [hospitalId, setHospitalId] = useState('H4');
    const [occupancy, setOccupancy] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const hospitals = [
        { id: 'H1', name: 'H1: Central Med (Cap: 50)' },
        { id: 'H2', name: 'H2: City General (Cap: 100)' },
        { id: 'H3', name: 'H3: Northside Care (Cap: 30)' },
        { id: 'H4', name: 'H4: Southwest Clinic (Cap: 40)' }
    ];

    const handleOverride = async (e) => {
        e.preventDefault();
        if (occupancy === '' || occupancy < 0) {
            setStatus({ type: 'error', message: 'Enter a valid occupancy number.' });
            return;
        }

        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await apiClient.patch('/hospital/update-occupancy', {
                hospital_id: hospitalId,
                new_occupancy: parseInt(occupancy)
            });
            setStatus({ type: 'success', message: 'NETWORK UPDATED: Capacity successfully overridden.' });
            setOccupancy(''); // Clear input after success

            // Clear success message after 3 seconds
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Override failed.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden mt-6 border-alert-red/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-alert-red/5 rounded-full blur-[50px]" />

            <div className="flex items-center gap-3 mb-6">
                <ServerCrash className="text-alert-red w-6 h-6" />
                <h2 className="text-lg font-bold text-white tracking-wide">Network Override</h2>
            </div>

            <p className="text-xs text-neutral-400 mb-4 uppercase tracking-wider leading-relaxed">
                <AlertTriangle className="inline w-3 h-3 text-alert-red mr-1 mb-0.5" />
                Admin Use Only: Simulate real-time patient influx to test routing adaptability.
            </p>

            <form onSubmit={handleOverride} className="space-y-4">
                <div>
                    <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">Target Facility</label>
                    <select
                        value={hospitalId}
                        onChange={(e) => setHospitalId(e.target.value)}
                        className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-alert-red focus:ring-1 focus:ring-alert-red transition-all duration-300 cursor-pointer"
                    >
                        {hospitals.map((h) => (
                            <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">Force New Occupancy</label>
                    <input
                        type="number"
                        min="0"
                        value={occupancy}
                        onChange={(e) => setOccupancy(e.target.value)}
                        placeholder="E.g., 40 (Full Capacity)"
                        className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-alert-red focus:ring-1 focus:ring-alert-red transition-all duration-300"
                    />
                </div>

                {status.message && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "p-3 rounded-lg text-xs font-semibold tracking-wide text-center",
                            status.type === 'success' ? "bg-emerald-accent/10 text-emerald-accent border border-emerald-accent/30" : "bg-alert-red/10 text-alert-red border border-alert-red/30"
                        )}
                    >
                        {status.message}
                    </motion.div>
                )}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                        "w-full py-3 mt-2 rounded-xl font-bold tracking-widest transition-all duration-300",
                        isLoading
                            ? "bg-obsidian-800 text-neutral-500 cursor-not-allowed"
                            : "bg-transparent border border-alert-red text-alert-red hover:bg-alert-red hover:text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    )}
                >
                    {isLoading ? "OVERRIDING..." : "INJECT LIVE DATA"}
                </motion.button>
            </form>
        </div>
    );
};

export default CapacitySimulator;