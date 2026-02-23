import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// We map out the exact nodes from your Python backend onto a 2D plane
const initialNodes = [
    { id: 'A', position: { x: 250, y: 150 }, data: { label: 'Node A' }, type: 'default' },
    { id: 'B', position: { x: 400, y: 50 }, data: { label: 'Node B' } },
    { id: 'C', position: { x: 400, y: 250 }, data: { label: 'Node C' } },
    { id: 'D', position: { x: 600, y: 150 }, data: { label: 'Node D' } },
    { id: 'E', position: { x: 600, y: 300 }, data: { label: 'Node E' } },
    { id: 'F', position: { x: 800, y: 200 }, data: { label: 'Node F' } },
    // Hospitals (Positioned near their connected nodes)
    { id: 'H1', position: { x: 400, y: -50 }, data: { label: 'H1: Central Med' } },
    { id: 'H2', position: { x: 800, y: 350 }, data: { label: 'H2: City Gen' } },
    { id: 'H3', position: { x: 1000, y: 200 }, data: { label: 'H3: Northside' } },
    { id: 'H4', position: { x: 50, y: 250 }, data: { label: 'H4: SW Clinic' } },
];

// The exact roads and travel times from your backend
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

const MapVisualizer = ({ activeRoute = [] }) => {
    // Dynamically style the graph based on the optimal route chosen by the backend
    const nodes = useMemo(() => {
        return initialNodes.map((node) => {
            const isHospital = node.id.startsWith('H');
            const isActive = activeRoute.includes(node.id);

            return {
                ...node,
                style: {
                    background: isActive ? '#10b981' : (isHospital ? '#121212' : '#262626'),
                    color: isActive ? '#000' : '#fff',
                    border: `1px solid ${isActive ? '#10b981' : (isHospital ? '#ef4444' : '#404040')}`,
                    boxShadow: isActive ? '0 0 15px rgba(16, 185, 129, 0.6)' : 'none',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: 'bold',
                    width: 120,
                    textAlign: 'center',
                    transition: 'all 0.5s ease',
                },
            };
        });
    }, [activeRoute]);

    const edges = useMemo(() => {
        // Determine which edges make up the active path
        const pathEdges = new Set();
        for (let i = 0; i < activeRoute.length - 1; i++) {
            // Add both directions just in case
            pathEdges.add(`${activeRoute[i]}-${activeRoute[i + 1]}`);
            pathEdges.add(`${activeRoute[i + 1]}-${activeRoute[i]}`);
        }

        return initialEdges.map((edge) => {
            const isActive = pathEdges.has(`${edge.source}-${edge.target}`);

            return {
                ...edge,
                animated: isActive, // Creates a flowing energy animation along the route
                style: {
                    stroke: isActive ? '#10b981' : '#262626',
                    strokeWidth: isActive ? 4 : 2,
                    transition: 'stroke 0.5s ease',
                },
                labelStyle: { fill: isActive ? '#10b981' : '#666', fontWeight: 'bold' },
                labelBgStyle: { fill: '#050505' },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: isActive ? '#10b981' : '#262626',
                },
            };
        });
    }, [activeRoute]);

    return (
        <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-obsidian-700 bg-obsidian-900 relative">
            <div className="absolute top-4 left-4 z-10 bg-obsidian-800/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-obsidian-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-accent animate-pulse"></span>
                <span className="text-xs text-emerald-accent tracking-widest uppercase font-bold">Live Sector Map</span>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                attributionPosition="bottom-right"
            >
                <Background color="#262626" gap={20} size={1} />
                <Controls className="bg-obsidian-800 border-obsidian-700 fill-white" />
            </ReactFlow>
        </div>
    );
};

export default MapVisualizer;