# S.E.R.S. - Smart Emergency Routing System 🚑

A full-stack, real-time enterprise application designed to optimize ambulance routing during emergencies. Unlike traditional GPS systems that only calculate travel time, S.E.R.S. dynamically routes ambulances based on a combination of **Traffic (Dijkstra's Algorithm)** and **Live Hospital Wait Times (Capacity Penalty Model)**.

## 🌟 Key Features
* **Intelligent Routing Engine:** Calculates the true shortest path by weighing road distance against hospital overcrowding.
* **Live Tactical Radar:** An interactive, Framer Motion-powered React Flow graph that maps the city grid and visualizes the routing path in real-time.
* **Network Override (Disaster Simulation):** An admin panel to manually inject live occupancy data, demonstrating the algorithm's ability to adapt to sudden patient influxes.
* **Encrypted Dispatch Manifests:** One-click export of routing coordinates and metrics for ambulance drivers.
* **Enterprise Security:** Fully secured REST API with JWT (JSON Web Token) authentication and password hashing.

## 🛠️ Tech Stack
* **Frontend:** React.js, Tailwind CSS v4, Framer Motion, Lucide Icons, @xyflow/react (React Flow).
* **Backend:** Python, Flask, Flask-CORS, PyJWT, Werkzeug Security.
* **Database:** MongoDB (Live NoSQL cloud integration).
* **Algorithm:** NetworkX (Graph Theory).

## 🧮 The Core Mathematical Model
The routing decision engine minimizes the following cost function:

$$Total\_Time = Travel\_Time + \left(\alpha \times \frac{Current\_Occupancy}{Total\_Capacity}\right)$$

* **Travel Time:** Calculated using Dijkstra's shortest path algorithm on the weighted city graph.
* **Wait Time Penalty:** As a hospital's occupancy approaches its capacity, the wait time grows exponentially, forcing the algorithm to seek a slightly further but significantly emptier hospital.

## 🚀 Quick Start Guide

**1. Start the Backend (Flask/MongoDB)**
\`\`\`bash
cd smart-emergency-routing-backend
python seed_db.py  # Run once to seed the database
python run.py      # Starts the API on port 5000
\`\`\`

**2. Start the Frontend (React/Vite)**
\`\`\`bash
cd smart-emergency-ui
npm install
npm run dev        # Starts the UI on port 5173
\`\`\`