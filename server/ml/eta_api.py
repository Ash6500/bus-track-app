from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
import pickle
from datetime import datetime
import numpy as np
import os
from geopy.distance import geodesic

app = Flask(__name__)

# MongoDB Setup
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://sareengarnaik51:simran1234@blog-app.0pezqyz.mongodb.net/Bus_Tracker")
client = MongoClient(MONGO_URI)
db = client["Bus_Tracker"]
gps_logs = db["gpslogs"]
stops = db["stops"]

# Load the trained ETA model
with open("model/eta_model.pkl", "rb") as f:
    model = pickle.load(f)

@app.route("/predict", methods=["POST"])
def predict_eta():
    data = request.json
    bus_id = data.get("busId")

    if not bus_id:
        return jsonify({"error": "busId is required"}), 400

    try:
        bus_obj_id = ObjectId(bus_id)
    except:
        return jsonify({"error": "Invalid busId format"}), 400

    latest_log = gps_logs.find_one(
        {"busId": bus_obj_id},
        sort=[("timestamp", -1)]
    )

    if not latest_log:
        return jsonify({"error": "No GPS log found for this bus"}), 404

    lat = latest_log["location"]["coordinates"][1]
    long = latest_log["location"]["coordinates"][0]
    speed = latest_log.get("speed", 30)
    timestamp = latest_log["timestamp"]
    route_id = latest_log.get("routeId")

    if not route_id:
        return jsonify({"error": "No routeId found in GPS log"}), 404

    stop_list = list(stops.find({"routeId": route_id}).sort("order", 1))

    if not stop_list:
        return jsonify({"error": "No stops found for this route"}), 404

    closest_stop = None
    min_distance = float("inf")
    for stop in stop_list:
        stop_lat = stop["location"]["coordinates"][1]
        stop_long = stop["location"]["coordinates"][0]
        distance = geodesic((lat, long), (stop_lat, stop_long)).kilometers
        if distance < min_distance:
            min_distance = distance
            closest_stop = stop

    next_stop = None
    if closest_stop:
        next_order = closest_stop.get("order", 0) + 1
        next_stop = stops.find_one({"routeId": route_id, "order": next_order})

    if next_stop:
        hour = timestamp.hour
        weekday = timestamp.weekday()
        features = np.array([[lat, long, speed, hour, weekday]])
        eta = model.predict(features)[0]

        return jsonify({
            "busId": str(bus_id),
            "next_stop": next_stop["name"],
            "next_stop_eta_minutes": round(float(eta), 2),
            "predicted_at": datetime.utcnow().isoformat() + "Z"
        })

    return jsonify({"error": "No next stop found"}), 404

@app.route("/final_destination_eta", methods=["POST"])
def predict_final_destination_eta():
    data = request.json
    bus_id = data.get("busId")

    if not bus_id:
        return jsonify({"error": "busId is required"}), 400

    try:
        bus_obj_id = ObjectId(bus_id)
    except:
        return jsonify({"error": "Invalid busId format"}), 400

    latest_log = gps_logs.find_one(
        {"busId": bus_obj_id},
        sort=[("timestamp", -1)]
    )

    if not latest_log:
        return jsonify({"error": "No GPS log found for this bus"}), 404

    lat = latest_log["location"]["coordinates"][1]
    long = latest_log["location"]["coordinates"][0]
    speed = latest_log.get("speed", 30)
    timestamp = latest_log["timestamp"]
    route_id = latest_log.get("routeId")

    if not route_id:
        return jsonify({"error": "No routeId found in GPS log"}), 404

    stop_list = list(stops.find({"routeId": route_id}).sort("order", 1))

    if not stop_list:
        return jsonify({"error": "No stops found for this route"}), 404

    final_stop = stop_list[-1]

    hour = timestamp.hour
    weekday = timestamp.weekday()
    features = np.array([[lat, long, speed, hour, weekday]])
    eta = model.predict(features)[0]

    return jsonify({
        "busId": str(bus_id),
        "final_destination": final_stop["name"],
        "final_destination_eta_minutes": round(float(eta), 2),
        "predicted_at": datetime.utcnow().isoformat() + "Z"
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001)


