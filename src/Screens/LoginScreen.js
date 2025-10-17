import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../CommonFiles/Colors';
import { ENDPOINTS } from '../CommonFiles/Constant';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const logo = require('../assets/images/logo.png');
  const navigation = useNavigation();
  const [Email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Loading, setLoading] = useState(false);

  const [myDeviceId, setMyDeviceId] = useState(null);
  console.log('myDeviceId xxx', myDeviceId);

  const [showPassword, setShowPassword] = useState(false);

  const [EmailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // Fetch the unique device ID
    DeviceInfo.getUniqueId()
      .then(uniqueId => {
        setMyDeviceId(uniqueId);
        console.log('Device ID:', uniqueId);
      })
      .catch(error => {
        console.error('Error fetching device ID:', error);
      });
  }, []);

  const handleLogin = async () => {
    let isValid = true;

    // Reset errors
    setEmailError('');
    setPasswordError('');
    setLoginError('');

    // Validation for Mobile
    if (!Email) {
      setEmailError('Please Enter Mobile No');
      isValid = false;
    }

    // Password validation (minimum 4 characters)
    if (password.length < 6) {
      setPasswordError('Password Must be 6 Character');
      isValid = false;
    }

    if (isValid) {
      setLoading(true);
      try {
        const response = await fetch(ENDPOINTS.LOGIN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: Email,
            password: password,
            device_id: myDeviceId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to connect to the server');
        }

        const data = await response.json();
        console.log('Response:', data);

        // Check response status
        if (data.code == 200) {
          ToastAndroid.show('Login Successfully', ToastAndroid.SHORT);
          const staffId = data.payload.id;

          await AsyncStorage.setItem('staff_id', staffId);

          await AsyncStorage.setItem('id', myDeviceId);

          navigation.reset({
            index: 0, // Reset the stack
            routes: [{ name: 'DashboardScreen' }], // Navigate to HomeScreen
          });
        } else {
          setLoginError(data.message || 'Invalid credentials');
        }
      } catch (error) {
        console.error('Error:', error.message);
        setLoginError('Something went wrong. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <View style={{ height: 200 }}>
        <Image
          source={logo}
          style={{
            height: 160,
            width: 160,
            resizeMode: 'contain',
          }}
        />
      </View>
      <View style={{ width: '100%', paddingHorizontal: 20 }}>
        {/* Email input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: EmailError ? 'red' : '#d1d5db',
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            marginBottom: 7,
          }}>
          <Image
            source={require('../assets/images/mobile-phone.png')} // 👈 apne path ke hisab se adjust karna
            style={{ width: 22, height: 22, tintColor: '#b4b2b2ff', marginRight: 5 }}
            resizeMode="contain"
          />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              color: '#333',
              fontFamily: 'Inter-Regular',
            }}
            placeholder="Enter Mobile No"
            placeholderTextColor="grey"
            keyboardType="phone-pad"
            value={Email}
            onChangeText={setEmail}
          />
        </View>

        {EmailError ? (
          <Text
            style={{
              color: 'red',
              fontSize: 14,
              marginBottom: 5,
              marginLeft: 15,
              fontFamily: 'Inter-Regular',
            }}>
            {EmailError}
          </Text>
        ) : null}

        {/* Password Input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: passwordError ? 'red' : '#d1d5db',
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            marginBottom: 7,
            marginTop: 5,
          }}>
          <Image
            source={require('../assets/images/padlock.png')} // 👈 apne path ke hisab se adjust karna
            style={{ width: 22, height: 22, tintColor: '#c7c3c3ff', marginRight: 5 }}
            resizeMode="contain"
          />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              color: '#333',
              fontFamily: 'Inter-Regular',
            }}
            placeholder="Enter Password"
            placeholderTextColor="grey"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={
                showPassword
                  ? require('../assets/images/hide.png') // 👈 replace with your correct path
                  : require('../assets/images/view.png')
              }
              style={{ width: 20, height: 20, tintColor: 'gray' }}
              resizeMode="contain"
            />
          </TouchableOpacity>

        </View>

        {passwordError ? (
          <Text
            style={{
              color: 'red',
              fontSize: 14,
              marginBottom: 5,
              marginLeft: 15,
              fontFamily: 'Inter-Regular',
            }}>
            {passwordError}
          </Text>
        ) : null}
        {Loading ? (
          <View>
            <ActivityIndicator size="small" color={'#3b82f6'} />
          </View>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: colors.Brown,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 10,
            }}
            onPress={handleLogin}>
            <Text
              style={{
                color: 'white',
                fontWeight: '600',
                fontSize: 16,
                fontFamily: 'Inter-Regular',
              }}>
              Login
            </Text>
          </TouchableOpacity>
        )}
        {loginError ? (
          <Text
            style={{
              color: 'red',
              fontSize: 14,
              marginBottom: 10,
              marginLeft: 15,
              fontFamily: 'Inter-Regular',
            }}>
            {loginError}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
