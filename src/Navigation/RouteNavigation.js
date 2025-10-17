import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../Screens/LoginScreen';
import HomeScreen from '../Screens/HomeScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerNavigation from './DrawerNavigation';
import AddStaffScreen from '../Screens/AddStaffScreen';
import SearchHistory from '../Screens/SearchHistory';
import AddScheduleScreen from '../Screens/AddScheduleScreen';
import StaffSchedule from '../Screens/StaffSchedule';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../CommonFiles/Colors';
import DashboardScreen from '../Screens/DashboardScreen';
import SearchVehicle from '../Screens/SearchVehicle';
import IntimationScreen from '../Screens/IntimationScreen';
import SplashScreen from '../Screens/SplashScreen';
import NotificationScreen from '../Screens/NotificationScreen';
import informationScreen from '../Screens/informationScreen';
import WebviewScreen from '../Screens/WebviewScreen';
import FinanceList from '../Screens/FinanceList';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const RouteNavigation = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const id = await AsyncStorage.getItem('id');
      console.log('id hai ya staffid', id);

      if (id) {
        setInitialRoute('DashboardScreen');
      } else {
        setInitialRoute('LoginScreen');
      }
    };

    checkLoginStatus();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.Brown} />
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddStaffScreen"
          component={AddStaffScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchHistory"
          component={SearchHistory}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="StaffSchedule"
          component={StaffSchedule}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddScheduleScreen"
          component={AddScheduleScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DashboardScreen"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchVehicle"
          component={SearchVehicle}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="IntimationScreen"
          component={IntimationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name='NotificationScreen' component={NotificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name='informationScreen' component={informationScreen} options={{ headerShown: false }} />
        <Stack.Screen name='WebviewScreen' component={WebviewScreen} options={{ headerShown: false }} />
        <Stack.Screen name='FinanceList' component={FinanceList} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

// const RouteNavigation = () => {
//   return (
//     <NavigationContainer>
//       <Drawer.Navigator
//         drawerContent={props => <DrawerNavigation {...props} />}>
//         <Drawer.Screen
//           name="MainStack"
//           component={MainStack}
//           options={{headerShown: false}}
//         />
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// };

export default RouteNavigation;

const styles = StyleSheet.create({});
