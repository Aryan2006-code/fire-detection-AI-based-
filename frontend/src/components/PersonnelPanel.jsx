import React, { useState } from 'react';
import { Phone, Mail, MapPin, UserCheck, Search } from 'lucide-react';

const PERSONNEL_DATA = [
    { id: 1, name: "Capt. Vikram Singh", role: "Field Commander", status: "Active", location: "Sector 4", phone: "+91-98765-43210" },
    { id: 2, name: "Lt. Sarah Jenkins", role: "Drone Operator", status: "Active", location: "Base Camp", phone: "+91-98765-43211" },
    { id: 3, name: "Ranger Amit Kumar", role: "Ground Unit", status: "On Patrol", location: "Sector 2", phone: "+91-98765-43212" },
    { id: 4, name: "Dr. Elena Rodriquez", role: "Ecologist", status: "Offline", location: "HQ", phone: "+91-98765-43213" },
];

const PersonnelPanel = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPersonnel = PERSONNEL_DATA.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAction = (action, name) => {
        alert(`${action} initiated for ${name}`);
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Personnel Management</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search personnel..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-900/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 w-64 transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-4">
                {filteredPersonnel.map(person => (
                    <div key={person.id} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-cyan-500/30 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-lg font-bold text-white border border-white/10">
                                    {person.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{person.name}</h3>
                                    <span className="text-xs text-cyan-400 py-0.5 px-1.5 bg-cyan-500/10 rounded border border-cyan-500/20">
                                        {person.role}
                                    </span>
                                </div>
                            </div>
                            <div className={`w-2.5 h-2.5 rounded-full ${person.status === 'Active' || person.status === 'On Patrol' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-500'}`}></div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-400 mb-6">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                {person.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-gray-500" />
                                {person.status}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleAction('Call', person.name)}
                                className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-white/5 hover:border-white/10"
                            >
                                <Phone className="w-4 h-4" /> Call
                            </button>
                            <button
                                onClick={() => handleAction('Message', person.name)}
                                className="flex-1 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg text-cyan-400 text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-cyan-500/20 hover:border-cyan-500/30"
                            >
                                <Mail className="w-4 h-4" /> Msg
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PersonnelPanel;
