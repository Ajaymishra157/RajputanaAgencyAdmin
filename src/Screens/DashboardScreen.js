import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View, Image, Alert, Modal, BackHandler } from 'react-native';
import colors from '../CommonFiles/Colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNExitApp from 'react-native-exit-app';
import { getVersion, getBuildNumber } from 'react-native-device-info';

const DashboardScreen = () => {
  const logout = require('../assets/images/logout.png');
  const sports = require('../assets/images/sportbike.png');
  const [ConfrimationModal, setConfrimationModal] = useState(false);
  const [CloseAppModal, setCloseAppModal] = useState(false);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setCloseAppModal(true); // Exit modal show karega
        return true; // Back action ko handle kiya (default behavior rok diya)
      };

      // BackHandler event add karein
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      // Cleanup function
      return () => backHandler.remove();
    }, [])
  );

  const getAppVersion = () => {
    try {

      // Option 2: Using react-native-device-info
      return `${getVersion()}.${getBuildNumber()}`;
      // return `${getBuildNumber()}`;

    } catch (error) {
      return '1.0.0';
    }
  };



  // const handleLogout = async () => {
  //   Alert.alert(
  //     'Logout',
  //     'Are you sure you want to logout?',
  //     [
  //       {
  //         text: 'No',
  //         onPress: () => console.log('Cancel pressed'),
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Yes',
  //         onPress: async () => {
  //           console.log('User logged out');
  //           await AsyncStorage.removeItem('id');

  //           navigation.reset({
  //             index: 0,
  //             routes: [{name: 'LoginScreen'}],
  //           });
  //         },
  //       },
  //     ],
  //     {cancelable: false},
  //   );
  // };

  const closeExitModal = () => {
    setCloseAppModal(false);
  }
  const confirmExit = () => {
    RNExitApp.exitApp();
  };

  const handleLogout = async () => {
    setConfrimationModal(true);

  };

  const confirmLogout = async () => {
    await AsyncStorage.removeItem('id'); // User data clear karega

    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }], // LoginScreen par redirect karega
    });
    setConfrimationModal(false); // Modal ko close karega
  };


  const closeconfirmodal = () => {
    setConfrimationModal(false); // Hide the modal
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
      <View
        style={{
          backgroundColor: colors.Brown,
          paddingVertical: 15,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'Inter-Bold',
          }}>
          Rajputana Agency
        </Text>
        <TouchableOpacity
          style={{ position: 'absolute', right: 10, top: 18 }}
          onPress={handleLogout}>
          <Image
            source={logout}
            style={{ width: 25, height: 25, tintColor: 'white' }}
          />
        </TouchableOpacity>
      </View>
      {/* Row container */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: 30,
          paddingHorizontal: 15,
        }}>
        {/* First Box (Staff) */}
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: 15,
            width: 100,
            height: 120,
            padding: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 8, // For Android
          }}
          onPress={() => {
            navigation.navigate('HomeScreen');
          }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.Brown,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Image
              source={require('../assets/images/person.png')} // 👈 path apne file ke hisab se change karna
              style={{ width: 23, height: 23, tintColor: '#fff' }}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              color: 'black',
              fontSize: 13,
              textAlign: 'center',
              fontFamily: 'Inter-Medium',
            }}>
            Staff
          </Text>
        </TouchableOpacity>

        {/* Second Box (Schedule) */}
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: 15,
            width: 100,
            height: 120,
            padding: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 8, // For Android
          }}
          onPress={() => {
            navigation.navigate('StaffSchedule');
          }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.Brown,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Image
              source={require('../assets/images/calendar.png')} // 👈 apne image ka exact path
              style={{ width: 23, height: 23, tintColor: '#fff' }}
              resizeMode="contain"
            />

          </View>
          <Text
            style={{
              color: 'black',
              fontSize: 13,
              textAlign: 'center',
              fontFamily: 'Inter-Medium',
            }}>
            Schedule
          </Text>
        </TouchableOpacity>
        {/* Third Box (Search History) */}
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: 15,
            width: 100,
            height: 120,
            padding: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 8, // For Android
          }}
          onPress={() => {
            navigation.navigate('SearchVehicle');
          }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.Brown,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Image
              source={sports}
              style={{ width: 25, height: 25, tintColor: 'white' }}
            />
          </View>
          <Text
            style={{
              color: '#000', // Change text color to make it more visible on white
              fontSize: 13,
              textAlign: 'center',
              fontFamily: 'Inter-Medium',
            }}>
            Intimation
          </Text>
        </TouchableOpacity>
      </View>

      {/* Row container */}
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          marginTop: 30,
          paddingHorizontal: 15,
          gap: 25
        }}>
        {/* Four Box (Search History) */}
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: 15,
            width: 100,
            height: 120,
            padding: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 8, // For Android
          }}
          onPress={() => {
            navigation.navigate('SearchHistory');
          }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.Brown,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Image
              source={require('../assets/images/search.png')} // 👈 apne actual path ke hisab se badal lena
              style={{ width: 23, height: 23, tintColor: '#fff' }}
              resizeMode="contain"
            />

          </View>
          <Text
            style={{
              color: 'black',
              fontSize: 13,
              textAlign: 'center',
              fontFamily: 'Inter-Medium',
            }}>
            Search History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: 15,
            width: 100,
            height: 120,
            padding: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 8, // For Android
          }}
          onPress={() => {
            navigation.navigate('NotificationScreen'); // 👈 aap isko apne screen ke naam se replace kar lo
          }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.Brown, // 🔴 notification color (red shade)
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Image
              source={require('../assets/images/belll.png')} // 👈 apne correct path ke hisab se badal lena
              style={{ width: 22, height: 22, tintColor: '#fff' }}
              resizeMode="contain"
            />

          </View>
          <Text
            style={{
              color: 'black',
              fontSize: 13,
              textAlign: 'center',
              fontFamily: 'Inter-Medium',
            }}>
            Notification
          </Text>
        </TouchableOpacity>



        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: 15,
            width: 100,
            height: 120,
            padding: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 8, // For Android
          }}
          onPress={() => {
            navigation.navigate('AppSetting');
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 30,
              backgroundColor: colors.Brown,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
              borderWidth: 1,
              // Royal Blue
            }}
          >
            <Image source={require('../assets/images/settings.png')} style={{ width: 24, height: 24, tintColor: 'white' }} />

          </View>
          <Text
            style={{
              color: 'black',
              fontSize: 12,
              textAlign: 'center',
              fontFamily: 'Inter-Medium',
            }}
          >
            App Settings
          </Text>
        </TouchableOpacity>


      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          backgroundColor: '#f8f8f8',
        }}
      >
        <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={require('../assets/images/git.png')}
            style={{ width: 20, height: 20, tintColor: colors.Brown }}
          />
        </View>

        <View style={{ width: '75%' }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Inter-Medium',
              color: colors.Brown,
            }}
          >
            Version
          </Text>
        </View>

        <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Inter-Medium',
              color: colors.Brown,
            }}
          >
            {getAppVersion()}
          </Text>
        </View>
      </View>


      <Modal
        animationType="fade"
        transparent={true}
        visible={ConfrimationModal}
        onRequestClose={closeconfirmodal}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onPress={closeconfirmodal}
          activeOpacity={1}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 8,
              width: '80%',
              alignItems: 'center',
            }}
            onStartShouldSetResponder={() => true} // Prevent modal from closing on content click
            onTouchEnd={e => e.stopPropagation()}>
            <Text style={{
              fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'black', fontFamily: 'Inter-Medium'
            }}>
              Logout
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 20, textAlign: 'center', color: 'black', fontFamily: 'Inter-Medium' }}>
              Are you sure you want to Logout ?
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#ddd',
                  padding: 10,
                  borderRadius: 5,
                  width: '45%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={closeconfirmodal}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontFamily: 'Inter-Regular',
                  }}>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.Brown,
                  padding: 10,
                  borderRadius: 5,
                  width: '45%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={confirmLogout}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontFamily: 'Inter-Regular',
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>


      <Modal
        animationType="fade"
        transparent={true}
        visible={CloseAppModal}
        onRequestClose={closeExitModal}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onPress={closeExitModal}
          activeOpacity={1}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 8,
              width: '80%',
              alignItems: 'center',
            }}
            onStartShouldSetResponder={() => true} // Prevent modal from closing on content click
            onTouchEnd={e => e.stopPropagation()}>
            <Text style={{
              fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'black', fontFamily: 'Inter-Medium'
            }}>
              Confirmation
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 20, textAlign: 'center', color: 'black', fontFamily: 'Inter-Medium' }}>
              Are you sure you want to Really Exit ?
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#ddd',
                  padding: 10,
                  borderRadius: 5,
                  width: '45%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={closeExitModal}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontFamily: 'Inter-Regular',
                  }}>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.Brown,
                  padding: 10,
                  borderRadius: 5,
                  width: '45%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={confirmExit}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontFamily: 'Inter-Regular',
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DashboardScreen;
