import { useRouter } from "expo-router";
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from '../assets/images/logo.png'
// import entryImage from '../assets/images/entry-image.png'
const entryImage = require('../assets/images/entry-image.png')
// const logo = require('../assets/images/react-logo.png')

import { Dimensions } from "react-native";

const {width} = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  return (
    <SafeAreaView className={`bg-[#2b2b2b]`}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#2b2b2b'} />
      <ScrollView contentContainerStyle={{height:'100%'}}>
        <View className="m-2 flex justify-center items-center">
          <Image source={logo} style={{width:width * 0.6, height:width * 0.6}} resizeMode="contain" />
          {/* Welcome Text */}
          <View className="p-12">
            <Text className="text-3xl text-center text-white">
              Welcome!
            </Text>
          </View>

          {/* horizontal bar */}
          <View>
            <Text className="text-center text-base font-semibold my-4 text-white">
            <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-32"/> 
            <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-32"/>
            </Text>
          </View>

          {/* User views*/}
          <View className="w-3/4">
          {/* Signup View */}
          <TouchableOpacity onPress={() => router.push('/signup')} className="p-2 my-2 bg-[#f49b33] text-black rounded-lg">
            <Text className="text-xl font-semibold text-center">
              Sign Up
            </Text>
          </TouchableOpacity>

          {/* Guest View */}
          <TouchableOpacity onPress={() => router.push('/home')} className="p-2 my-2 bg-[#2b2b2b] border border-[#f49b33] rounded-lg max-w-fit">
            <Text className="text-xl font-semibold text-[#f49b33] text-center">
              Guest User
            </Text>
          </TouchableOpacity>
          </View>

          <View>
            <Text className="text-center text-xl font-semibold my-4 text-white">
              <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-28"/>     or{' '}
              <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-28"/>
            </Text>

            {/* SignIn view */}
            <TouchableOpacity className="flex flex-row justify-center items-center" onPress={() => router.push('/signin')}>
              <Text className="text-white font-semibold">Already a User? </Text>
              <Text className="text-base underline font-semibold text-[#f49b33]">Sign In</Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* Entry Image */}
        <View style={{ width: '100%', height: 200, marginTop: 20 }}>
          <Image source={entryImage} className="w-full h-full" resizeMode="contain" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
