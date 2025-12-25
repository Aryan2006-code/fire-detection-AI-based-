import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Radio, Settings, User, BarChart3 } from 'lucide-react';
import MapComponent from './components/MapComponent';
import DroneFeed from './components/DroneFeed';
import AlertsPanel from './components/AlertsPanel';
import LiveFeeds from './components/LiveFeeds';
import SettingsPanel from './components/SettingsPanel';
import PersonnelPanel from './components/PersonnelPanel';
import AnalyticsPanel from './components/AnalyticsPanel';


// Mock API URL - in production use env var
const API_URL = 'http://localhost:8000/api';

function App() {
  const [alerts, setAlerts] = useState([]);
  const [satelliteData, setSatelliteData] = useState([]);
  const [detectionData, setDetectionData] = useState({ detected: false, message: "Initializing..." });
  const [activeTab, setActiveTab] = useState('dashboard');

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const satRes = await fetch(`${API_URL}/satellite-data`);
        const satJson = await satRes.json();
        setSatelliteData(satJson.data);

        const alertRes = await fetch(`${API_URL}/alerts`);
        const alertJson = await alertRes.json();
        setAlerts(alertJson.alerts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  // Poll Drone Status
  useEffect(() => {
    const fetchDrone = async () => {
      try {
        const res = await fetch(`${API_URL}/drone-status`);
        const json = await res.json();
        setDetectionData(json.analysis);
      } catch (error) {
        console.error("Error fetching drone status:", error);
      }
    };

    fetchDrone();
    const interval = setInterval(fetchDrone, 2000); // Poll faster for drone
    return () => clearInterval(interval);
  }, []);

  // Poll Swarm Status
  const [drones, setDrones] = useState([]);
  useEffect(() => {
    const fetchSwarm = async () => {
      try {
        const res = await fetch(`${API_URL}/drones`);
        const json = await res.json();
        if (json.status === 'success') {
          setDrones(json.drones);
        }
      } catch (error) {
        console.error("Error fetching swarm:", error);
      }
    };
    fetchSwarm();
    const swarmInterval = setInterval(fetchSwarm, 3000);
    return () => clearInterval(swarmInterval);
  }, []);

  const handleVerify = async (alertId) => {
    try {
      await fetch(`${API_URL}/verify/${alertId}`, { method: 'POST' });
      // Optimistic update
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'VERIFIED' } : a));
    } catch (error) {
      console.error("Verification failed", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-12 grid-rows-2 h-full gap-6">
            {/* Map - Takes up large space */}
            <div className="col-span-8 row-span-2">
              <MapComponent alerts={alerts} satelliteData={satelliteData} drones={drones} />
            </div>

            {/* Top Right - Drone Feed */}
            <div className="col-span-4 row-span-1">
              <DroneFeed detectionData={detectionData} />
            </div>

            {/* Bottom Right - Alerts */}
            <div className="col-span-4 row-span-1">
              <AlertsPanel alerts={alerts} onVerify={handleVerify} />
            </div>
          </div>
        );
      case 'feeds':
        return <LiveFeeds detectionData={detectionData} drones={drones} />;
      case 'settings':
        return <SettingsPanel />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'personnel':
        return <PersonnelPanel />;
      default:
        return <div className="text-white">Page Not Found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col z-50">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
            <span className="text-3xl">🔥</span> AGNI-NET
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-mono pl-1">FOREST GUARD SYSTEM</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Radio />} label="Live Feeds" active={activeTab === 'feeds'} onClick={() => setActiveTab('feeds')} />
          <NavItem icon={<BarChart3 />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <div className="pt-4 pb-2">
            <div className="h-px bg-white/10 mx-2"></div>
          </div>
          <NavItem icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          <NavItem icon={<User />} label="Personnel" active={activeTab === 'personnel'} onClick={() => setActiveTab('personnel')} />
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-gray-400 font-mono">SYSTEM ONLINE</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-slate-900 to-slate-900 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900/40 pointer-events-none"></div>

        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 backdrop-blur-sm z-40">
          <h2 className="text-xl font-medium text-white/90">Global Forest Monitoring Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="bg-slate-800/80 px-4 py-1.5 rounded-full border border-white/10 text-xs font-mono text-cyan-400">
              SAT-1: ORBITING
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 z-10 overflow-hidden">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${active
      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
      : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
  >
    {React.cloneElement(icon, { size: 18, className: active ? 'text-cyan-400' : 'text-gray-500 group-hover:text-white' })}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default App;
