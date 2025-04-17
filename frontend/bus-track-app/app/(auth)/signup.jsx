import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, TextInput, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import logo from '../../assets/images/logo.png'
const entryImage = require('../../assets/images/entry-image.png')
import { Dimensions } from "react-native";
import { Formik } from 'formik';
import { useRouter } from "expo-router";
import validationSchema from '../../utils/authSchema'
import { API_URL } from '../../utils/config'


const Signup = () => {

  const {width} = Dimensions.get('window');
  const router = useRouter();

  const handleSignup = async (values) => {
    try {
      const { name, email, password } = values;
  
      const response = await fetch(`${API_URL}/tracker/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          identity: email,
          password,
          role: 'user',
          phone:'8979797878',
        }),
        credentials: 'include',
      });
  
      let data;
      const contentType = response.headers.get('content-type');
  
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Server returned non-JSON:', text);
        throw new Error('Server error: ' + text);
      }
  
      if (!response.ok) {
        throw new Error(data?.message || 'Signup failed');
      }
  
      Alert.alert('Success', 'User registered successfully!');
      router.push('/signin');
  
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message || 'Failed to sign up');
    }
  };
  

  return (
    <SafeAreaView className={`bg-[#2b2b2b]`}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#2b2b2b'} />
      <ScrollView contentContainerStyle={{height:'100%'}}>
        <View className="m-2 flex justify-center items-center">
          <Image source={logo} style={{width:width * 0.6, height:width * 0.6}} resizeMode="contain" />
          {/* Welcome Text */}
          <Text className="text-lg text-center text-white font-bold" >
            Let's get you started
          </Text>

          <View className="w-5/6">
            <Formik initialValues={{name: "", email:"", password:""}} validationSchema={validationSchema} onSubmit={handleSignup}>
              {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                <View className="w-full">
                  <Text className='text-[#f49b33] mt-4 mb-2'>Name</Text>
                  <TextInput className='h-10 border border-white text-white rounded px-2' keyboardType='name' onChangeText={handleChange("name")} onBlur={handleBlur("name")} value={values.name}/>
                  {touched.name && errors.name && (<Text className='text-red-500 text-xs mt-2 mb-2'>{errors.name}</Text>)}

                  <Text className='text-[#f49b33] mt-4 mb-2'>Email</Text>
                  <TextInput className='h-10 border border-white text-white rounded px-2' keyboardType='email-address' onChangeText={handleChange("email")} onBlur={handleBlur("email")} value={values.email}/>
                  {touched.email && errors.email && (<Text className='text-red-500 text-xs mt-2 mb-2'>{errors.email}</Text>)}

                  <Text className='text-[#f49b33] mt-4 mb-2'>Password</Text>
                  <TextInput className='h-10 border border-white text-white rounded px-2' secureTextEntry onChangeText={handleChange("password")} onBlur={handleBlur("password")} value={values.password}/>
                  {touched.password && errors.password && (<Text className='text-red-500 text-xs mt-2 mb-2'>{errors.password}</Text>)}

                  {/* Signup View */}
                  <TouchableOpacity onPress={handleSubmit} className="p-2 my-2 bg-[#f49b33] text-black rounded-lg mt-10">
                    <Text className="text-xl font-semibold text-center">
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            <View>
            <TouchableOpacity className="flex flex-row justify-center items-center my-4 p-2" onPress={() => router.push('/signin')}>
              <Text className="text-white font-semibold">Already a User? </Text>
              <Text className="text-base underline font-semibold text-[#f49b33]">Sign In</Text>
            </TouchableOpacity>
            </View>

          </View>

        </View>

        {/* Entry Image */}
        <View style={{ width: '100%', height: 200, marginTop: 20 }}>
          <Image source={entryImage} className="w-full h-full" resizeMode="contain" />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Signup