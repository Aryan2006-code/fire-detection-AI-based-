import React, { useState } from 'react';
import { Save, Bell, Moon, Sun, Shield, Users, Lock } from 'lucide-react';

const SettingsPanel = () => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [autoVerify, setAutoVerify] = useState(false);
    const [userRole, setUserRole] = useState("Admin");

    const roles = ["Admin", "Forest Officer", "Drone Operator", "Analyst", "Observer"];

    return (
        <div className="p-8 max-w-2xl mx-auto h-full overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-cyan-400" />
                System Settings
            </h2>

            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden mb-6">

                {/* User Role (RBAC) */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-cyan-500/20 rounded-lg text-cyan-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-white">User Role Simulation</h3>
                            <p className="text-sm text-gray-400">Current Access Level: <span className="text-cyan-400 font-bold uppercase">{userRole}</span></p>
                        </div>
                    </div>
                    <select
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                    >
                        {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>

                {/* Notification Settings */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-white">Real-time Notifications</h3>
                            <p className="text-sm text-gray-400">Receive alerts when fire confidence &gt; 80%</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={notifications}
                            onChange={() => setNotifications(!notifications)}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                </div>

                {/* Theme Settings */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                            {darkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-white">Dark Mode Interface</h3>
                            <p className="text-sm text-gray-400">Optimized for low-light control rooms</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                </div>

                {/* Auto-Verification Settings */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/20 rounded-lg text-red-400">
                            <Lock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-white">Auto-Verification Protocol</h3>
                            <p className="text-sm text-gray-400">Automatically verify alerts with confidence &gt; 95%</p>
                        </div>
                    </div>
                    {userRole === 'Admin' ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={autoVerify}
                                onChange={() => setAutoVerify(!autoVerify)}
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                    ) : (
                        <span className="text-xs text-red-500 font-mono border border-red-500/30 px-2 py-1 rounded bg-red-500/10">ADMIN ONLY</span>
                    )}
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-lg shadow-lg shadow-cyan-500/25 transition-all active:scale-95">
                    Save Configuration
                </button>
            </div>
        </div>
    );
};

export default SettingsPanel;
