import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, Handle, Position, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cn } from '../utils/cn';

// ==========================================
// 1. THE CUSTOM TACTICAL NODE
// This replaces the ugly default boxes with glowing radar blips
// ==========================================
const TacticalNode = ({ data }) => {
    const { label, isActive, isHospital } = data;

    return (
        <div className={cn(
            "relative flex flex-col items-center justify-center rounded-full border-2 transition-all duration-500 backdrop-blur-md",
            isHospital ? "w-16 h-16" : "w-12 h-12",
            isActive && isHospital ? "border-emerald-accent bg-emerald-accent/20 shadow-[0_0_30px_rgba(16,185,129,0.6)] z-50" :
                isActive ? "border-emerald-accent bg-emerald-accent/20 shadow-[0_0_20px_rgba(16,185,129,0.5)] z-50" :
                    isHospital ? "border-alert-red/80 bg-alert-red/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]" :
                        "border-obsidian-600 bg-obsidian-800/80 shadow-lg"
        )}>
            {/* Radar Ping Animation for the Final Target Hospital */}
            {isActive && isHospital && (
                <div className="absolute inset-0 rounded-full border-2 border-emerald-accent animate-ping opacity-75"></div>
            )}

            {/* Invisible handles to allow smooth edge connections from any angle */}
            <Handle type="target" position={Position.Top} className="opacity-0" />
            <Handle type="source" position={Position.Bottom} className="opacity-0" />
            <Handle type="target" position={Position.Left} className="opacity-0" />
            <Handle type="source" position={Position.Right} className="opacity-0" />

            <div className="text-center">
                {isHospital && <div className={cn("text-[8px] font-bold uppercase tracking-widest mb-0.5", isActive ? "text-emerald-accent" : "text-alert-red")}>MED</div>}
                <span className={cn(
                    "font-bold font-mono text-sm",
                    isActive ? "text-emerald-accent" : "text-neutral-300"
                )}>{label}</span>
            </div>
        </div>
    );
};

// Register our custom node with the React Flow engine
const nodeTypes = { tactical: TacticalNode };

// ==========================================
// 2. THE GRAPH DATA
// Spaced out mathematically for a beautiful layout
// ==========================================
const initialNodes = [
    { id: 'A', position: { x: 250, y: 150 }, data: { label: 'A' } },
    { id: 'B', position: { x: 450, y: 50 }, data: { label: 'B' } },
    { id: 'C', position: { x: 450, y: 250 }, data: { label: 'C' } },
    { id: 'D', position: { x: 650, y: 150 }, data: { label: 'D' } },
    { id: 'E', position: { x: 650, y: 350 }, data: { label: 'E' } },
    { id: 'F', position: { x: 850, y: 200 }, data: { label: 'F' } },
    { id: 'H1', position: { x: 450, y: -80 }, data: { label: 'H1' } },
    { id: 'H2', position: { x: 850, y: 400 }, data: { label: 'H2' } },
    { id: 'H3', position: { x: 1050, y: 200 }, data: { label: 'H3' } },
    { id: 'H4', position: { x: 50, y: 300 }, data: { label: 'H4' } },
];

const initialEdges = [
    { id: 'e-A-B', source: 'A', target: 'B', label: '5m' },
    { id: 'e-A-C', source: 'A', target: 'C', label: '8m' },
    { id: 'e-B-D', source: 'B', target: 'D', label: '3m' },
    { id: 'e-C-D', source: 'C', target: 'D', label: '4m' },
    { id: 'e-C-E', source: 'C', target: 'E', label: '6m' },
    { id: 'e-D-F', source: 'D', target: 'F', label: '7m' },
    { id: 'e-E-F', source: 'E', target: 'F', label: '2m' },
    { id: 'e-B-H1', source: 'B', target: 'H1', label: '2m' },
    { id: 'e-E-H2', source: 'E', target: 'H2', label: '4m' },
    { id: 'e-F-H3', source: 'F', target: 'H3', label: '3m' },
    { id: 'e-A-H4', source: 'A', target: 'H4', label: '12m' },
];

// ==========================================
// 3. THE MAIN COMPONENT
// ==========================================
const MapVisualizer = ({ activeRoute = [] }) => {

    // Inject dynamic state (glowing effects) into our nodes
    const nodes = useMemo(() => {
        return initialNodes.map((node) => ({
            ...node,
            type: 'tactical', // Use our custom design!
            data: {
                ...node.data,
                isActive: activeRoute.includes(node.id),
                isHospital: node.id.startsWith('H')
            }
        }));
    }, [activeRoute]);

    // Inject dynamic state (flowing energy lines) into our edges
    const edges = useMemo(() => {
        const pathEdges = new Set();
        for (let i = 0; i < activeRoute.length - 1; i++) {
            pathEdges.add(`${activeRoute[i]}-${activeRoute[i + 1]}`);
            pathEdges.add(`${activeRoute[i + 1]}-${activeRoute[i]}`);
        }

        return initialEdges.map((edge) => {
            const isActive = pathEdges.has(`${edge.source}-${edge.target}`);
            return {
                ...edge,
                animated: isActive, // Creates the flowing dot animation
                style: {
                    stroke: isActive ? '#10b981' : '#262626',
                    strokeWidth: isActive ? 4 : 2,
                    filter: isActive ? 'drop-shadow(0 0 8px rgba(16,185,129,0.8))' : 'none',
                    transition: 'all 0.5s ease',
                },
                labelStyle: {
                    fill: isActive ? '#10b981' : '#d4d4d4',
                    fontWeight: 'bold',
                    fontSize: 12
                },
                labelBgStyle: {
                    fill: isActive ? '#050505' : '#1f2937',
                    fillOpacity: 0.8,
                },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: isActive ? '#10b981' : '#262626',
                },
            };
        });
    }, [activeRoute]);

    return (
        <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-obsidian-700 bg-obsidian-900 relative">

            {/* Scanning Radar Overlay Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.8)_100%)] pointer-events-none z-10" />

            <div className="absolute top-4 left-4 z-20 bg-obsidian-800/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-obsidian-700 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-accent animate-pulse shadow-[0_0_8px_#10b981]"></span>
                <span className="text-xs text-emerald-accent tracking-widest uppercase font-bold">Live Sector Radar</span>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                attributionPosition="bottom-right"
                className="z-0"
            >
                {/* High-Tech Radar Background Grid */}
                <Background color="#10b981" gap={30} size={1} opacity={0.05} />
                <Controls className="bg-obsidian-800 border-obsidian-700 fill-white z-20" />
            </ReactFlow>
        </div>
    );
};

export default MapVisualizer;