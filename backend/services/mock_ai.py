import random
import numpy as np
from datetime import datetime, timedelta

# Global simulation state
simulation_state = {
    "alerts": [],
    "drones": [],  # Will be populated in later steps or explicitly initialized
    "last_updated": datetime.now()
}

def calculate_fire_confidence(intensity, wind_speed, vegetation_density):
    """
    Calculates a multi-factor confidence score for fire detection.
    Returns: (confidence_score, factors_dict)
    """
    # Base confidence from satellite heat intensity (0.0 to 1.0)
    heat_score = min(intensity * 1.2, 1.0) # Boost high intensity
    
    # Wind factor: Higher wind = faster spread = more likely to be a serious fire
    # Normalized: 0-50 km/h -> 0.0-1.0
    wind_factor = min(wind_speed / 50.0, 1.0)
    
    # Vegetation factor: More fuel = higher confidence reliability if heat is found
    veg_factor = vegetation_density
    
    # Mock Smoke Check (randomized for simulation consistency with heat)
    smoke_detected = 1.0 if (heat_score > 0.7 and random.random() > 0.2) else 0.0
    
    # Weighted Sum
    # Heat is primary (50%), Smoke (30%), Wind (10%), Vegetation (10%)
    final_confidence = (heat_score * 0.5) + (smoke_detected * 0.3) + (wind_factor * 0.1) + (veg_factor * 0.1)
    
    factors = {
        "Heat Anomaly": round(heat_score * 100, 1),
        "Smoke Detection": round(smoke_detected * 100, 1),
        "Wind Influence": round(wind_factor * 100, 1),
        "Vegetation Fuel": round(veg_factor * 100, 1)
    }
    
    return round(final_confidence * 100, 1), factors

def determine_severity(confidence):
    if confidence > 90:
        return "MEGA FIRE"
    elif confidence > 75:
        return "SEVERE"
    elif confidence > 50:
        return "MODERATE"
    else:
        return "LOW"

def generate_satellite_data():
    """
    Simulates satellite heat anomaly data across a region.
    Returns a list of points (lat, lng, intensity, environmental_data).
    """
    # Simulate a region (e.g., a forest area)
    base_lat = 28.6139
    base_lng = 77.2090
    
    # ----------------------------------------------------
    # NEW: Clean up old alerts (Lifespan > 3 minutes)
    # ----------------------------------------------------
    now = datetime.now()
    active_alerts = []
    for alert in simulation_state["alerts"]:
        alert_time = datetime.fromisoformat(alert["timestamp"])
        age_seconds = (now - alert_time).total_seconds()
        
        # Keep if under 3 minutes (180s) or if it's "VERIFIED" (manual keep)
        if age_seconds < 180 or alert["status"] == "VERIFIED":
            active_alerts.append(alert)
    
    simulation_state["alerts"] = active_alerts
    # ----------------------------------------------------
    
    heatmap_data = []
    
    # Global environment for this scan
    wind_speed = random.uniform(5, 45) # km/h
    wind_direction = random.choice(["N", "NE", "E", "SE", "S", "SW", "W", "NW"])
    
    # Generate some random "hotspots"
    for _ in range(5):
        lat_offset = random.uniform(-0.05, 0.05)
        lng_offset = random.uniform(-0.05, 0.05)
        intensity = random.uniform(0.3, 0.95)
        vegetation_density = random.uniform(0.4, 0.9)
        
        point_data = {
            "lat": base_lat + lat_offset,
            "lng": base_lng + lng_offset,
            "intensity": intensity,
            "wind_speed": wind_speed,
            "wind_direction": wind_direction,
            "vegetation": vegetation_density
        }
        heatmap_data.append(point_data)

        # Create alert if intensity is substantial
        if intensity > 0.7:
            _create_mock_alert(point_data)
            
    return heatmap_data

