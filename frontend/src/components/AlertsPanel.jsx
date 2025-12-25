import React, { useState } from 'react';
import { AlertCircle, Check, Flame, ChevronDown, ChevronUp, Wind, Activity, Clock, Send } from 'lucide-react';
import clsx from 'clsx';

const AlertsPanel = ({ alerts, onVerify }) => {
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-4 h-full overflow-hidden flex flex-col">
            <h3 className="text-white font-mono flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-red-500" />
                INTELLIGENT ALERT STREAM ({alerts.length})
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {alerts.length === 0 && (
                    <div className="text-center text-gray-500 py-10 flex flex-col items-center gap-2">
                        <Activity className="w-8 h-8 opacity-20" />
                        No active fire threats detected.
                    </div>
                )}

                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={clsx(
                            "rounded-lg border transition-all overflow-hidden",
                            alert.status === 'DETECTED'
                                ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40"
                                : "bg-green-500/5 border-green-500/20"
                        )}
                    >
                        {/* Header Summary */}
                        <div
                            className="p-3 cursor-pointer flex justify-between items-start"
                            onClick={() => toggleExpand(alert.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={clsx(
                                    "p-2 rounded-full",
                                    alert.severity === 'MEGA FIRE' ? "bg-purple-500/20 text-purple-500 animate-pulse" :
                                        alert.severity === 'SEVERE' ? "bg-red-500/20 text-red-500" : "bg-orange-500/20 text-orange-500"
                                )}>
                                    <Flame className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                        {alert.id}
                                        <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-gray-400 font-mono">
                                            {alert.timestamp.split('T')[1].split('.')[0]}
                                        </span>
                                    </h4>
                                    <div className="text-xs text-gray-400 font-mono mt-0.5">
                                        Severity: <span className={clsx(
                                            "font-bold",
                                            alert.severity === 'MEGA FIRE' ? "text-purple-400" :
                                                alert.severity === 'SEVERE' ? "text-red-400" : "text-orange-400"
                                        )}>{alert.severity}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <div className="text-xs text-gray-500">Confidence</div>
                                    <div className="text-sm font-bold text-white">{alert.confidence}%</div>
                                </div>
                                {expandedId === alert.id ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                            </div>
                        </div>

                        {/* Expanded Details (XAI & Timeline) */}
                        {expandedId === alert.id && (
                            <div className="px-3 pb-3 pt-0 border-t border-white/5 bg-black/20">

                                {/* AI Reasoning Panel */}
                                <div className="mt-3">
                                    <h5 className="text-[10px] uppercase font-bold text-cyan-500 mb-2 flex items-center gap-1">
                                        <Activity size={12} /> AI Analysis Factors
                                    </h5>
                                    <div className="space-y-2">
                                        {alert.factors && Object.entries(alert.factors).map(([key, value]) => (
                                            <div key={key}>
                                                <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
                                                    <span>{key}</span>
                                                    <span>{value}%</span>
                                                </div>
                                                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                                        style={{ width: `${value}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Incident Timeline */}
                                <div className="mt-4">
                                    <h5 className="text-[10px] uppercase font-bold text-yellow-500 mb-2 flex items-center gap-1">
                                        <Clock size={12} /> Incident Timeline
                                    </h5>
                                    <div className="space-y-3 relative pl-2 border-l border-white/10 ml-1">
                                        {alert.timeline && alert.timeline.map((event, idx) => (
                                            <div key={idx} className="relative pl-4">
                                                <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-slate-600 border border-slate-900"></div>
                                                <div className="text-[10px] text-gray-500 font-mono">{event.time}</div>
                                                <div className="text-xs text-gray-300">{event.event}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 flex gap-2">
                                    {alert.status === 'DETECTED' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onVerify(alert.id); }}
                                            className="flex-1 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 py-2 rounded flex justify-center items-center gap-2 transition-colors"
                                        >
                                            <Check size={14} /> CONFIRM FIRE
                                        </button>
                                    )}
                                    <button className="flex-1 text-xs bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 py-2 rounded flex justify-center items-center gap-2 transition-colors">
                                        <Send size={14} /> DISPATCH DRONE
                                    </button>
                                </div>

                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlertsPanel;
