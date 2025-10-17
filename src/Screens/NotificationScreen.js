import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ToastAndroid, FlatList, Modal, Image } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import colors from '../CommonFiles/Colors';
import { ENDPOINTS } from '../CommonFiles/Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';

const NotificationScreen = () => {
    const navigation = useNavigation();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [messageError, setmessageError] = useState(false);

    const [notifications, setNotifications] = useState([]);

    const [editingId, setEditingId] = useState(null); // agar edit mode hai

    const [confirmModal, setConfirmModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [loadingList, setLoadingList] = useState(true);



    const textInputRef = useRef(null);

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



    const openConfirmModal = (id) => {
        setSelectedId(id);
        setConfirmModal(true);
    };

    const closeConfirmModal = () => {
        setConfirmModal(false);
        setSelectedId(null);
    };


    const handleSave = async () => {
        if (!message.trim()) {
            setmessageError(true);
            return;
        }

        setmessageError(false);
        setLoading(true);

        try {
            const url = editingId
                ? ENDPOINTS.update_notification_msg  // agar edit mode h
                : ENDPOINTS.add_notification_msg;

            const body = editingId
                ? { msg_id: editingId, message }
                : { message };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (result.code == 200) {
                ToastAndroid.show(editingId ? 'Message updated!' : 'Message saved!', ToastAndroid.SHORT);
                setMessage('');
                setEditingId(null);
                fetchNotifications(); // refresh list
            } else {
                ToastAndroid.show('Failed, try again.', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save message.');
        }

        setLoading(false);
    };


    const fetchNotifications = async () => {
        setLoadingList(true);
        try {
            console.log("👉 Fetching:", ENDPOINTS.list_notification_msg);
            const response = await fetch(ENDPOINTS.list_notification_msg);
            const result = await response.json();
            console.log("✅ Response:", result);

            if (result.code == 200 && result.payload?.length > 0) {
                setNotifications(result.payload);
            } else {
                setNotifications([]); // no notifications

            }
        } catch (error) {
            console.error("❌ Fetch error:", error);
            ToastAndroid.show("Failed to fetch notifications", ToastAndroid.SHORT);
        } finally {
            setLoadingList(false); // 👈 stop loading
        }
    };




    useEffect(() => {
        fetchNotifications();
    }, []);

    // 👇 hook lagao
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            fetchNotifications();
        }
    }, [isFocused]);


    const confirmDelete = async () => {
        try {
            // UI me turant remove kar do
            setNotifications((prev) => prev.filter((n) => n.msg_id !== selectedId));

            // API call
            const response = await fetch(ENDPOINTS.delete_notification_msg, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ msg_id: selectedId }),
            });
            const result = await response.json();

            if (result.code == 200) {
                ToastAndroid.show("Notification Deleted", ToastAndroid.SHORT);
            } else {
                ToastAndroid.show("Delete failed!", ToastAndroid.SHORT);
                // agar fail ho jaye to wapas se refresh
                fetchNotifications();
            }
        } catch (e) {
            console.error(e);
            fetchNotifications(); // error aaya to bhi refresh kar lo
        } finally {
            closeConfirmModal();
        }
    };




    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
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
                    style={{ position: 'absolute', top: 15, left: 15 }}
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
                    Add Notification
                </Text>

            </View>
            <View style={{ padding: 20, backgroundColor: 'white' }}>


                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: messageError ? 'red' : '#ccc', // 👈 error pe border red
                        borderRadius: 8,
                        padding: 15,
                        fontSize: 16,
                        textAlignVertical: 'top',
                        backgroundColor: '#f9f9f9',
                        minHeight: 100,
                        fontFamily: 'Inter-Regular',
                        color: 'black'
                    }}
                    ref={textInputRef}
                    placeholder="Enter your message"
                    placeholderTextColor='#ccc'
                    value={message}
                    onChangeText={(text) => {
                        setMessage(text);
                        if (text.trim()) setmessageError(false); // type karte hi error hat jaye
                    }}
                    multiline
                />

                {messageError && (
                    <Text style={{ color: 'red', marginTop: 5, fontSize: 14, fontFamily: 'Inter-Regular' }}>
                        Message is required
                    </Text>
                )}


                <TouchableOpacity
                    style={{
                        backgroundColor: colors.Brown,
                        paddingVertical: 14,
                        borderRadius: 8,
                        marginTop: 20,
                        alignItems: 'center',
                    }}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily: 'Inter-Regular' }}>{editingId ? 'Update' : 'Save'}</Text>
                    )}
                </TouchableOpacity>
            </View>
            {loadingList ? (
                // 🔄 Jab tak data load ho raha hai tab ye chalega
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.Brown} />
                    <Text style={{ marginTop: 10, color: colors.Brown, fontFamily: 'Inter-Regular' }}>
                        Loading notifications...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.msg_id}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ padding: 16 }}
                    ListEmptyComponent={() =>
                        !loadingList && (
                            <View style={{ padding: 40, alignItems: 'center' }}>
                                <Image
                                    source={require('../assets/images/bell.png')}
                                    style={{ width: 60, height: 60, marginBottom: 12 }}
                                    resizeMode="contain"
                                />
                                <Text style={{ color: 'red', fontFamily: 'Inter-Medium', fontSize: 16 }}>
                                    No notifications yet
                                </Text>
                            </View>
                        )
                    }

                    ListHeaderComponent={() =>
                        notifications.length > 0 && (
                            <View style={{ alignItems: 'center', marginBottom: 12 }}>
                                <Text
                                    style={{
                                        color: 'black',
                                        fontFamily: 'Inter-Medium',
                                        fontSize: 18,
                                    }}
                                >
                                    Recent Notification
                                </Text>
                            </View>
                        )
                    }
                    renderItem={({ item }) => (
                        <View style={{ marginBottom: 12 }}>
                            {/* Card container */}
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: 10,
                                    padding: 12,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 5,
                                    elevation: 3,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                {/* Message area (70%) */}
                                <View style={{ width: '70%' }}>
                                    <Text
                                        style={{
                                            color: '#555',
                                            fontFamily: 'Inter-Regular',
                                            fontSize: 14,
                                            lineHeight: 20,
                                        }}
                                    >
                                        {item.message}
                                    </Text>
                                </View>

                                {/* Action buttons (30%) */}
                                <View
                                    style={{
                                        width: '30%',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        gap: 20,
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setMessage(item.message);
                                            setEditingId(item.msg_id);
                                        }}
                                    >
                                        <Image
                                            source={require('../assets/images/edit-text.png')} // 👈 apne image ka correct path lagao
                                            style={{ width: 24, height: 24, tintColor: '#1E90FF' }}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => openConfirmModal(item.msg_id)}>
                                        <Image
                                            source={require('../assets/images/delete.png')} // 👈 apne image ka correct path lagao
                                            style={{ width: 24, height: 24, tintColor: 'red' }}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                />
            )}




            <Modal
                animationType="fade"
                transparent={true}
                visible={confirmModal}
                onRequestClose={closeConfirmModal}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                    activeOpacity={1}
                    onPress={closeConfirmModal}
                >
                    <View
                        style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 8,
                            width: '80%',
                            alignItems: 'center',
                        }}
                        onStartShouldSetResponder={() => true}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                marginBottom: 10,
                                color: 'black',
                                fontFamily: 'Inter-Medium',
                            }}
                        >
                            Delete
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                marginBottom: 20,
                                textAlign: 'center',
                                color: 'black',
                                fontFamily: 'Inter-Medium',
                            }}
                        >
                            Are you sure you want to delete this notification?
                        </Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#ddd',
                                    padding: 10,
                                    borderRadius: 5,
                                    width: '45%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={closeConfirmModal}
                            >
                                <Text
                                    style={{
                                        color: 'black',
                                        fontWeight: 'bold',
                                        fontFamily: 'Inter-Regular',
                                    }}
                                >
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
                                onPress={confirmDelete}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontFamily: 'Inter-Regular',
                                    }}
                                >
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

export default NotificationScreen;
