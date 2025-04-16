import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { API_URL } from '../../utils/config';


export default function HomeScreen() {
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [foundRoutes, setFoundRoutes] = useState([]);
  const [searchText, setSearchText] = useState('');

  const swapStations = () => {
    setFromStation(toStation);
    setToStation(fromStation);
  };

  const handleFindTrains = async () => {
    Keyboard.dismiss();

    if (!fromStation || !toStation) {
      alert('Please enter both stations.');
      return;
    }

    try {
      const routesRes = await fetch(`${API_URL}/tracker/auth/getAllRoutes`);
      const routes = await routesRes.json();

      console.log(routesRes);
      console.log(fromStation)
      console.log(toStation)
      

      const matchingRoutes = [];
      
      for (const route of routes.routes) {
        const stopsRes = await fetch(`${API_URL}/tracker/auth/getStopsByRoute/${route._id}`);
        const stops = await stopsRes.json();

        // console.log(stops.stops);
        
        
        const stopNames = stops.stops.map(stop => stop?.stopId.name.toLowerCase());
        const fromIndex = stopNames.includes(fromStation.toLowerCase());
        const toIndex = stopNames.includes(toStation.toLowerCase());
        console.log(stopNames);
        console.log(`Route: ${route.name}, Stops:`, stopNames);
        console.log(`From Index: ${fromIndex}, To Index: ${toIndex}`);
        if (fromIndex && toIndex) {
          matchingRoutes.push({
            id: route._id,
            name: route.routeName
          });
        }
      }
      console.log("+++++++++++++++++++++++++++=");
      
      setFoundRoutes(matchingRoutes);
      console.log(matchingRoutes)

      if (matchingRoutes.length === 0) {
        alert('No matching buses found.');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching data.');
    }
  };

  const filteredRoutes = foundRoutes.filter(route =>
    route.name.toLowerCase().includes(searchText.toLowerCase())
  );

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
          <TouchableOpacity onPress={() => setFromStation('')}>
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
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
          <TouchableOpacity onPress={() => setToStation('')}>
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
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
        style={{ backgroundColor: '#f49b33', paddingVertical: 12, borderRadius: 8, marginBottom: 16 }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
          Find Buses
        </Text>
      </TouchableOpacity>

      {/* Search Bar for Found Buses */}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', borderRadius: 8, marginBottom: 16, paddingHorizontal: 12, paddingVertical: 8 }}>
        <TextInput
          placeholder="Search Bus Number"
          placeholderTextColor="#aaa"
          style={{ flex: 1, color: 'white' }}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity>
          <Ionicons name="search" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Results */}
      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
        {foundRoutes.length > 0 ? 'RESULTS' : 'SEARCH HISTORY'}
      </Text>

      <FlatList
        data={foundRoutes.length > 0 ? filteredRoutes : searchHistory}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ backgroundColor: '#333', borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <Text style={{ color: 'white', fontSize: 16 }}>{item.id}  {item.name}</Text>
            <Text style={{ color: '#aaa', fontSize: 13 }}>{item.route}</Text>
          </TouchableOpacity>
        )}
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
