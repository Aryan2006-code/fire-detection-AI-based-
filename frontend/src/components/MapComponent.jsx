import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Flame, Wind, Radio, Zap, Home, Thermometer } from 'lucide-react';
import { renderToString } from 'react-dom/server';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons Helper
const createIcon = (iconComponent, color = "text-white", bg = "bg-slate-900") => {
    const iconHtml = renderToString(
        <div className={`p-1.5 rounded-full border-2 border-white/20 shadow-xl ${bg} ${color} transform transition-transform hover:scale-110`}>
            {iconComponent}
        </div>
    );
    return L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-icon",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
    });
};

// Icons
const FireIcon = (severity) => {
    let color = "text-orange-500";
    let bg = "bg-orange-900/80";
    let animate = "";

    if (severity === 'MEGA FIRE') { color = "text-purple-500"; bg = "bg-purple-900"; animate = "animate-pulse"; }
    else if (severity === 'SEVERE') { color = "text-red-500"; bg = "bg-red-900"; animate = "animate-bounce"; }

    return createIcon(<Flame size={16} className={animate} />, color, bg);
};

const DroneIcon = (type) => {
    const color = type === 'THERMAL' ? "text-purple-400" : "text-cyan-400";
    return createIcon(type === 'THERMAL' ? <Thermometer size={14} /> : <Radio size={14} />, color, "bg-slate-800");
};

const VillageIcon = createIcon(<Home size={14} />, "text-emerald-400", "bg-emerald-900");
const PowerIcon = createIcon(<Zap size={14} />, "text-yellow-400", "bg-yellow-900");

// Mock Static Risk Zones
const RISK_ZONES = [
    { id: 'v1', lat: 28.62, lng: 77.22, name: 'Village Alpha', type: 'village' },
    { id: 'p1', lat: 28.60, lng: 77.19, name: 'Power Grid B', type: 'power' },
];

const MapComponent = ({ alerts, satelliteData, drones }) => {
    const position = [28.6139, 77.2090];
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [predictions, setPredictions] = useState([]);

    // Fetch spread prediction when alert is selected
    useEffect(() => {
        if (!selectedAlert) {
            setPredictions([]);
            return;
        }

        const fetchPrediction = async () => {
            try {
                // Use alert's env data if available, else defaults
                const env = selectedAlert.environmental || {};
                const windSpeed = env.wind_speed || 15;
                const windDir = env.wind_direction || "N";

                const res = await fetch(`https://fire-detection-ai-based.onrender.com/api/fire-spread?lat=${selectedAlert.lat}&lng=${selectedAlert.lng}&wind_speed=${windSpeed}&wind_direction=${windDir}`);
                const json = await res.json();
                if (json.status === 'success') {
                    setPredictions(json.prediction);
                }
            } catch (err) {
                console.error("Prediction fetch failed", err);
            }
        };
        fetchPrediction();
    }, [selectedAlert]);

    return (
        <div className="h-full w-full rounded-xl overflow-hidden shadow-2xl border border-white/10 relative z-0 bg-slate-900">
            <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                />

                {/* Heatmap Overlay */}
                {satelliteData.map((point, i) => (
                    <Circle
                        key={`heat-${i}`}
                        center={[point.lat, point.lng]}
                        pathOptions={{
                            fillColor: point.intensity > 0.8 ? 'red' : 'orange',
                            fillOpacity: 0.3,
                            color: 'transparent',
                            radius: 600
                        }}
                    />
                ))}

                {/* Risk Zones */}
                {RISK_ZONES.map(zone => (
                    <Marker
                        key={zone.id}
                        position={[zone.lat, zone.lng]}
                        icon={zone.type === 'village' ? VillageIcon : PowerIcon}
                    >
                        <Tooltip direction="top" offset={[0, -20]} opacity={0.9} className="custom-tooltip">
                            <span>{zone.name}</span>
                        </Tooltip>
                    </Marker>
                ))}

                {/* Drones */}
                {drones && drones.map(drone => (
                    <Marker key={drone.id} position={[drone.lat, drone.lng]} icon={DroneIcon(drone.type)}>
                        <Popup className="glass-popup">
                            <div className="text-xs font-mono">
                                <strong>{drone.id}</strong><br />
                                Bat: {Math.round(drone.battery)}%<br />
                                Status: {drone.status}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Active Alerts */}
                {alerts.map((alert) => (
                    <Marker
                        key={alert.id}
                        position={[alert.lat, alert.lng]}
                        icon={FireIcon(alert.severity)}
                        eventHandlers={{
                            click: () => setSelectedAlert(alert),
                        }}
                    >
                        <Popup className="glass-popup">
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-red-500 flex items-center gap-2">
                                    <Flame size={16} fill="currentColor" /> {alert.id}
                                </h3>
                                <div className="mt-2 space-y-1 text-xs text-gray-300">
                                    <p><span className="text-gray-500">Severity:</span> <span className="text-white font-bold">{alert.severity}</span></p>
                                    <p><span className="text-gray-500">Confidence:</span> {alert.confidence}%</p>
                                    <p><span className="text-gray-500">Wind:</span> {alert.environmental?.wind_speed} km/h {alert.environmental?.wind_direction}</p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Spread Prediction Circles */}
                {selectedAlert && predictions.map((pred, i) => (
                    <Circle
                        key={`pred-${i}`}
                        center={[selectedAlert.lat, selectedAlert.lng]} // Ideally offset by wind, but concentric is fine for MVP
                        pathOptions={{
                            color: pred.risk_escalation === 'HIGH' ? '#ef4444' : '#f59e0b',
                            fillColor: pred.risk_escalation === 'HIGH' ? '#ef4444' : '#f59e0b',
                            fillOpacity: 0.1,
                            dashArray: '5, 5',
                            weight: 1
                        }}
                        radius={pred.radius_km * 1000} // km to meters
                    >
                        <Tooltip sticky direction="right">
                            {pred.duration} min spread area
                        </Tooltip>
                    </Circle>
                ))}

            </MapContainer>

            {/* Legend / Overlay */}
            <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
                <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-xl">
                    <h3 className="text-cyan-400 font-mono text-xs font-bold tracking-wider mb-2">INTELLIGENCE LAYERS</h3>
                    <div className="flex flex-col gap-1.5 text-[10px] text-gray-400">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div> MEGA FIRE</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> SEVERE FIRE</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> MODERATE</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> VILLAGE / ZONE</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400"></div> DRONE UNIT</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapComponent;
