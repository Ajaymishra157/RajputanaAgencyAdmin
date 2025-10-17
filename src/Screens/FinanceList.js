import { Text, TouchableOpacity, View, FlatList, ToastAndroid, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import CheckBox from '@react-native-community/checkbox';
import colors from '../CommonFiles/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../CommonFiles/Constant';

const FinanceList = () => {
    const Finance = require('../assets/images/budget.png');
    const check = require('../assets/images/check.png');
    const navigation = useNavigation();
    const route = useRoute();
    const { staff_id, staff_name } = route.params || {};

    const [financeList, setFinanceList] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);

    const [loading, setLoading] = useState(false);


    const AgencyStaffLogout = async (navigation, confirmLogout) => {
        try {
            const staffId = await AsyncStorage.getItem('staff_id');

            if (!staffId) {
                ToastAndroid.show('No staff ID found', ToastAndroid.SHORT);
                return;
            }

            const response = await fetch(ENDPOINTS.Staff_Agency_Logout, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ staff_id: staffId }),
            });

            const result = await response.json();

            if (result.code === 200) {
                const staffStatus = result?.payload?.[0]?.staff_status;
                const userType = result?.payload?.[0]?.user_type;
                await AsyncStorage.setItem('user_type', userType);

                if (staffStatus === 'Deactive') {

                    confirmLogout(); // Trigger logout
                } else {

                }
            } else {
                ToastAndroid.show(result.message || 'Failed to logout staff', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.log('Logout error:', error.message);
            ToastAndroid.show('Error logging out staff', ToastAndroid.SHORT);
        }
    };


    useFocusEffect(
        React.useCallback(() => {
            AgencyStaffLogout(navigation, confirmLogout);
        }, [])
    );


    const confirmLogout = async () => {
        await AsyncStorage.removeItem('id'); // User data clear karega
        await AsyncStorage.removeItem('selected_agency'); // User data clear karega
        navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }], // LoginScreen par redirect karega
        });

    };

    useEffect(() => {
        fetchFinanceList();
    }, []);

    const fetchFinanceList = async () => {
        const storedAgencyId = await AsyncStorage.getItem('rent_agency_id');
        console.log("Api Called Successfully", storedAgencyId);
        const rentAgencyId = storedAgencyId !== null ? parseInt(storedAgencyId, 10) : 0;


        try {
            setLoading(true);

            const response = await fetch(ENDPOINTS.Finance_List(rentAgencyId, staff_id));
            const result = await response.json();

            if (response.ok && result.code === 200 && Array.isArray(result.payload)) {

                const cleanedPayload = result.payload.map(item => ({
                    ...item,
                    staff_checkbox: String(item.staff_checkbox).toLowerCase() === 'true'
                }));
                setFinanceList(cleanedPayload);

            } else {
                // Show empty list or default dummy list
                setFinanceList([]); // or your static demo list

            }
        } catch (error) {
            console.log("Error fetching finance list:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleCheckbox = (index) => {
        const updatedList = [...financeList];
        updatedList[index].staff_checkbox = !updatedList[index].staff_checkbox;
        setFinanceList(updatedList);
    };

    const handleSave = async () => {

        try {
            const selectedItems = financeList.filter(item => item.staff_checkbox);
            const financeNames = selectedItems.map(item => item.finance_name).join(',');

            const body = {
                staff_id: staff_id,
                finance_data: financeNames
            };


            const response = await fetch(ENDPOINTS.finance_update, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (result.code === 200) {
                ToastAndroid.show("List updated successfully", ToastAndroid.SHORT);
                setIsEditMode(false);
            } else {
                ToastAndroid.show("Failed to update list", ToastAndroid.SHORT);
            }
        } catch (error) {
            console.log("Error updating list:", error.message);
        }
    };


    const renderItem = ({ item, index }) => {
        // console.log(`Item ${index} - staff_checkbox:`, item.staff_checkbox);
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: 'center', // 👈 start from top
                    justifyContent: 'center',
                    backgroundColor: '#f9f9f9',
                    borderRadius: 8,
                    padding: 6,
                    marginBottom: 8,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                    borderWidth: 0.5,
                    width: '100%'
                }}
                onPress={() => isEditMode && toggleCheckbox(index)}
                activeOpacity={isEditMode ? 0.6 : 1}
            >
                <View style={{ width: '15%', alignItems: 'center', }}>
                    <CheckBox
                        disabled={!isEditMode}
                        value={item.staff_checkbox === true}
                        onValueChange={() => toggleCheckbox(index)}
                    />
                </View>
                <View style={{ flex: 1, width: '75%', }}>
                    <Text style={{ fontSize: 12, color: '#333', marginLeft: 10, fontFamily: 'Inter-Regular', flexWrap: 'wrap' }}>{item.finance_name}</Text>
                </View>
                <View style={{ width: '10%', alignItems: 'center', justifyContent: 'center', }}>
                    {item.staff_checkbox && (
                        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                            <Image
                                source={check}
                                style={{ width: 20, height: 20 }}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <View style={{ flex: 1, backgroundColor: '#F0F0F0' }}>
            {/* Header */}
            <View style={{
                backgroundColor: colors.Brown,
                paddingVertical: 20,
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <TouchableOpacity
                    style={{
                        width: '15%',
                        position: 'absolute',
                        left: 6,
                        top: 3,
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',

                    }}
                    onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../assets/images/back.png')} // 👈 apne image ka correct path lagao
                        style={{ width: 26, height: 26, tintColor: '#fff' }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 10, flexDirection: 'row', }}>
                    <Text
                        style={{
                            marginLeft: 35,
                            color: 'white',
                            fontSize: 12,
                            fontWeight: 'bold',
                            fontFamily: 'Inter-Bold',
                            flexWrap: 'wrap',
                            textAlign: 'right',
                            marginRight: 2,
                            flexShrink: 1,         // Allow text to shrink if needed
                            width: '35%',
                            textTransform: 'uppercase'
                        }}
                        numberOfLines={1}

                    >
                        {staff_name}

                    </Text>
                    <Text style={{
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 'bold',
                        fontFamily: 'Inter-Bold',
                    }}>- FINANCE LIST
                    </Text>

                </View>
                {financeList.length !== 0 ? (
                    <View
                        style={{
                            width: '15%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            right: 6,
                            top: 3,

                            height: 50,


                        }}>

                        <TouchableOpacity
                            onPress={() => setIsEditMode(!isEditMode)}
                        >
                            <Image
                                source={
                                    isEditMode
                                        ? require('../assets/images/close.png')   // <-- Close icon image
                                        : require('../assets/images/editing.png')    // <-- Edit icon image
                                }
                                style={{ width: 20, height: 20, tintColor: 'white' }} // same look as Ionicons
                            />

                        </TouchableOpacity>
                    </View>
                ) : null}


            </View>

            {/* List */}
            {
                loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={colors.Brown} />
                        <Text style={{ marginTop: 10, color: 'gray', fontFamily: 'Inter-Regular' }}>Loading Finance List...</Text>
                    </View>
                ) : financeList.length === 0 ? (
                    <View style={{ height: 700, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={Finance} style={{ width: 70, height: 70 }} />
                        <Text style={{ fontFamily: 'Inter-Regular', color: 'red', marginTop: 10 }}>
                            No Finance Yet
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        keyboardShouldPersistTaps='handled'
                        data={financeList}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={{ padding: 10 }}
                    />

                )
            }

            {/* Save Button */}
            {isEditMode && (
                <TouchableOpacity
                    style={{
                        backgroundColor: colors.Brown,
                        margin: 20,
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: 'center'
                    }}
                    onPress={handleSave}
                >
                    <Text style={{
                        color: 'white',
                        fontSize: 16,
                        fontWeight: 'bold',
                        fontFamily: 'Inter-Regular'
                    }}>
                        Update
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default FinanceList;
