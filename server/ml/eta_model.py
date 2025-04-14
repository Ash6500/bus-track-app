import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import pickle
from datetime import datetime
import os

# Load GPS logs
df = pd.read_csv("data/gps_logs.csv")

# Parse timestamp
df['timestamp'] = pd.to_datetime(df['timestamp'])

# Extract features
df['hour'] = df['timestamp'].dt.hour
df['day_of_week'] = df['timestamp'].dt.dayofweek

# Some rows may not have speed — fill missing with 30 (as in the API fallback)
df['speed'] = df['speed'].fillna(30)

# Extract lat/long from 'location.coordinates' if needed
# Assuming separate lat, long columns exist in the CSV
# If instead 'location' is a stringified list like "[long, lat]", then use this:
# df['location'] = df['location'].apply(eval)
# df['long'] = df['location'].apply(lambda x: x[0])
# df['lat'] = df['location'].apply(lambda x: x[1])

# Final features and target
features = ['lat', 'long', 'speed', 'hour', 'day_of_week']
target = 'eta_minutes'

# Ensure no NaNs in features
df = df.dropna(subset=features + [target])

X = df[features]
y = df[target]

# Train the ETA model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# Ensure model directory exists
os.makedirs("model", exist_ok=True)

# Save the trained model
with open("model/eta_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ ETA model trained and saved.")

