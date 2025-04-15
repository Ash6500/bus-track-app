import pickle
import numpy as np
from datetime import datetime

# Load trained model
with open("model/eta_model.pkl", "rb") as f:
    model = pickle.load(f)

def predict_eta(lat, long, speed, timestamp):
    try:
        # Ensure timestamp is in correct ISO format
        dt = datetime.fromisoformat(timestamp)
        hour = dt.hour
        weekday = dt.weekday()
    except Exception as e:
        raise ValueError(f"Invalid timestamp format: {timestamp}. Error: {str(e)}")

    # Handle missing or bad inputs with reasonable defaults
    if speed is None or speed <= 0:
        speed = 30  # fallback default speed

    features = np.array([[lat, long, speed, hour, weekday]])
    eta = model.predict(features)[0]
    return round(eta, 2)

