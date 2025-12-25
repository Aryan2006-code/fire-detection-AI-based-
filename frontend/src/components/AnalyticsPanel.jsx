import React from 'react';
import { BarChart3, Download, TrendingDown, Clock, ShieldCheck, Map } from 'lucide-react';

const AnalyticsPanel = () => {
    // Mock Data for Analytics
    const stats = [
        { label: "Avg Detection Time", value: "48s", change: "-12%", icon: Clock, color: "text-cyan-400" },
        { label: "Area Saved (Est.)", value: "1,240 ha", change: "+15%", icon: ShieldCheck, color: "text-green-400" },
        { label: "Response Efficiency", value: "94%", change: "+5%", icon: TrendingDown, color: "text-purple-400" },
    ];

    const monthlyData = [
        { month: 'Jan', fires: 12, prevented: 10 },
        { month: 'Feb', fires: 19, prevented: 15 },
        { month: 'Mar', fires: 35, prevented: 32 },
        { month: 'Apr', fires: 48, prevented: 45 },
        { month: 'May', fires: 62, prevented: 58 },
    ];

    return (
        <div className="p-8 h-full overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-cyan-400" />
                        Post-Fire Analytics
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Performance metrics and incident impact analysis</p>
                </div>
                <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-white/10 transition-colors">
                    <Download size={16} /> Export Report (PDF)
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg bg-slate-800 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-xs font-mono text-green-400 bg-green-500/10 px-2 py-1 rounded">
                                {stat.change}
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Monthly Trend */}
                <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Fire Prevention Efficiency</h3>
                    <div className="flex items-end justify-between h-64 gap-2">
                        {monthlyData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full flex-1 flex items-end justify-center gap-1 relative">
                                    {/* Total Fires Bar */}
                                    <div
                                        className="w-3 bg-slate-700 rounded-t group-hover:bg-slate-600 transition-colors"
                                        style={{ height: `${d.fires}%` }}
                                    ></div>
                                    {/* Prevented Bar */}
                                    <div
                                        className="w-3 bg-cyan-500 rounded-t group-hover:bg-cyan-400 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                        style={{ height: `${d.prevented}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-500 font-mono">{d.month}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="w-3 h-3 bg-slate-700 rounded-sm"></div> Total Incidents
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="w-3 h-3 bg-cyan-500 rounded-sm"></div> Prevention Succcess
                        </div>
                    </div>
                </div>

                {/* Incident Impact Map Placeholder */}
                <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-4">Heatmap Analysis</h3>
                    <div className="flex-1 rounded-lg border border-white/5 bg-[url('/drone_feed.png')] bg-cover bg-center overflow-hidden relative opacity-70">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                            <div className="text-2xl font-bold text-white">Zone B-7</div>
                            <div className="text-sm text-gray-300">Highest Risk Area</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnalyticsPanel;
