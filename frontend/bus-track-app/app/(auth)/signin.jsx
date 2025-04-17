import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, TextInput, Alert, Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import { useRouter } from 'expo-router';
import * as Yup from 'yup';
import { API_URL } from '../../utils/config';

// Assets
import logo from '../../assets/images/logo.png';
const entryImage = require('../../assets/images/entry-image.png');

// Custom validation schema for signin
const signinSchema = Yup.object().shape({
  email: Yup.string().required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Signin = () => {
  const { width } = Dimensions.get('window');
  const router = useRouter();

  const handleSignin = async (values) => {
    try {
      const { email, password } = values;
      console.log('Submitted values:', values);
  
      const response = await fetch(`${API_URL}/tracker/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identity: email,
          password,
        }),
        credentials: 'include',
      });
  
      const contentType = response.headers.get('content-type');
      let data;
  
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error('Server error: ' + text);
      }
  
      if (!response.ok) {
        throw new Error(data?.message || 'Signin failed');
      }
  
      console.log(data)
      // ✅ Check role
      if (data?.role == 'driver') {

        Alert.alert('Success', 'Logged in as driver!');
        router.push({
          pathname: '/driver',
          params:{
            driverId: data.id,
            email: data.identity,
          }
        });
      }
      else{
        router.push('/home'); // Replace with actual driver route
      }
    } catch (error) {
      console.error('Signin error:', error);
      Alert.alert('Error', error.message || 'Failed to sign in');
    }
  };
  

  return (
    <SafeAreaView className="bg-[#2b2b2b]">
      <StatusBar barStyle="light-content" backgroundColor="#2b2b2b" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="m-2 flex justify-center items-center">
          <Image source={logo} style={{ width: width * 0.6, height: width * 0.6 }} resizeMode="contain" />
          <Text className="text-lg text-center text-white font-bold mb-16">
            Log In to your account
          </Text>

          <View className="w-5/6">
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={signinSchema}
              onSubmit={handleSignin}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View className="w-full">
                  <Text className="text-[#f49b33] mt-4 mb-2">Email</Text>
                  <TextInput
                    className="h-10 border border-white text-white rounded px-2"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                  />
                  {touched.email && errors.email && (
                    <Text className="text-red-500 text-xs mt-2 mb-2">{errors.email}</Text>
                  )}

                  <Text className="text-[#f49b33] mt-4 mb-2">Password</Text>
                  <TextInput
                    className="h-10 border border-white text-white rounded px-2"
                    secureTextEntry
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                  />
                  {touched.password && errors.password && (
                    <Text className="text-red-500 text-xs mt-2 mb-2">{errors.password}</Text>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      console.log("Sign In button pressed");
                      handleSubmit(); // Trigger form submission
                    }}
                    className="p-2 my-2 bg-[#f49b33] text-black rounded-lg mt-10"
                  >
                    <Text className="text-xl font-semibold text-center">Sign In</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            <TouchableOpacity
              className="flex flex-row justify-center items-center my-4 p-2"
              onPress={() => router.push('/signup')}
            >
              <Text className="text-white font-semibold">New User? </Text>
              <Text className="text-base underline font-semibold text-[#f49b33]">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ width: '100%', height: 200, marginTop: 20 }}>
          <Image source={entryImage} className="w-full h-full" resizeMode="contain" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;
