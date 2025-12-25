from fastapi import APIRouter, HTTPException, Query
from services.mock_ai import (
    generate_satellite_data, 
    detect_fire_from_drone, 
    get_active_alerts,
    predict_fire_spread,
    get_swarm_status
)

router = APIRouter()

@router.get("/satellite-data")
async def get_satellite_data():
    """
    Get simulated satellite heatmap data.
    """
    data = generate_satellite_data()
    return {"status": "success", "data": data}

@router.get("/alerts")
async def get_alerts():
    """
    Get current list of active fire alerts.
    """
    alerts = get_active_alerts()
    return {"status": "success", "count": len(alerts), "alerts": alerts}

@router.get("/drone-status")
async def get_drone_status():
    """
    Simulate a check on the drone's current AI processing.
    """
    # In a real app, this might be a WebSocket or streamed, 
    # but for prototype polling is fine.
    analysis = detect_fire_from_drone()
    return {"status": "online", "drone_id": "DRONE-ALPHA-1", "analysis": analysis}

@router.get("/drones")
async def get_swarm():
    """
    Get status of all drones in the swarm.
    """
    drones = get_swarm_status()
    return {"status": "success", "drones": drones}

@router.get("/fire-spread")
async def get_fire_spread(
    lat: float, 
    lng: float, 
    wind_speed: float = 10.0, 
    wind_direction: str = "N"
):
    """
    Get fire spread prediction polygons for a location.
    """
    wind_data = {"wind_speed": wind_speed, "wind_direction": wind_direction}
    prediction = predict_fire_spread(lat, lng, wind_data)
    return {"status": "success", "prediction": prediction}

@router.post("/verify/{alert_id}")
async def verify_alert(alert_id: str):
    """
    Manually confirm an alert (Demo feature).
    """
    alerts = get_active_alerts()
    for alert in alerts:
        if alert["id"] == alert_id:
            alert["status"] = "VERIFIED"
            return {"status": "success", "message": f"Alert {alert_id} verified."}
    
    raise HTTPException(status_code=404, detail="Alert not found")
