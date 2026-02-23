import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Activity, Navigation2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import apiClient from '../api/client';
import { cn } from '../utils/cn';
import MapVisualizer from './MapVisualizer';
import CapacitySimulator from './CapacitySimulator';

const Dashboard = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [routeData, setRouteData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch valid starting nodes when the dashboard loads
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await apiClient.get('/locations');
                setLocations(response.data.data);
            } catch (err) {
                console.error("Failed to fetch locations", err);
                setError("CRITICAL: Unable to synchronize map data with server.");
            }
        };
        fetchLocations();
    }, []);

    const handleOptimize = async () => {
        if (!selectedLocation) {
            setError("Please select an ambulance sector first.");
            return;
        }

        setIsLoading(true);
        setError('');
        setRouteData(null);

        try {
            const response = await apiClient.post('/optimize-route', {
                ambulance_location: selectedLocation
            });
            setRouteData(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || "Routing Engine Failure.");
        } finally {
            setIsLoading(false);
        }
    };

    // Animation variants for staggered card loading
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
    };

    return (
        <div className="w-full h-full flex flex-col lg:flex-row gap-6">

            {/* LEFT PANEL: Control Terminal */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">

                {/* 1. Routing Controls */}
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-accent/5 rounded-full blur-[50px]" />

                    <div className="flex items-center gap-3 mb-6">
                        <Navigation2 className="text-emerald-accent w-6 h-6" />
                        <h2 className="text-xl font-bold text-white tracking-wide">Routing Controls</h2>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 border border-alert-red/50 bg-alert-red/10 text-alert-red rounded-lg text-sm flex items-start gap-2">
                            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-neutral-400 uppercase tracking-widest mb-2">
                                Select Ambulance Sector
                            </label>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-emerald-accent focus:ring-1 focus:ring-emerald-accent transition-all duration-300 cursor-pointer"
                            >
                                <option value="" disabled>-- SELECT ORIGIN NODE --</option>
                                {locations.map((loc) => (
                                    <option key={loc} value={loc}>Intersection {loc}</option>
                                ))}
                            </select>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleOptimize}
                            disabled={isLoading || locations.length === 0}
                            className={cn(
                                "w-full py-4 mt-4 rounded-xl font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-2",
                                isLoading || locations.length === 0
                                    ? "bg-obsidian-700 text-neutral-500 cursor-not-allowed"
                                    : "bg-emerald-accent text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                            )}
                        >
                            {isLoading ? (
                                <span className="animate-pulse">CALCULATING TRAJECTORY...</span>
                            ) : (
                                <>
                                    <Activity className="w-5 h-5" />
                                    ENGAGE ALGORITHM
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* 2. THE NEW REAL-TIME SIMULATOR */}
                <CapacitySimulator />

            </div>


            {/* RIGHT PANEL: Data Visualization */}
            <div className="w-full lg:w-2/3 glass-card rounded-2xl p-6 min-h-[500px] flex flex-col relative overflow-hidden">
                {!routeData && !isLoading && (
                    <div className="m-auto text-center flex flex-col items-center">
                        <MapPin className="w-16 h-16 text-obsidian-700 mb-4" />
                        <h3 className="text-xl text-neutral-500 font-semibold">Awaiting Dispatch Orders</h3>
                        <p className="text-neutral-600 mt-2 max-w-sm">Select an origin point and engage the algorithm to view optimized hospital routes.</p>
                    </div>
                )}

                {isLoading && (
                    <div className="m-auto flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-obsidian-700 border-t-emerald-accent rounded-full animate-spin mb-4" />
                        <p className="text-emerald-accent animate-pulse tracking-widest text-sm">PROCESSING DIJKSTRA GRAPH...</p>
                    </div>
                )}

                <AnimatePresence>
                    {routeData && !isLoading && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="w-full h-full flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-8 border-b border-obsidian-700 pb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Optimal Target Locked</h2>
                                    <p className="text-sm text-emerald-accent tracking-widest uppercase mt-1">Route Authorized</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-neutral-500 uppercase">Target Facility</p>
                                    <p className="text-xl font-bold text-white">{routeData.optimal_hospital.name}</p>
                                </div>
                            </div>

                            {/* Metric Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <motion.div variants={cardVariants} className="bg-obsidian-900 border border-obsidian-700 p-5 rounded-xl flex flex-col items-center text-center">
                                    <MapPin className="text-brand-blue w-6 h-6 mb-2" />
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Travel Time</p>
                                    <p className="text-2xl font-bold text-white">{routeData.metrics.travel_time_mins} <span className="text-sm font-normal text-neutral-400">min</span></p>
                                </motion.div>

                                <motion.div variants={cardVariants} className="bg-obsidian-900 border border-obsidian-700 p-5 rounded-xl flex flex-col items-center text-center">
                                    <Clock className="text-alert-red w-6 h-6 mb-2" />
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Est. Wait Time</p>
                                    <p className="text-2xl font-bold text-white">{routeData.metrics.waiting_time_mins} <span className="text-sm font-normal text-neutral-400">min</span></p>
                                </motion.div>

                                <motion.div variants={cardVariants} className="bg-emerald-accent/10 border border-emerald-accent/30 p-5 rounded-xl flex flex-col items-center text-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                    <CheckCircle2 className="text-emerald-accent w-6 h-6 mb-2" />
                                    <p className="text-xs text-emerald-accent uppercase tracking-wider mb-1 font-semibold">Total Response</p>
                                    <p className="text-3xl font-bold text-white">{routeData.metrics.total_response_time_mins} <span className="text-sm font-normal text-neutral-400">min</span></p>
                                </motion.div>
                            </div>

                            {/* Route Path Visualizer (Text) */}
                            <motion.div variants={cardVariants} className="bg-obsidian-900 border border-obsidian-700 rounded-xl p-5 mb-4">
                                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-4">Navigational Sequence</p>
                                <div className="flex flex-wrap items-center gap-3">
                                    {routeData.route_nodes.map((node, index) => (
                                        <React.Fragment key={index}>
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border",
                                                index === 0 ? "bg-obsidian-800 border-neutral-500 text-white" :
                                                    index === routeData.route_nodes.length - 1 ? "bg-emerald-accent/20 border-emerald-accent text-emerald-accent shadow-[0_0_10px_rgba(16,185,129,0.3)]" :
                                                        "bg-obsidian-800 border-obsidian-600 text-neutral-300"
                                            )}>
                                                {node}
                                            </div>
                                            {index < routeData.route_nodes.length - 1 && (
                                                <div className="h-0.5 w-8 bg-obsidian-600 relative">
                                                    <motion.div
                                                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-accent shadow-[0_0_5px_rgba(16,185,129,0.8)]"
                                                        animate={{ left: ["0%", "100%"] }}
                                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                    />
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </motion.div>

                            {/* THE NEW TACTICAL RADAR MAP */}
                            <motion.div variants={cardVariants} className="flex-grow w-full h-[400px]">
                                <MapVisualizer activeRoute={routeData.route_nodes} />
                            </motion.div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Dashboard;