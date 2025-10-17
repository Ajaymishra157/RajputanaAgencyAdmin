import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import colors from '../CommonFiles/Colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ENDPOINTS } from '../CommonFiles/Constant';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Use FontAwesome for the icons
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import AntDesign from 'react-native-vector-icons/AntDesign';

const SearchVehicle = () => {
  const vehicle = require('../assets/images/vehicle.png');
  const navigation = useNavigation();
  const [SearchVehicle, setSearchVehicle] = useState([]);
  console.log('search vehicleType', SearchVehicle);
  const [SearchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const textInputRef = useRef(null);

  const [text, setText] = useState(null);
  console.log('number', text);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Track dropdown visibility
  const [selectedType, setSelectedType] = useState('Reg No'); // Store selected type

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const [typeError, settypeError] = useState('');
  const [SearchError, setSearchError] = useState('');

  // Create a function that handles text change
  const handleTextChange = newText => {
    setText(newText);
    setSearchError('');
  };

  // Focus TextInput when the screen loads
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      }, 300); // 300ms delay

      return () => clearTimeout(timer);
    }, [])
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const availableTypes = ['Reg No', 'Chassis No', 'Eng No', 'Agg No'];

  // Function to toggle between types
  const toggleType = () => {
    setText('');
    setSearchError('');
    const currentIndex = availableTypes.indexOf(selectedType);
    const nextIndex = (currentIndex + 1) % availableTypes.length;
    setSelectedType(availableTypes[nextIndex]);
  };


  const [dropdownData] = useState([
    { label: 'Eng No', value: 'Eng No' },
    { label: 'Reg No', value: 'Reg No' },
    { label: 'Agg No', value: 'Agg No' },
    { label: 'Chassis No', value: 'Chassis No' },
  ]);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleSelect = type => {
    setSelectedType(type);
    setIsDropdownVisible(false); // Close the dropdown after selection
  };

  const openModal = item => {
    setSelectedHistory(item); // Set selected item data to show in the modal
    setModalVisible(true); // Show the modal
  };

  const closeModal = () => {
    setModalVisible(false); // Hide the modal
    setSelectedHistory(null); // Clear the selected item data
  };

  useFocusEffect(
    useCallback(() => {
      setIsDropdownVisible(false);
    }, []), // Empty array ensures this is called only when the screen is focused
  );

  const SearchVehicleApi = async () => {
    let isValid = true;

    // Check if both fields are empty
    if (!text) {
      setSearchError('Search No Is Required');
      isValid = false; // Invalid because Search No is empty
    } else if (text.length < 4) {
      setSearchError('Please Enter at least 4 digit');
      isValid = false; // Invalid because less than 4 digits
    } else {
      setSearchError(''); // Clear error if Search No is provided
    }

    if (!selectedType) {
      settypeError('Type Is Required');
      isValid = false; // Invalid because Type is empty
    } else {
      settypeError(''); // Clear error if Type is provided
    }

    if (!isValid) return;
    console.log('vehicle and number', selectedType, text);
    setSearchLoading(true);
    try {
      const response = await fetch(ENDPOINTS.Intimation_Vehicle, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedType,
          number: text,
        }),
      });

      // Check the status code first
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();


      if (result.code == 200) {

        setSearchVehicle(result.payload || []);
        setText('');

      } else {
        console.log('Error: Failed to load data');
        setSearchVehicle([]); // Set empty array if the result is not correct
      }
    } catch (error) {
      console.log('Error fetching data:', error.message);
    } finally {
      setSearchLoading(false);
    }
  };

  // useEffect(() => {
  //   SearchVehicleApi();
  // }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setSearchError('');
    settypeError('');
    await SearchVehicleApi();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: colors.Brown,
          paddingVertical: 15,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 15,
            left: 15,
            width: '13%',
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            source={require('../assets/images/back.png')} // 👈 apne image ka correct path lagao
            style={{ width: 26, height: 26, tintColor: '#fff' }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'Inter-Bold',
          }}>
          Search Vehicle
        </Text>
      </View>
      {/* Type Dropdown */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: 10,

        }}>
        {/* Dropdown button */}
        {/* <View style={{ position: 'relative', width: '27%' }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              paddingVertical: 13,
              paddingHorizontal: 8,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderColor: typeError ? 'red' : colors.Brown,
              borderWidth: 1,
              width: '100%',
            }}
            onPress={toggleDropdown}>
            <Text
              style={{
                paddingLeft: 8,
                fontSize: 11,
                fontFamily: 'Inter-Regular',
                color: selectedType ? 'black' : '#777',
              }}>
              {selectedType ? selectedType : 'Type'}
            </Text>

            <Ionicons
              name={isDropdownVisible ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="black"
            />
          </TouchableOpacity>

          {isDropdownVisible && (
            <View
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                borderRadius: 8,
                borderColor: '#ddd',
                borderWidth: 1,
                zIndex: 1,
                marginTop: 2,
                width: '100%',
              }}>
              <FlatList
                data={dropdownData}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      padding: 12,
                      borderBottomColor: '#ddd',
                      borderBottomWidth: 1,
                    }}
                    onPress={() => handleSelect(item.value)}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Inter-Regular',
                        color: 'black',
                      }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.value}
              />
            </View>
          )}
        </View> */}

        {/* Type Toggle Button */}
        <TouchableOpacity
          style={{
            backgroundColor: colors.Brown,
            paddingVertical: 10,
            paddingHorizontal: 8,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: typeError ? 'red' : colors.Brown,
            borderWidth: 1,
            width: '12.5%',
            marginLeft: 5,
          }}
          onPress={toggleType}>

          <Image
            source={require('../assets/images/two_arrows.png')} // 👈 apne image ka correct path lagao
            style={{ width: 22, height: 22, tintColor: 'white' }}
            resizeMode="contain"
          />
        </TouchableOpacity>


        {/* Search Text button */}
        <View
          style={{
            width: '68%',

            paddingHorizontal: 8,
            borderRadius: 8,
            borderWidth: 1,
            height: 50,
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: SearchError ? 'red' : colors.Brown,
          }}>
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              fontFamily: 'Inter-Regular',
              color: 'black',
              height: 50,
            }}
            ref={textInputRef}
            placeholder={`Enter ${selectedType}`}
            placeholderTextColor="grey"
            keyboardType='email-address'
            value={text}
            onChangeText={handleTextChange}
          />
          {text ? (
            <TouchableOpacity
              onPress={() => setText('')}
              style={{
                marginRight: 7,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/images/close.png')} // 👈 apne image ka correct path lagao
                style={{ width: 13, height: 13, tintColor: 'grey' }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null}
        </View>


        <TouchableOpacity
          style={{
            backgroundColor: colors.Brown,
            padding: 10,
            marginRight: 5,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            width: '12.5%',
          }}
          onPress={SearchVehicleApi}>
          <Image
            source={require('../assets/images/search.png')} // 👈 apne image ka correct path lagao
            style={{ width: 20, height: 20, tintColor: 'white' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      <View style={{ width: '100%', flexDirection: 'row' }}>

        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',

          }}>
          {SearchError ? (
            <Text
              style={{
                color: 'red',
                fontFamily: 'Inter-Regular',
                textAlign: 'center',
                fontSize: 14,
                marginLeft: 10,
              }}>
              {SearchError}
            </Text>
          ) : null}
        </View>
      </View>

    // ✅ FlatList use karo
      <FlatList
        data={SearchVehicle}
        keyboardShouldPersistTaps='handled'
        keyExtractor={(item) => item.full_vehicle_id?.toString() || Math.random().toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#fff',
              padding: 10,
              marginBottom: 7,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#ddd',
              alignItems: 'center',
            }}>
            <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, textAlign: 'center', color: 'black', fontFamily: 'Inter-Regular' }}>
                {index + 1}
              </Text>
            </View>

            <View style={{ width: '35%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, textAlign: 'center', color: 'black', fontFamily: 'Inter-Regular' }}>
                {item.vehicle_customer_name || '---'}
              </Text>
            </View>

            <View style={{ width: '35%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, textAlign: 'center', color: 'black', fontFamily: 'Inter-Regular' }}>
                {item.vehicle_registration_no || '---'}
              </Text>
            </View>

            <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('IntimationScreen', {
                    vehicleDetails: item,
                  });
                }}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Image
                  source={require('../assets/images/info.png')}
                  style={{ width: 20, height: 20, tintColor: colors.Brown }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListHeaderComponent={
          SearchVehicle.length > 0 ? (
            <View style={{
              flexDirection: 'row',
              backgroundColor: '#ddd',
              padding: 7,
              borderRadius: 5,
              marginBottom: 5,
              marginTop: 15
            }}>
              <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontFamily: 'Inter-Regular', textAlign: 'center', fontSize: 14, color: 'black' }}>
                  Sr no
                </Text>
              </View>
              <View style={{ width: '35%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontFamily: 'Inter-Regular', textAlign: 'center', fontSize: 14, color: 'black' }}>
                  Customer Name
                </Text>
              </View>
              <View style={{ width: '35%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontFamily: 'Inter-Regular', textAlign: 'center', fontSize: 14, color: 'black' }}>
                  RCNO
                </Text>
              </View>
              <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                <Text></Text>
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !SearchLoading ? (
            <View style={{ height: 400, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={vehicle} style={{ width: 70, height: 70, marginTop: 30 }} />
              <Text style={{ fontFamily: 'Inter-Regular', color: 'red', marginTop: 20 }}>
                No Vehicles Found
              </Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: keyboardVisible ? 80 : 80
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#9Bd35A', '#689F38']}
          />
        }
      />
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
          }}
          activeOpacity={1}
          onPress={closeModal}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 15,
              width: '85%',
              maxHeight: '80%', // Ensure modal does not overflow
            }}
            onStartShouldSetResponder={() => true} // Prevent modal from closing on content click
            onTouchEnd={e => e.stopPropagation()}>
            {selectedHistory && (
              <>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: 'Inter-Medium',
                      marginBottom: 20,
                      color: 'black',
                      textAlign: 'center',
                    }}>
                    Search Vehicle Details
                  </Text>
                  {/* <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: 5,
                      top: 12,
                      width: '20%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      borderWidth: 1,
                      backgroundColor: 'red',
                    }}
                    onPress={closeModal}>
                    <Entypo name="cross" size={30} color="black" />
                  </TouchableOpacity> */}
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled">
                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 10,
                      fontFamily: 'Inter-Regular',
                      color: 'black',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#333',
                        fontFamily: 'Inter-Medium',
                      }}>
                      Staff Name:{' '}
                    </Text>
                    {selectedHistory.vehicle_customer_name}
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 10,
                      fontFamily: 'Inter-Regular',
                      color: 'black',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#333',
                        fontFamily: 'Inter-Medium',
                      }}>
                      Rc No:{' '}
                    </Text>
                    {selectedHistory.vehicle_registration_no}
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 10,
                      fontFamily: 'Inter-Regular',
                      color: 'black',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#333',
                        fontFamily: 'Inter-Medium',
                      }}>
                      Engine No:{' '}
                    </Text>
                    {selectedHistory.vehicle_engine_no}
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 10,
                      fontFamily: 'Inter-Regular',
                      color: 'black',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#333',
                        fontFamily: 'Inter-Medium',
                      }}>
                      Chassis No:{' '}
                    </Text>
                    {selectedHistory.vehicle_chassis_no}
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 10,
                      fontFamily: 'Inter-Regular',
                      color: 'black',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#333',
                        fontFamily: 'Inter-Medium',
                      }}>
                      Entry Date:{' '}
                    </Text>
                    {selectedHistory.vehicle_entry_date}
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 10,
                      fontFamily: 'Inter-Regular',
                      color: 'black',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#333',

                        fontFamily: 'Inter-Medium',
                      }}>
                      Vehicle Status:{' '}
                    </Text>
                    <Text
                      style={{
                        color: selectedHistory.vehicle_status ? 'green' : 'red',
                        fontFamily: 'Inter-Regular',
                      }}>
                      {selectedHistory.vehicle_status}
                    </Text>
                  </Text>
                </ScrollView>

                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    backgroundColor: colors.Brown,
                    borderRadius: 10,
                    marginTop: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={closeModal}>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'Inter-Regular',
                      fontSize: 16,
                    }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default SearchVehicle;

const styles = StyleSheet.create({});
