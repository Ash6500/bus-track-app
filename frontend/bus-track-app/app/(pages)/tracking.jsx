// app/tracking.tsx or app/tracking/index.tsx
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';

const mockRouteStops = [
  {
    stationName: "Rourkela Junction",
    arrival: null,
    departure: "5:00 AM",
    distance: "0 km",
    platform: "1",
  },
  {
    stationName: "Rajgangpur",
    arrival: "5:23 AM",
    departure: "5:25 AM",
    distance: "29 km",
    platform: "1",
  },
  {
    stationName: "Bamra",
    arrival: "5:49 AM",
    departure: "5:50 AM",
    distance: "64 km",
    platform: "1",
  },
  {
    stationName: "Bagdehi",
    arrival: "6:01 AM",
    departure: "6:02 AM",
    distance: "80 km",
    platform: "2",
  },
  {
    stationName: "Jharsuguda Junction",
    arrival: "6:35 AM",
    departure: "6:40 AM",
    distance: "101 km",
    platform: "1",
  },
  {
    stationName: "Rengali",
    arrival: "7:00 AM",
    departure: "7:02 AM",
    distance: "127 km",
    platform: "1",
  },
];

export default function TrackingScreen() {
  const {
    busNumber,
    routeName,
    fromStation,
    toStation,
  } = useLocalSearchParams();

  return (
    <ScrollView className="bg-black flex-1 px-4 pt-6">
      <Text className="text-white text-xl font-bold mb-1">
        {busNumber} - {routeName}
      </Text>
      <Text className="text-gray-400 text-sm mb-4">
        {fromStation} → {toStation}
      </Text>

      {mockRouteStops.map((stop, index) => (
        <View key={index} className="flex-row items-start mb-6">
          <View className="items-center mr-4">
            {index > 0 && <View className="w-0.5 bg-gray-500 h-4" />}
            <FontAwesome name="train" size={20} color="#1D9BF0" />
            {index < mockRouteStops.length - 1 && (
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
              Platform {stop.platform} • {stop.distance}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
