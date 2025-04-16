import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import avatar from '../../assets/images/9440461.jpg'

const ProfileScreen = () => {
  const handleLogout = () => {
    // TODO: Add your logout logic here
    console.log('Logging out...');
  };

  return (
    <View className="flex-1 bg-[#2b2b2b] items-center justify-center px-4">
      <Image
        source={avatar}
        className="w-32 h-32 rounded-full mb-4"
      />

      <Text className="text-2xl font-bold text-gray-800 mb-1">John Doe</Text>
      <Text className="text-white mb-6">User</Text>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-500 px-6 py-3 rounded-2xl"
      >
        <Text className="text-white text-base font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
