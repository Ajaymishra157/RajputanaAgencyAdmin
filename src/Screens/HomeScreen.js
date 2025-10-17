import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
  ToastAndroid,
  Modal,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Header from '../Component/Header';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ENDPOINTS } from '../CommonFiles/Constant';
import colors from '../CommonFiles/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import EvilIcons from 'react-native-vector-icons/EvilIcons'
import StaffShimmer from '../Component/StaffShimmer';

const HomeScreen = () => {
  const Staff = require('../assets/images/team.png');
  const account = require('../assets/images/user.png');
  const navigation = useNavigation();
  const [StaffList, setStaffList] = useState([]);
  const [StaffLoading, setStaffLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [selectedStaffName, setselectedStaffName] = useState(null);
  const [DeviceId, setDeviceId] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [InfoModal, SetInfoModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [text, setText] = useState(null);
  const [ConfrimationModal, setConfrimationModal] = useState(false);

  const [originalStaffData, setoriginalStaffData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [ResetModal, setResetModal] = useState(false);








  const OpenModal = staff => {
    setSelectedStaff(staff);
    setIsModalVisible(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalVisible(false); // Close the modal
  };

  const closeModal = () => {
    SetInfoModal(false); // Hide the modal
  };

  const closeconfirmodal = () => {
    setConfrimationModal(false); // Hide the modal
  };

  const closeResetModal = () => {
    setResetModal(false); // Hide the modal
  };



  const OpenResetModal = (item) => {
    setSelectedStaffId(item.staff_id);
    setselectedStaffName(item.staff_name);
    setDeviceId(item.device_id);
    setResetModal(true); // Hide the modal
  };

  const handleEdit = () => {
    navigation.navigate('AddStaffScreen', {
      staff_id: selectedStaff.staff_id,
      staff_name: selectedStaff.staff_name,
      staff_email: selectedStaff.staff_email,
      staff_mobile: selectedStaff.staff_mobile,
      staff_address: selectedStaff.staff_address,
      staff_password: selectedStaff.staff_password,
      staff_type: selectedStaff.staff_type,
    });
    handleCloseModal(); // Close the modal after action
  };

  // const handleDelete = () => {
  //   DeleteStaffApi(selectedStaff.staff_id); // Call Delete API with the selected staff ID
  //   handleCloseModal(); // Close the modal after action
  // };

  const handleDelete = () => {
    setConfrimationModal(true);
    handleCloseModal();
    // Call Delete API with the selected staff ID
  };

  const DeleteStaffApi = async staffId => {
    console.log('staffId', staffId);
    try {
      const response = await fetch(ENDPOINTS.Delete_Staff, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          staff_id: staffId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.code === 200) {
          ToastAndroid.show('Staff Deleted Successfully', ToastAndroid.SHORT);
          fetchData();
        } else {
          console.log('Error:', 'Failed to load staff data');
        }
      } else {
        console.log('HTTP Error:', result.message || 'Something went wrong');
      }
    } catch (error) {
      console.log('Error fetching data:', error.message);
    } finally {
    }
  };

  const handleTextChange = (inputText) => {
    setText(inputText);

    // If inputText is empty, show the original data
    if (inputText === '') {
      setStaffList(originalStaffData);  // Reset to original data
    } else {
      // Filter data based on Name, Reg No, or Agg No
      const filtered = originalStaffData.filter(item => {
        const lowerCaseInput = inputText.toLowerCase();
        return (
          item.staff_name.toLowerCase().includes(lowerCaseInput) ||
          item.staff_mobile.toLowerCase().includes(lowerCaseInput)

        );
      });

      setStaffList(filtered); // Update filtered data state
    }
  };

  const fetchData = async () => {
    setStaffLoading(true);
    try {
      const response = await fetch(ENDPOINTS.List_Staff, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // trainer_id: trainerId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.code === 200) {
          setStaffList(result.payload); // Successfully received data
          setoriginalStaffData(result.payload);
        } else {
          console.log('Error:', 'Failed to load staff data');
        }
      } else {
        console.log('HTTP Error:', result.message || 'Something went wrong');
      }
    } catch (error) {
      console.log('Error fetching data:', error.message);
    } finally {
      setStaffLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []), // Empty array ensures this is called only when the screen is focused
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };


  const DeviceIdReset = async (Id) => {
    console.log("Api called succussfuly");

    try {
      const response = await fetch(ENDPOINTS.reset_Device_Id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          staff_id: Id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.code === 200) {
          ToastAndroid.show("Reset Device Id successfully", ToastAndroid.SHORT);
          setResetModal(false);
          fetchData();
        } else {
          console.log('Error:', 'Failed to load staff data');
        }
      } else {
        console.log('HTTP Error:', result.message || 'Something went wrong');
      }
    } catch (error) {
      console.log('Error fetching data:', error.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* <Header
        title="Rajputana Agency"
        // onMenuPress={() => navigation.openDrawer()}
      /> */}
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
          Staff List
        </Text>
      </View>

      <View style={{ width: '100%', paddingHorizontal: 10 }}>
        <View
          style={{
            width: '100%',

            borderWidth: 1,
            borderColor: colors.Brown,
            marginTop: 5,
            marginBottom: 5,
            borderRadius: 8,
            height: 50,
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: colors.Brown,

          }}>
          <Image
            source={require('../assets/images/search.png')} // 👈 apne image ka correct path lagao
            style={{ width: 18, height: 18, tintColor: 'grey', marginLeft: 5, }}
            resizeMode="contain"
          />

          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              fontFamily: 'Inter-Regular',
              marginLeft: 8,
              color: 'black',
              height: 50,
            }}

            placeholder="Search Staff Name/Mobile No"
            placeholderTextColor="grey"
            value={text}
            onChangeText={handleTextChange}
          />
          {text ? (
            <TouchableOpacity
              onPress={() => {

                setText(''); // Clear the search text
                setStaffList(originalStaffData);

              }}
              style={{
                marginRight: 7,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/images/close.png')} // 👈 apne image ka correct path lagao
                style={{ width: 14, height: 14, tintColor: 'black' }}
                resizeMode="contain"
              />

            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#9Bd35A', '#689F38']}
          />
        }>
        {/* <View
          style={{
            height: 60,
            justifyContent: 'flex-end',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.Brown,
              borderRadius: 10,
              marginRight: 15,
              width: '30%',
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              gap: 7,
            }}
            onPress={() => {
              navigation.navigate('AddStaffScreen');
            }}>
            <AntDesign name="plus" color="white" size={18} />
            <Text style={{color: 'white', fontFamily: 'Inter-Regular'}}>
              Add New
            </Text>
          </TouchableOpacity>
        </View> */}

        {/* Table Header */}
        {/* <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#ddd',
            padding: 7,
            borderRadius: 5,
          }}>
          <View
            style={{
              width: '15%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                flex: 1,
                fontWeight: 'bold',
                marginLeft: 5,
                fontFamily: 'Inter-Regular',
                textAlign: 'center',
                fontSize: 14,
                color: 'black',
              }}>
              Sr no
            </Text>
          </View>
          <View
            style={{
              width: '25%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                flex: 2,
                fontWeight: 'bold',
                marginLeft: 5,
                fontFamily: 'Inter-Regular',
                textAlign: 'center',
                fontSize: 14,
                color: 'black',
              }}>
              Name
            </Text>
          </View>

          <View
            style={{
              width: '25%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                flex: 1,
                fontWeight: 'bold',
                marginLeft: 5,
                fontFamily: 'Inter-Regular',
                textAlign: 'left',
                fontSize: 14,
                color: 'black',
              }}>
              Type
            </Text>
          </View>
          <View
            style={{
              width: '25%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                flex: 2,
                fontWeight: 'bold',
                marginLeft: 5,
                fontFamily: 'Inter-Regular',
                textAlign: 'left',
                fontSize: 14,
                color: 'black',
              }}>
              Date
            </Text>
          </View>
          <View
            style={{
              width: '10%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                flex: 2,
                fontWeight: 'bold',
                marginLeft: 5,
                fontFamily: 'Inter-Regular',
                textAlign: 'right',
                fontSize: 14,
                color: 'black',
              }}></Text>
          </View>
        </View> */}

        {/* Loading Indicator */}
        {StaffLoading ? (
          <View
            style={{ flex: 1, }}>
            <View style={{ padding: 10 }}>
              {[...Array(7)].map((_, index) => (
                <StaffShimmer key={index} />
              ))}
            </View>
          </View>
        ) : StaffList.length === 0 ? (
          <View style={{ height: 600, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={Staff} style={{ width: 70, height: 70 }} />
            <Text style={{ fontFamily: 'Inter-Regular', color: 'red', marginTop: 10 }}>
              No Staff Found
            </Text>
          </View>
        ) : (
          StaffList.map((item, index) => (
            <TouchableOpacity
              key={item.staff_id}
              style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                padding: 10,
                margin: 13,
                marginBottom: 7,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#ddd',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              activeOpacity={1}
              onPress={() =>
                navigation.navigate('informationScreen', {
                  userData: item,
                  setStaffList: setStaffList, // ✅ correctly passed
                })
              }
            >
              <View style={{ flexDirection: 'row', width: '50%' }}>
                <View style={{ width: '30%', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <TouchableOpacity
                    onPress={() => {
                      const imgSrc = item.staff_image
                        ? { uri: `https://rajputana.webmastersinfotech.in/${encodeURI(item.staff_image)}` }
                        : account;

                      setSelectedImage(imgSrc);  // set image
                      setModalVisible(true);     // open modal
                    }}
                    activeOpacity={0.8}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      overflow: 'hidden',
                      borderWidth: 1,
                      borderColor: '#ccc',
                    }}
                  >
                    <Image
                      source={
                        item.staff_image
                          ? { uri: `https://rajputana.webmastersinfotech.in/${encodeURI(item.staff_image)}` }
                          : account
                      }
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>

                <View style={{ width: '70%', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 5 }}>

                  {/* Name */}
                  <Text
                    style={{
                      fontSize: 12,
                      textAlign: 'left',
                      color: 'black',
                      fontFamily: 'Inter-Regular',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.staff_name || '----'}
                  </Text>

                  {/* Mobile */}
                  <Text
                    style={{
                      fontSize: 12,
                      textAlign: 'left',
                      color: 'black',
                      fontFamily: 'Inter-Regular',
                    }}
                  >
                    {item.staff_mobile || '----'}
                  </Text>

                  {/* User Type */}
                  <Text
                    style={{
                      fontSize: 12,
                      textAlign: 'left',
                      color: 'black',
                      fontFamily: 'Inter-Regular',
                    }}
                  >
                    {item.staff_type === 'Field' ? 'User' : item.staff_type || '----'}
                  </Text>

                </View>
              </View>

              <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={{ width: '60%', justifyContent: 'center', alignItems: 'flex-end' }}>
                  <View style={{ width: '80%', justifyContent: 'center', alignItems: 'center' }}>


                    <TouchableOpacity
                      style={{
                        backgroundColor: 'white',
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: colors.Brown,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 5
                      }}
                      onPress={() => OpenResetModal(item)}
                    >
                      <Text style={{ color: colors.Brown, fontSize: 12, fontWeight: 'bold', fontFamily: 'Inter-Medium' }}>
                        Reset
                      </Text>
                      <Image
                        source={require('../assets/images/mobile-phone.png')}
                        style={{ width: 21, height: 21, tintColor: colors.Brown }}
                      />
                    </TouchableOpacity>


                  </View>
                </View>

                {/* Actions Column */}

                <TouchableOpacity
                  onPress={() => OpenModal(item)}
                  style={{ width: '20%', justifyContent: 'center', alignItems: 'flex-start' }}
                >
                  <Image
                    source={require('../assets/images/dots.png')}
                    style={{ width: 18, height: 18, tintColor: 'black' }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

              </View>
            </TouchableOpacity>
          ))
        )}
        <View
          style={{
            paddingBottom: 85,
            backgroundColor: 'white',
          }}
        />
      </ScrollView>

      {/* Sticky Add New Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          right: 30,
          width: 60, // Set the width and height equal for a perfect circle
          height: 60, // Set height equal to the width
          zIndex: 1,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: colors.Brown,
            borderRadius: 30, // Set borderRadius to half of width/height for a circle
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 7,
          }}
          onPress={() => {
            navigation.navigate('AddStaffScreen');
          }}>
          <Image
            source={require('../assets/images/plus.png')} // 👈 apne correct image path ke hisab se change karo
            style={{ width: 18, height: 18, tintColor: '#fff' }}
            resizeMode="contain"
          />

        </TouchableOpacity>
      </View>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          activeOpacity={1}
          onPress={handleCloseModal}>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              width: '80%',
              paddingVertical: 5,
            }}>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={{
                padding: 7,
                backgroundColor: 'white',
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/images/close.png')}
                style={{
                  width: 10,
                  height: 10,
                  tintColor: 'black'
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 15,
              width: '80%',
              alignItems: 'center',
              elevation: 5, // Adds shadow for Android
              shadowColor: '#000', // Shadow for iOS
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
            }}
            onStartShouldSetResponder={() => true} // Prevent modal from closing on content click
            onTouchEnd={e => e.stopPropagation()}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 20,
                  color: 'black',
                  fontFamily: 'Inter-Regular',
                }}>
                Select Action
              </Text>

            </View>
            <View style={{ gap: 3, width: '80%' }}>
              {/* Delete Leave Button */}
              <TouchableOpacity
                style={{
                  borderColor: 'red',
                  borderWidth: 1,
                  borderRadius: 10,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 12,
                  flexDirection: 'row',
                  gap: 15,
                }}
                onPress={handleDelete}>
                <Image
                  source={require('../assets/images/delete.png')} // 👈 apne image ka correct path lagao
                  style={{ width: 24, height: 24, tintColor: 'red' }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    color: 'red',
                    fontFamily: 'Inter-Regular',
                    fontSize: 16,
                  }}>
                  Delete Staff
                </Text>
              </TouchableOpacity>
              {/* Update Leave Button */}
              <TouchableOpacity
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  borderRadius: 10,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 12,
                  marginTop: 10,
                  flexDirection: 'row',
                  gap: 15,
                }}
                onPress={handleEdit}>
                <Image
                  source={require('../assets/images/edit-text.png')} // 👈 apne image ka correct path lagao
                  style={{ width: 24, height: 24, tintColor: 'black' }}
                  resizeMode="contain"
                />

                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Inter-Regular',
                    fontSize: 16,
                  }}>
                  Update Staff
                </Text>
              </TouchableOpacity>

              {/* Info Staff Button */}
              {/* <TouchableOpacity
                style={{
                  borderColor: colors.Brown,
                  borderWidth: 1,
                  borderRadius: 10,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 12,
                  marginTop: 10,
                  flexDirection: 'row',
                  gap: 15,
                }}
                onPress={() => {
                  SetInfoModal(true);
                  setIsModalVisible(false);
                }}>
                <Image
                  source={require('../assets/images/info.png')} // 👈 apne image ka correct path lagao
                  style={{ width: 20, height: 20, tintColor: colors.Brown }}
                  resizeMode="contain"
                />


                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Inter-Regular',
                    fontSize: 16,
                  }}>
                  Information Staff
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal visible={InfoModal} transparent={true} animationType="slide">
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          activeOpacity={1}
          onPress={closeModal}>

          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 15,
              width: '85%',
              maxHeight: '80%',
            }}
            onStartShouldSetResponder={() => true}
            onTouchEnd={e => e.stopPropagation()}>
            {selectedStaff && (
              <>
                {/* ===== Header ===== */}
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    marginBottom: 15,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: 'Inter-Medium',
                      color: 'black',
                      textAlign: 'center',
                    }}>
                    Staff Information
                  </Text>
                </View>

                {/* ===== Scrollable Details Table ===== */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ maxHeight: 400 }}
                  keyboardShouldPersistTaps="handled">
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 8,
                      overflow: 'hidden',
                      marginBottom: 15,
                    }}>
                    {[
                      { label: 'Staff Name', value: selectedStaff.staff_name || '-----' },
                      { label: 'Mobile No', value: selectedStaff.staff_mobile || '-----' },
                      { label: 'Email', value: selectedStaff.staff_email || '-----' },
                      { label: 'Entry Date', value: selectedStaff.staff_entry_date || '-----' },
                      { label: 'Staff Type', value: selectedStaff.staff_type || '-----' },
                      {
                        label: 'Staff Status',
                        value: (
                          <Text
                            style={{
                              color:
                                selectedStaff.staff_status?.toLowerCase() === 'active'
                                  ? 'green'
                                  : 'red',
                              fontFamily: 'Inter-Regular',
                            }}>
                            {selectedStaff.staff_status || '-----'}
                          </Text>
                        ),
                      },
                    ].map((item, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          borderBottomWidth: index === 5 ? 0 : 1,
                          borderBottomColor: '#eee',
                          backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                        }}>
                        {/* Label */}
                        <View
                          style={{
                            width: '40%',
                            padding: 12,
                            borderRightWidth: 1,
                            borderRightColor: '#eee',
                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                              fontFamily: 'Inter-SemiBold',
                              color: '#333',
                              textAlign: 'left',
                            }}>
                            {item.label}
                          </Text>
                        </View>

                        {/* Value */}
                        <View style={{ width: '60%', padding: 12 }}>
                          {typeof item.value === 'string' ? (
                            <Text
                              style={{
                                fontSize: 12,
                                color: '#666',
                                fontFamily: 'Inter-Regular',
                                textAlign: 'left',
                                flexWrap: 'wrap',
                              }}>
                              {item.value}
                            </Text>
                          ) : (
                            item.value
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>


              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>


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
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Confirm Delete
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 20, textAlign: 'center' }}>
              Are you sure you want to delete the staff ?
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
                    color: 'Black',
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
                onPress={() => {
                  DeleteStaffApi(selectedStaff.staff_id);
                  closeconfirmodal();
                }}>
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
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <View
            style={{
              width: '80%',
              height: '40%',
              backgroundColor: 'white',
              borderRadius: 150,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onStartShouldSetResponder={() => true}
            onTouchEnd={e => e.stopPropagation()}
          >
            {selectedImage && (
              <Image
                source={selectedImage}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 150,
                  resizeMode: 'stretch',
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={ResetModal}
        onRequestClose={closeResetModal}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onPress={closeResetModal}
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
              Reset Device
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 20, textAlign: 'center', color: 'black', fontFamily: 'Inter-Medium' }}>
              Are you sure To Delete This Staff Device Id ?
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 20, textAlign: 'center', color: 'black', fontFamily: 'Inter-Medium' }}>
              {selectedStaffName || '------'}
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 20, textAlign: 'center', color: 'black', fontFamily: 'Inter-Medium' }}>
              {DeviceId || '------'}
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
                onPress={closeResetModal}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontFamily: 'Inter-Regular',
                  }}>
                  Cancle
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
                onPress={() => {

                  if (selectedStaffId) {
                    DeviceIdReset(selectedStaffId); // Pass staff ID here
                  }
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontFamily: 'Inter-Regular',
                  }}>
                  Reset
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default HomeScreen;
