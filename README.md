# 🔥 AGNI-NET: AI-Powered Forest Fire Early Detection & Response System

**AGNI-NET** is a next-generation "Government-Grade" disaster management platform designed for early forest fire detection, real-time monitoring, and intelligent decision support. It integrates simulated satellite data, autonomous drone swarms, and explainable AI to provide a comprehensive command center for forest departments.

---

## 🎯 Project Objective
To transform reactive fire management into a **proactive, intelligence-driven system**. AGNI-NET moves beyond simple alerts by providing:
1.  **Multi-Factor Intelligence**: Analyzing heat, wind, smoke, and vegetation to reduce false positives.
2.  **Predictive Modelling**: Forecasting where the fire will spread in the next hour.
3.  **Autonomous Response**: Simulating drone swarm deployment for verification and monitoring.

---

## 🚀 Key Features Implemented

### 1. 🧠 Advanced Fire Intelligence
*   **Multi-Factor Scoring**: Algorithms calculate detection confidence based on heat intensity, wind speed, smoke density, and vegetation fuel.
*   **Severity Classification**: AI automatically classifies incidents as *Low, Moderate, Severe, or Mega Fire*.
*   **Dynamic Lifecycle**: Alerts have a lifespan of 3 minutes (simulated) and expire if not verified, creating a dynamic, living monitoring environment.

### 2. � Spread Prediction Module
*   **Physics-Based Forecasting**: Calculates potential spread radius for **15, 30, and 60 minutes** based on real-time wind speed and direction.
*   **Visual Risk Zones**: Renders predictive concentric circles on the map to help operators decide evacuation zones.

### 3. 🛸 Drone Swarm & Multi-Feed Grid
*   **Autonomous Swarm**: Simulates a fleet of drones (*Visual, Thermal, Relay*) with individual battery and status tracking.
*   **Live Feed Grid**: A responsive grid view displaying multiple live drone feeds simultaneously.
*   **Specialized Vision**: 
    *   **Thermal Mode**: High-contrast purple/orange filter for heat signature tracking.
    *   **Night/Relay Mode**: Green-tinted night vision for low-light operations.

### 4. 🗺️ Satellite-Enhanced Command Map
*   **Esri World Imagery**: Professional satellite tile layer for realistic terrain visualization.
*   **Risk Zone Mapping**: Overlays critical infrastructure (Values at Risk) like **Villages** and **Power Grids**.
*   **Interactive Markers**: Pulsing severity-coded fire markers with detailed popups.

### 5. 🔍 Explainable AI (XAI) & Timeline
*   **"Why This Alert?" Panel**: breaks down the confidence score (e.g., "Heat: 80%, Wind: 60%") for transparency.
*   **Incident Timeline**: Tracks the full lifecycle of an event: *Satellite Detection → AI Analysis → Drone Dispatch → Verification*.

### 6. 📊 Post-Incident Analytics
*   **Efficiency Dashboard**: Visualizes KPIs like "Avg Detection Time", "Area Saved", and "Response Efficiency".
*   **Trend Analysis**: Interactive charts showing monthly fire incidents and prevention success rates.

### 7. 🛡️ Role-Based Access Control (RBAC)
*   **User Simulation**: Settings panel allow switching roles (*Admin, Forest Officer, Drone Operator*).
*   **Permission gating**: Certain actions (like Auto-Verification config) are restricted to Admins only.

---

## 🛠️ Technical Architecture

### Backend (Python/FastAPI)
*   **Simulated AI Engine**: `mock_ai.py` generates realistic geospatial data, environment variables (wind/weather), and simulates drone physics.
*   **API Router**: Exposes endpoints for satellites, alerts, spread prediction, and swarm status.

### Frontend (React + Vite)
*   **component Library**: Built with **Tailwind CSS** for a "Glassmorphism" dark-mode aesthetic.
*   **Mapping Engine**: **Leaflet / React-Leaflet** for rendering complex geospatial layers.
*   **State Management**: React Hooks for synchronizing global swarm integration and alert lifecycles.

---

## � Setup & Running

### 1. Backend
Navigate to `backend/` and run:
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```
*Server running at: `http://localhost:8000`*

### 2. Frontend
Navigate to `frontend/` and run:
```bash
npm install
npm run dev
```
*Dashboard accessible at: `http://localhost:5173`*

---

*Project by [Your Name] for Advanced Agentic Coding - Google Deepmind*
