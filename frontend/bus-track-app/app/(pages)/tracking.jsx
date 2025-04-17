import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/config';

export default function TrackingScreen() {
  const [formattedStops, setFormattedStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    busNumber,
    routeName,
    fromStation,
    toStation,
    routeId,
  } = useLocalSearchParams();

  useEffect(() => {
    const fetchStops = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${API_URL}/tracker/auth/getStopsByRoute/${routeId}`);
        const stopsData = response.data?.stops || response.data;

        const transformed = stopsData.map((stop) => ({
          stationName: stop.stationName,
          arrival: stop.arrivalTime || null,
          departure: stop.departureTime || null,
          distance: stop.distance || '0 km',
          platform: stop.stopId.name || 'N/A',
        }));

        setFormattedStops(transformed);
      } catch (err) {
        console.error('Failed to fetch stops:', err);
        setError(err.message || 'Failed to load route information');
      } finally {
        setLoading(false);
      }
    };

    fetchStops();
  }, [routeId]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#1D9BF0" />
        <Text className="text-white mt-4">Loading route...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-4">
        <Text className="text-red-500 text-lg mb-2">Error</Text>
        <Text className="text-white text-center">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-black flex-1 px-4 pt-6">
      <Text className="text-white text-xl font-bold mb-1">
        {busNumber} - {routeName}
      </Text>
      <Text className="text-gray-400 text-sm mb-4">
        {fromStation} → {toStation}
      </Text>

      {formattedStops.map((stop, index) => (
        <View key={index} className="flex-row items-start mb-6">
          <View className="items-center mr-4">
            {index > 0 && <View className="w-0.5 bg-gray-500 h-4" />}
            <FontAwesome name="train" size={20} color="#1D9BF0" />
            {index < formattedStops.length - 1 && (
              <View className="w-0.5 bg-gray-500 h-16" />
            )}
          </View>

          <View className="flex-1">
            <View className="flex-row justify-between items-center">
              <Text className="text-white text-sm">{stop.stationName}</Text>
              <Text className="text-green-400 text-sm">
                {stop.departure || stop.arrival}
              </Text>
            </View>
            <Text className="text-gray-400 text-xs">
               {stop.platform} • 
               {/* {stop.distance} */}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
