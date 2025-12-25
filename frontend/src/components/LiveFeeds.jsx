import React from 'react';
import DroneFeed from './DroneFeed';
import { SignalHigh, WifiOff } from 'lucide-react';

const LiveFeeds = ({ detectionData, drones = [] }) => {
    // Fallback if no drones connected yet
    const activeDrones = drones.length > 0 ? drones : [
        { id: "SEARCHING...", type: "VISUAL", battery: 0, status: "CONNECTING", feed_type: "none" }
    ];

    return (
        <div className="h-full flex flex-col p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <SignalHigh className="text-cyan-400" /> MISSION CONTROL LIVE FEEDS
                </h2>
                <div className="text-xs text-gray-400 font-mono">
                    ACTIVE UPLINKS: <span className="text-cyan-400 font-bold">{drones.length}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 h-full overflow-y-auto pb-4 pr-1 custom-scrollbar">
                {activeDrones.map((drone, idx) => (
                    <div key={idx} className="h-80 xl:h-96">
                        {drone.status === 'CONNECTING' ? (
                            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl h-full flex flex-col items-center justify-center animate-pulse">
                                <WifiOff className="w-12 h-12 text-gray-600 mb-2" />
                                <div className="text-gray-500 font-mono">ESTABLISHING UPLINK...</div>
                            </div>
                        ) : (
                            <DroneFeed
                                drone={drone}
                                // Only pass detection data to the first visual drone for demo
                                detectionData={idx === 0 ? detectionData : null}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveFeeds;
