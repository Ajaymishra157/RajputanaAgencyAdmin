import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
  ToastAndroid,
  Modal,
  TextInput,
  Image,
  Switch,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import colors from '../CommonFiles/Colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ENDPOINTS } from '../CommonFiles/Constant';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import StaffShimmer from '../Component/StaffShimmer';

const StaffSchedule = () => {
  const Schedule = require('../assets/images/schedule.png');
  const account = require('../assets/images/user.png');
  const navigation = useNavigation();
  const [staffSchedule, setstaffSchedule] = useState([]);
  const [staffLoading, setstaffLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [InfoModal, SetInfoModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [ConfrimationModal, setConfrimationModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [text, setText] = useState(null);
  const [originalSchedule, setoriginalSchedule] = useState([]);

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [isAccountEnabled, setIsAccountEnabled] = useState({});
  const [loadingToggles, setLoadingToggles] = useState({});
  const [AccountToggles, setAccountToggles] = useState({});

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

  const handleDelete = () => {
    setConfrimationModal(true);
    handleCloseModal();
    // Call Delete API with the selected staff ID
  };

  const closeconfirmodal = () => {
    setConfrimationModal(false); // Hide the modal
  };

  const handleEdit = () => {
    navigation.navigate('AddScheduleScreen', {
      staff_id: selectedStaff.staff_id,
      Schedule_id: selectedStaff.staff_schedule_id,
      staff_name: selectedStaff.schedule_staff_name,
      start_date: selectedStaff.schedule_staff_start_date,
      end_date: selectedStaff.schedule_staff_end_date,
    });
    handleCloseModal(); // Close the modal after action
  };

  const StaffScheduleApi = async () => {
    setstaffLoading(true);
    try {
      const response = await fetch(ENDPOINTS.Staff_Schedule_List, {
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
          setstaffSchedule(result.payload); // Successfully received data
          setoriginalSchedule(result.payload);

          const enabledMap = {};
          result.payload.forEach(item => {
            enabledMap[item.staff_schedule_id] = item.schedule_staff_status === 'On';
          });
          setIsAccountEnabled(enabledMap);

        } else {
          console.log('Error:', 'Failed to load staff data');
        }
      } else {
        console.log('HTTP Error:', result.message || 'Something went wrong');
      }
    } catch (error) {
      console.log('Error fetching data:', error.message);
    } finally {
      setstaffLoading(false);
    }
  };

  const handleTextChange = (inputText) => {
    setText(inputText);

    // If inputText is empty, show the original data
    if (inputText === '') {
      setstaffSchedule(originalSchedule);  // Reset to original data
    } else {
      // Filter data based on Name, Reg No, or Agg No
      const filtered = originalSchedule.filter(item => {
        const lowerCaseInput = inputText.toLowerCase();
        return (
          item.schedule_staff_name.toLowerCase().includes(lowerCaseInput) ||
          item.schedule_staff_mobile.toLowerCase().includes(lowerCaseInput)

        );
      });

      setstaffSchedule(filtered); // Update filtered data state
    }
  };

  const DeleteStaffApi = async scheduleId => {
    console.log(' DeleteStaffApi scheduleId', scheduleId);
    try {
      const response = await fetch(ENDPOINTS.Delete_Schedule, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          staff_schedule_id: scheduleId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.code === 200) {
          ToastAndroid.show(
            'Schedule Deleted Successfully',
            ToastAndroid.SHORT,
          );
          StaffScheduleApi();
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

  const ScheduleAccountStatus = async (staff_id, action) => {
    console.log("Sending staff_id and action:", staff_id, action);

    try {
      const response = await fetch(ENDPOINTS.Status_Schedule, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staff_schedule_id: staff_id,
          action: action,
        }),
      });

      const result = await response.json();

      if (result.code === 200) {
        ToastAndroid.show("Staff Account Status updated successfully", ToastAndroid.SHORT);
        // Optimistic UI update already done, no state update needed here
      } else {
        ToastAndroid.show("Failed to update Staff Account Status", ToastAndroid.SHORT);
        // Rollback optimistic update in case of failure
        setIsAccountEnabled(prev => ({
          ...prev,
          [staff_id]: !prev[staff_id],
        }));
      }
    } catch (error) {
      ToastAndroid.show("Error updating Account Status", ToastAndroid.SHORT);
      // Optionally rollback optimistic update on network error too
      setIsAccountEnabled(prev => ({
        ...prev,
        [staff_id]: !prev[staff_id],
      }));
    } finally {
      // Disable loading spinner for this staff_id toggle
      setAccountToggles(prev => ({
        ...prev,
        [staff_id]: false,
      }));
    }
  };


  // useEffect(() => {
  //   StaffScheduleApi();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      StaffScheduleApi();
    }, []), // Empty array ensures this is called only when the screen is focused
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await StaffScheduleApi();
    setRefreshing(false);
  };

  const formatDate = date => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
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
          Staff Schedule
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

            placeholder="Search Schedule/Mobile no"
            placeholderTextColor="grey"
            value={text}
            onChangeText={handleTextChange}
          />
          {text ? (
            <TouchableOpacity
              onPress={() => {

                setText(''); // Clear the search text
                setstaffSchedule(originalSchedule);

              }}
              style={{
                marginRight: 7,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/images/close.png')} // 👈 apne image ka correct path lagao
                style={{ width: 20, height: 20, tintColor: 'black' }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#9Bd35A', '#689F38']}
          />
        }>
        {/* <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
          }}>
          <View
            style={{
              width: '80%',
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 10,
              backgroundColor: '#f5f5f5',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 5,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 4,
              color: 'black',
            }}>
            <TextInput
              placeholder="Search Schedule"
              placeholderTextColor="grey"
              style={{
                flex: 1,
                fontSize: 16,
                color: '#333',
                fontFamily: 'Inter-Regular',
              }}
            />
            <TouchableOpacity
              onPress={() => console.log('Search pressed')}
              style={{
                padding: 8,
                backgroundColor: colors.Brown,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Table Header */}
        {/* <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#ddd',
            padding: 7,
            borderRadius: 5,
            width: '100%'
          }}>
          <View
            style={{
              width: '23%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>

          </View>
          <View
            style={{
              width: '27%',
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
              width: '35%',
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingRight: 9,

            }}>
            <Text
              style={{
                flex: 2,
                fontWeight: 'bold',

                fontFamily: 'Inter-Regular',
                textAlign: 'center',
                fontSize: 14,
                color: 'black',
              }}>
              Days
            </Text>
          </View>
          <View
            style={{
              width: '15%',
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
              }}></Text>
          </View>
        </View> */}

        {staffLoading ? (
          <View
            style={{ flex: 1, }}>
            <View style={{ padding: 10 }}>
              {[...Array(7)].map((_, index) => (
                <StaffShimmer key={index} />
              ))}
            </View>
          </View>
        ) : staffSchedule.length === 0 ? (
          <View style={{ height: 600, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7f7' }}>
            <Image source={Schedule} style={{ width: 70, height: 70 }} />
            <Text style={{ fontFamily: 'Inter-Regular', color: 'red', marginTop: 10 }}>
              No Schedule Found
            </Text>
          </View>
        ) : (
          staffSchedule.map((item, index) => (
            <View
              key={item.staff_schedule_id}
              style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                padding: 10,
                marginBottom: 7,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#ddd',
                alignItems: 'center',
                width: '100%'
              }}>
              <View style={{ width: '23%', justifyContent: 'center', alignItems: 'flex-start' }}>
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
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: '#ccc',
                  }}
                >
                  <Image
                    source={
                      item.staff_image
                        ? { uri: `https://easyreppo.in/${encodeURI(item.staff_image)}` }
                        : account
                    }
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: '32%',
                  justifyContent: 'center',
                  alignItems: 'flex-start',

                }}>
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: 'left',
                    color: 'black',
                    fontFamily: 'Inter-Regular',
                    flexWrap: 'wrap', // allows the text to wrap if it's long
                    textTransform: 'uppercase'
                  }}>
                  {item.schedule_staff_name || '----'}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <Image
                    source={require('../assets/images/telephone.png')} // 👈 apne image ka correct path lagao
                    style={{ width: 12, height: 12, marginRight: 4, tintColor: 'grey' }}
                    resizeMode="contain"
                  />

                  <Text
                    style={{
                      fontSize: 12,
                      textAlign: 'left',
                      color: 'black',
                      fontFamily: 'Inter-Regular',
                      flexWrap: 'wrap', // allows the text to wrap if it's long
                    }}>
                    {item.schedule_staff_mobile || '----'}
                  </Text>
                </View>
              </View>



              <View
                style={{
                  width: '30%',
                  justifyContent: 'center',
                  alignItems: 'flex-end',


                }}>
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    color: 'blue',
                    fontFamily: 'Inter-Regular',
                  }}>
                  {item.schedule_staff_total_day || '----'}
                </Text>
                <Switch
                  trackColor={{ false: "#f54949", true: "#1cd181" }}
                  thumbColor="#ebecee"
                  ios_backgroundColor="#3e3e3e"
                  disabled={!!AccountToggles[item.staff_schedule_id]} // yahan item ka id use karo
                  onValueChange={value => {
                    const scheduleId = item.staff_schedule_id;

                    // Show loading for this scheduleId
                    setAccountToggles(prev => ({
                      ...prev,
                      [scheduleId]: true,
                    }));

                    // Optimistic UI update for this scheduleId
                    setIsAccountEnabled(prev => ({
                      ...prev,
                      [scheduleId]: value,
                    }));

                    // API call with scheduleId
                    ScheduleAccountStatus(scheduleId, value ? 'on' : 'off');
                  }}

                  value={
                    isAccountEnabled[item.staff_schedule_id] !== undefined
                      ? isAccountEnabled[item.staff_schedule_id]
                      : item.staff_status === 'On' // ya jo bhi default status hai item me
                  }
                />


              </View>

              <View
                style={{
                  width: '15%',
                  alignItems: 'flex-end',


                }}>
                <TouchableOpacity
                  onPress={() => OpenModal(item)}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    marginRight: 8
                  }}>
                  <Image
                    source={require('../assets/images/dots.png')} // 👈 apne image ka correct path lagao
                    style={{ width: 18, height: 18, tintColor: 'black' }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View
          style={{
            paddingBottom: 85,
            backgroundColor: '#f7f7f7',
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
            navigation.navigate('AddScheduleScreen');
          }}>
          <Image
            source={require('../assets/images/plus.png')} // 👈 apne correct image path ke hisab se change karo
            style={{ width: 18, height: 18, tintColor: '#fff' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* <Modal
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
                    backgroundColor: 'white',
                    padding: 10,
                    borderRadius: 15,
                    width: '80%',
                    alignItems: 'center',
                    elevation: 5, // Adds shadow for Android
                    shadowColor: '#000', // Shadow for iOS
                    shadowOffset: {width: 0, height: 2},
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
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: -8,
                        width: '15%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}
                      onPress={handleCloseModal}>
                      <Text
                        style={{
                          fontSize: 28,
                          fontWeight: 'bold',
                          color: 'black',
                          fontFamily: 'Inter-Regular',
                        }}>
                        ×
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{gap: 15, width: '100%'}}>
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
                      onPress={handleDelete}
                      >
                      <AntDesign name="delete" size={24} color="red" />
                      <Text
                        style={{
                          color: 'red',
                          fontFamily: 'Inter-Regular',
                          fontSize: 16,
                        }}>
                        Delete Staff
                      </Text>
                    </TouchableOpacity>
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
                      onPress={handleEdit}
                      >
                      <AntDesign name="edit" size={24} color="Black" />
                      <Text
                        style={{
                          color: 'black',
                          fontFamily: 'Inter-Regular',
                          fontSize: 16,
                        }}>
                        Update Staff
                      </Text>
                    </TouchableOpacity>
      
                    <TouchableOpacity
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
                      <AntDesign name="infocirlceo" size={20} color="black" />
      
                      <Text
                        style={{
                          color: 'black',
                          fontFamily: 'Inter-Regular',
                          fontSize: 16,
                        }}>
                        Information Staff
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal> */}

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
                  Delete Schedule
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
                  Update Schedule
                </Text>
              </TouchableOpacity>

              {/* Info Staff Button */}
              <TouchableOpacity
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
                  Information Schedule
                </Text>
              </TouchableOpacity>
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
              flexDirection: 'row',
              justifyContent: 'flex-end',
              width: '80%',
              paddingVertical: 5,
            }}>
            <TouchableOpacity
              onPress={closeModal}
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
              padding: 20,
              borderRadius: 15,
              width: '85%',
              maxHeight: '80%',
            }}
            onStartShouldSetResponder={() => true}
            onTouchEnd={e => e.stopPropagation()}>
            {selectedStaff && (
              <>
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
                    Staff Schedule Information
                  </Text>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ maxHeight: 400 }}
                  keyboardShouldPersistTaps="handled">
                  <View style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    overflow: 'hidden',
                    marginBottom: 15
                  }}>
                    {[
                      { label: 'Staff Name', value: selectedStaff.schedule_staff_name || '-----' },
                      { label: 'Mobile No', value: selectedStaff.schedule_staff_mobile || '-----' },
                      { label: 'From Date', value: formatDate(selectedStaff.schedule_staff_start_date) || '-----' },
                      { label: 'End Date', value: formatDate(selectedStaff.schedule_staff_end_date) || '-----' },
                      { label: 'Entry Date', value: selectedStaff.schedule_staff_entry_date || '-----' },
                      { label: 'Total Days', value: selectedStaff.schedule_staff_total_day || '-----' },
                      {
                        label: 'Staff Status',
                        value: selectedStaff.schedule_staff_status || '-----',
                        isStatus: true,
                        statusColor: selectedStaff.schedule_staff_status ? 'green' : 'red'
                      },
                      {
                        label: 'Payment Status',
                        value: selectedStaff.schedule_staff_payment_status || '-----',
                        isStatus: true,
                        statusColor: selectedStaff.schedule_staff_payment_status === 'Unpaid' ? 'red' : 'green'
                      },
                    ].map((item, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          borderBottomWidth: index === 7 ? 0 : 1,
                          borderBottomColor: '#eee',
                          backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
                        }}
                      >
                        {/* Label */}
                        <View style={{
                          width: '40%',
                          padding: 12,
                          borderRightWidth: 1,
                          borderRightColor: '#eee',
                        }}>
                          <Text style={{
                            fontSize: 12,
                            fontFamily: 'Inter-SemiBold',
                            color: '#333',
                            textAlign: 'left'
                          }}>
                            {item.label}
                          </Text>
                        </View>

                        {/* Value */}
                        <View style={{
                          width: '60%',
                          padding: 12,
                        }}>
                          {item.isStatus ? (
                            <Text style={{
                              fontSize: 12,
                              color: item.statusColor,
                              fontFamily: 'Inter-Regular',
                              textAlign: 'left',
                              fontWeight: 'bold'
                            }}>
                              {item.value}
                            </Text>
                          ) : (
                            <Text style={{
                              fontSize: 12,
                              color: '#666',
                              fontFamily: 'Inter-Regular',
                              textAlign: 'left',
                              flexWrap: 'wrap'
                            }}>
                              {item.value}
                            </Text>
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
              Are you sure you want to delete the Schedule ?
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
                  DeleteStaffApi(selectedStaff.staff_schedule_id);
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
    </View>
  );
};

export default StaffSchedule;