def _create_mock_alert(data):
    """Internal helper to add to global alerts if not exists close by"""
    lat = data["lat"]
    lng = data["lng"]
    
    # Simple check to avoid duplicates within a small radius
    for alert in simulation_state["alerts"]:
        if abs(alert["lat"] - lat) < 0.001 and abs(alert["lng"] - lng) < 0.001:
            return

    confidence, factors = calculate_fire_confidence(
        data["intensity"], data["wind_speed"], data["vegetation"]
    )
    
    severity = determine_severity(confidence)
    
    new_alert = {
        "id": f"FIRE-{random.randint(1000, 9999)}",
        "lat": lat,
        "lng": lng,
        "severity": severity,
        "confidence": confidence,
        "factors": factors,
        "environmental": {
            "wind_speed": round(data["wind_speed"], 1),
            "wind_direction": data["wind_direction"],
            "vegetation_density": round(data["vegetation"], 2)
        },
        "timeline": [
            {"time": datetime.now().strftime("%H:%M:%S"), "event": "Heat anomaly detected by Sat-1"},
            {"time": (datetime.now() + timedelta(seconds=120)).strftime("%H:%M:%S"), "event": "AI Confidence Assessment complete"}
        ],
        "timestamp": datetime.now().isoformat(),
        "status": "DETECTED",
        "risk_zones": ["Village Alpha", "Power Grid B"] if random.random() > 0.5 else []
    }
    
    simulation_state["alerts"].append(new_alert)

def detect_fire_from_drone():
    """
    Simulates processing a frame from a drone feed and checking for fire.
    Returns: { "detected": bool, "confidence": float, "bbox": [x, y, w, h] }
    """
    # Randomly simulate detection
    detected = random.random() > 0.3
    if detected:
        return {
            "detected": True,
            "confidence": round(random.uniform(0.75, 0.99), 2),
            "bbox": [
                random.randint(100, 300), 
                random.randint(100, 300), 
                random.randint(50, 150), 
                random.randint(50, 150)
            ],
            "message": "Fire confirmed by drone AI"
        }
    else:
        return {
            "detected": False,
            "confidence": round(random.uniform(0.0, 0.4), 2),
            "bbox": [],
            "message": "No fire detected"
        }

def predict_fire_spread(lat, lng, wind_data):
    """
    Predicts fire spread radius for 15, 30, 60 minutes.
    Returns simulated polygon data (circles for now).
    """
    wind_speed = wind_data.get("wind_speed", 10)
    wind_dir_map = {
        "N": 0, "NE": 45, "E": 90, "SE": 135, 
        "S": 180, "SW": 225, "W": 270, "NW": 315
    }
    direction_deg = wind_dir_map.get(wind_data.get("wind_direction", "N"), 0)
    
    predictions = []
    
    # Simple physics simulation: faster wind = larger spread
    base_spread_rate = 0.5 # km per 15 mins base
    spread_factor = 1 + (wind_speed / 20.0)
    
    for minutes in [15, 30, 60]:
        radius_km = base_spread_rate * (minutes / 15.0) * spread_factor
        predictions.append({
            "duration": minutes,
            "radius_km": round(radius_km, 2),
            "spread_direction": wind_data.get("wind_direction", "N"),
            "risk_escalation": "MODERATE" if radius_km < 2 else "HIGH"
        })
        
    return predictions

def init_drones():
    """Initializes a swarm of drones if empty"""
    if not simulation_state["drones"]:
        simulation_state["drones"] = [
            {
                "id": "DRONE-ALPHA",
                "type": "VISUAL",
                "status": "PATROLLING",
                "battery": 87,
                "lat": 28.6139 + 0.01,
                "lng": 77.2090 + 0.01,
                "feed_type": "optical"
            },
            {
                "id": "DRONE-BETA",
                "type": "THERMAL",
                "status": "IDLE",
                "battery": 95,
                "lat": 28.6139 - 0.01,
                "lng": 77.2090 - 0.01,
                "feed_type": "thermal"
            },
            {
                "id": "DRONE-GAMMA",
                "type": "RELAY",
                "status": "RETURNING",
                "battery": 42,
                "lat": 28.6139,
                "lng": 77.2090 + 0.02,
                "feed_type": "none"
            }
        ]

def get_swarm_status():
    if not simulation_state["drones"]:
        init_drones()
    
    # Simulate movement/battery drain
    for drone in simulation_state["drones"]:
        if drone["status"] in ["PATROLLING", "DISPATCHED"]:
            drone["battery"] = max(0, drone["battery"] - random.uniform(0.1, 0.5))
            drone["lat"] += random.uniform(-0.001, 0.001)
            drone["lng"] += random.uniform(-0.001, 0.001)
            
    return simulation_state["drones"]

def get_active_alerts():
    return simulation_state["alerts"]
