import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { API_URL } from '../../utils/config';
import { useRouter } from 'expo-router'; // Changed from react-navigation

export default function HomeScreen() {
  const router = useRouter(); // Changed from useNavigation
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [foundRoutes, setFoundRoutes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const swapStations = () => {
    setFromStation(toStation);
    setToStation(fromStation);
  };

  const handleFindTrains = async () => {
    Keyboard.dismiss();
    setLoading(true);

    if (!fromStation || !toStation) {
      alert('Please enter both stations.');
      setLoading(false);
      return;
    }

    try {
      const routesRes = await fetch(`${API_URL}/tracker/auth/getAllRoutes`);
      const routes = await routesRes.json();

      const busesRes = await fetch(`${API_URL}/tracker/admin/getAllBuses`);
      const buses = await busesRes.json();

      const matchingRoutes = [];
      
      for (const route of routes.routes || []) {
        try {
          const stopsRes = await fetch(`${API_URL}/tracker/auth/getStopsByRoute/${route._id}`);
          const stops = await stopsRes.json();

          const stopNames = (stops.stops || []).map(stop => 
            (stop?.stopId?.name || '').toLowerCase()
          );
          
          const fromLower = (fromStation || '').toLowerCase();
          const toLower = (toStation || '').toLowerCase();
          
          const hasFromStation = stopNames.includes(fromLower);
          const hasToStation = stopNames.includes(toLower);

          if (hasFromStation && hasToStation) {
            const busesForRoute = (buses.buses || []).filter(bus => 
              bus?.routeId?._id === route._id
            );
            
            busesForRoute.forEach(bus => {
              matchingRoutes.push({
                id: route._id,
                routeName: route.routeName || 'Unknown Route',
                busNumber: bus.busNumber || 'Unknown Bus',
                busId: bus._id,
                fromStation: fromStation,
                toStation: toStation
              });
            });
          }
        } catch (err) {
          console.error(`Error processing route ${route._id}:`, err);
          continue;
        }
      }
      
      setFoundRoutes(matchingRoutes);

      if (matchingRoutes.length === 0) {
        alert('No matching buses found.');
      }
    } catch (err) {
      console.error('Main error:', err);
      alert('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = (foundRoutes || []).filter(route => {
    const busNumber = (route.busNumber || '').toLowerCase();
    const routeName = (route.routeName || '').toLowerCase();
    const searchTerm = (searchText || '').toLowerCase();
    
    return busNumber.includes(searchTerm) || routeName.includes(searchTerm);
  });

  const handleRoutePress = (route) => {
    router.push({
      pathname: '/tracking',
      params: {
        busId: route.busId,
        busNumber: route.busNumber,
        routeId: route.id,
        routeName: route.routeName,
        fromStation: route.fromStation,
        toStation: route.toStation,
        stops: JSON.stringify(route.stops),
      }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2b2b2b', paddingHorizontal: 16 }}>
      {/* Header */}
      <View style={{ paddingVertical: 16 }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Track Bus</Text>
      </View>

      {/* From-To Input Section */}
      <View style={{ backgroundColor: '#1f1f1f', borderRadius: 12, padding: 16, marginBottom: 16, position: 'relative' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <TextInput
            value={fromStation}
            onChangeText={setFromStation}
            placeholder="From Station"
            placeholderTextColor="#aaa"
            style={{ color: 'white', flex: 1 }}
          />
          {fromStation ? (
            <TouchableOpacity onPress={() => setFromStation('')}>
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={{ borderLeftWidth: 2, borderStyle: 'dotted', borderColor: 'white', height: 16, marginLeft: 4, marginBottom: 8 }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextInput
            value={toStation}
            onChangeText={setToStation}
            placeholder="To Station"
            placeholderTextColor="#aaa"
            style={{ color: 'white', flex: 1 }}
          />
          {toStation ? (
            <TouchableOpacity onPress={() => setToStation('')}>
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Swap Button */}
        <TouchableOpacity
          onPress={swapStations}
          style={{
            position: 'absolute',
            top: '35%',
            right: -20,
            backgroundColor: '#333',
            padding: 8,
            borderRadius: 50,
          }}
        >
          <MaterialIcons name="swap-vert" size={20} color="green" />
        </TouchableOpacity>
      </View>

      {/* Find Buses Button */}
      <TouchableOpacity
        onPress={handleFindTrains}
        disabled={loading}
        style={{ 
          backgroundColor: '#f49b33', 
          paddingVertical: 12, 
          borderRadius: 8, 
          marginBottom: 16,
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
            Find Buses
          </Text>
        )}
      </TouchableOpacity>

      {/* Search Bar for Found Buses */}
      {foundRoutes.length > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', borderRadius: 8, marginBottom: 16, paddingHorizontal: 12, paddingVertical: 8 }}>
          <TextInput
            placeholder="Search Bus Number or Route"
            placeholderTextColor="#aaa"
            style={{ flex: 1, color: 'white' }}
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity>
            <Ionicons name="search" size={22} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Results */}
      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
        {foundRoutes.length > 0 ? 'RESULTS' : 'SEARCH HISTORY'}
      </Text>

      <FlatList
        data={foundRoutes.length > 0 ? filteredRoutes : searchHistory}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={{ backgroundColor: '#333', borderRadius: 8, padding: 12, marginBottom: 8 }}
            onPress={() => handleRoutePress(item)}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              Bus: {item.busNumber || item.name}
            </Text>
            <Text style={{ color: 'white', fontSize: 14, marginTop: 4 }}>
              Route ID: {item.id}
            </Text>
            <Text style={{ color: '#aaa', fontSize: 13, marginTop: 2 }}>
              {item.routeName || item.route}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 20 }}>
            {foundRoutes.length === 0 ? 'No search history available' : 'No buses match your search'}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const searchHistory = [
  { id: '18117', name: 'Bus 06', route: 'Khandagiri - Silicon University' },
  { id: '18029', name: 'Bus 03', route: 'Lingipur - Silicon University' },
  { id: '18118', name: 'Bus 02', route: 'Master Canteen - Silicon University' },
  { id: '12841', name: 'Bus 01', route: 'Link Road - Silicon University' },
  { id: '22839', name: 'Bus 05', route: 'Mancheswar - Silicon University' },
  { id: '22840', name: 'Bus 04', route: 'Nandankanan - Silicon University' },
];