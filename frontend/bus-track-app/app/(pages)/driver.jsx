import { View, Text, Platform } from 'react-native';
import React, { useEffect } from 'react';
import * as Location from 'expo-location';
import io from 'socket.io-client';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

// Connect to socket server
const socket = io('https://bus-track-app.onrender.com');

const gpsBuffer = [];
const FLUSH_INTERVAL_MS = 30000;
const API_ENDPOINT = `https://bus-track-app.onrender.com/tracker/auth/uploadLogs`;

const Driver = () => {
  const { driverId, email } = useLocalSearchParams();

  useEffect(() => {
    let locationInterval;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('❌ Location permission not granted');
        return;
      }

      // Start sending location every 5 seconds
      locationInterval = setInterval(async () => {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude } = location.coords;
        const speed = 0; // You can calculate speed if needed
        const eta_minutes = 0;

        // Add to buffer
        gpsBuffer.push({
          lat: latitude,
          long: longitude,
          speed,
          eta_minutes,
          timestamp: new Date(),
        });

        socket.emit('send-location', { id: driverId, latitude, longitude });
      }, 5000);
    };

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      startTracking();
    }

    const flushInterval = setInterval(async () => {
      if (gpsBuffer.length > 0) {
        try {
          const response = await axios.post(API_ENDPOINT, {
            logs: gpsBuffer,
            driverId,
          }, {
            headers: {
              'Content-Type': 'application/json',
            }
          });

          console.log(`✅ Successfully sent ${gpsBuffer.length} GPS logs to API`);
          gpsBuffer.length = 0;
        } catch (err) {
          console.error("❌ Error sending GPS logs:", err.response?.data || err.message);
        }
      }
    }, FLUSH_INTERVAL_MS);

    return () => {
      if (locationInterval) clearInterval(locationInterval);
      if (flushInterval) clearInterval(flushInterval);
    };
  }, [driverId]);

  return (
    <View>
      <Text>Driver Tracking Active</Text>
      <Text>ID: {driverId}</Text>
      <Text>Email: {email}</Text>
    </View>
  );
};

export default Driver;
