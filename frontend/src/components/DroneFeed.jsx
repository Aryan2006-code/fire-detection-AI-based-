import React, { useState, useEffect } from 'react';
import { Crosshair, AlertTriangle, Battery, Signal, Thermometer } from 'lucide-react';

const DroneFeed = ({ drone, detectionData }) => {
    const [showHud, setShowHud] = useState(true);
    const [thermalMode, setThermalMode] = useState(drone?.type === 'THERMAL');
    const [isRecording, setIsRecording] = useState(false);

    // Dynamic style based on drone type to simulate different feeds
    // since image generation is currently unavailable.
    let feedFilter = "";

    if (drone?.type === 'THERMAL' || thermalMode) {
        // Purple/Orange Thermal Look
        feedFilter = "contrast(1.2) sepia(100%) hue-rotate(190deg) saturate(150%)";
    } else if (drone?.type === 'RELAY') {
        // Green/Night Vision Look
        feedFilter = "grayscale(100%) sepia(100%) hue-rotate(90deg) brightness(0.9)";
    }

    // Fallback to local asset
    const feedImage = "/drone_feed.png";

    return (
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-4 h-full flex flex-col relative group overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-2 z-10 relative">
                <h3 className="text-white font-mono flex items-center gap-2 text-xs md:text-sm">
                    {drone?.type === 'THERMAL' ? <Thermometer className="w-4 h-4 text-purple-400" /> : <Crosshair className="w-4 h-4 text-cyan-400" />}
                    {drone?.id || "DRONE-FEED"}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                        <Battery size={10} /> {Math.round(drone?.battery || 88)}%
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse">
                        LIVE
                    </span>
                </div>
            </div>

            {/* Video Area */}
            <div className={`relative flex-1 rounded-lg overflow-hidden border border-white/10 bg-black`}>
                <img
                    src={feedImage}
                    alt="Drone View"
                    className="w-full h-full object-cover opacity-90 transition-all duration-500"
                    style={{ filter: feedFilter }}
                />

                {/* HUD Overlay */}
                {showHud && (
                    <div className="absolute inset-0 p-4 pointer-events-none">
                        <div className="absolute top-2 left-2 border-l border-t border-cyan-500 w-4 h-4 opacity-50"></div>
                        <div className="absolute top-2 right-2 border-r border-t border-cyan-500 w-4 h-4 opacity-50"></div>
                        <div className="absolute bottom-2 left-2 border-l border-b border-cyan-500 w-4 h-4 opacity-50"></div>
                        <div className="absolute bottom-2 right-2 border-r border-b border-cyan-500 w-4 h-4 opacity-50"></div>

                        <div className="absolute bottom-4 left-4 text-cyan-500/60 font-mono text-[10px]">
                            LAT: {drone?.lat?.toFixed(4) || "0.0000"} <br />
                            LNG: {drone?.lng?.toFixed(4) || "0.0000"}
                        </div>
                    </div>
                )}

                {/* Mock Detection Box */}
                {detectionData?.detected && detectionData?.confidence > 0.8 && (
                    <div
                        className="absolute border border-red-500 bg-red-500/10 animate-pulse"
                        style={{
                            left: '40%', top: '40%', width: '20%', height: '20%'
                        }}
                    >
                        <div className="absolute -top-5 left-0 bg-red-600 text-white text-[10px] px-1 rounded flex items-center gap-1">
                            <AlertTriangle size={8} /> FIRE
                        </div>
                    </div>
                )}
            </div>

            {/* Hover Controls */}
            <div className="absolute bottom-4 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 flex gap-1 bg-gradient-to-t from-black/80 to-transparent">
                <button onClick={() => setShowHud(!showHud)} className="flex-1 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-white rounded">HUD</button>
                <button onClick={() => setThermalMode(!thermalMode)} className="flex-1 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-white rounded">THERMAL</button>
                <button onClick={() => setIsRecording(!isRecording)} className={`flex-1 py-1 text-[10px] rounded text-white ${isRecording ? 'bg-red-600' : 'bg-slate-800 hover:bg-slate-700'}`}>REC</button>
            </div>
        </div>
    );
};

export default DroneFeed;
