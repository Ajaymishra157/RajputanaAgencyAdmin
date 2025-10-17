import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../CommonFiles/Colors';
import { ENDPOINTS } from '../CommonFiles/Constant';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

const IntimationScreen = () => {
  const whatsapp = require('../assets/images/whatsapp.png');
  const route = useRoute();
  const { vehicleDetails } = route.params;
  const navigation = useNavigation();



  const [startDate, setStartDate] = useState(new Date()); // Default to current date
  const [endDate, setEndDate] = useState(null); // Set endDate to null initially

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [ReppoAgency, setReppoAgency] = useState('');


  const [currentDate, setCurrentDate] = useState('');

  const fullDate = vehicleDetails.vehicle_entry_date || '----------';
  console.log('selected type', fullDate);
  const [date, time] = fullDate.split(' '); // Split by space to get date and time

  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Track dropdown visibility
  const [selectedType, setSelectedType] = useState('Select Type'); // Store selected type
  console.log('selected type', selectedType);
  const [dropdownData] = useState([
    { label: 'Confirm', value: 'Confirm' },
    { label: 'Cancel', value: 'Cancel' },
  ]); // Static data for dropdown

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };
  const handleSelect = staff => {
    setSelectedType(staff.value);
    // Close the dropdown after selection
    setIsDropdownVisible(false);
  };

  // Function to get the current date in DD-MM-YYYY format
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // Ensure two-digit day
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // Set the current date when the component is mounted
  useEffect(() => {
    setCurrentDate(getCurrentDate());
  }, []); //

  const AddIntimation = async () => {
    console.log("date ye hai", date, time)
    setIsLoading(true);
    try {
      const response = await fetch(ENDPOINTS.Add_Intimation, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicle_id: vehicleDetails.full_vehicle_id,
          agreement_no: vehicleDetails.vehicle_agreement_no,
          registration_no: vehicleDetails.vehicle_registration_no,
          chassis_no: vehicleDetails.vehicle_chassis_no,
          engine_no: vehicleDetails.vehicle_engine_no,
          product: vehicleDetails.vehicle_product,
          customer_name: vehicleDetails.vehicle_customer_name,
          customer_address: vehicleDetails.vehicle_customer_address,
          reppo_address: vehicleDetails.vehicle_repo_fos,
          finance_name: vehicleDetails.vehicle_finance_name,
          intimation_status: selectedType,
          agency_name: vehicleDetails.vehicle_finance_admin,
          vehicle_maker: vehicleDetails.vehicle_maker,
          bucket: vehicleDetails.vehicle_bucket,
          emi: vehicleDetails.vehicle_emi,
          total_collectable: vehicleDetails.vehicle_total_outstanding,
          principle_outstanding: vehicleDetails.vehicle_principle_outstanding,
          intimation_date: date,
          intimation_time: time,
          reposession_agent: ReppoAgency || '',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.code == 200) {
          ToastAndroid.show('Intimation added successfully', ToastAndroid.SHORT);
          navigation.goBack();
        } else {
          console.log('Error:', 'Failed to load staff data');
        }
      } else {
        console.log('HTTP Error:', result.message || 'Something went wrong');
      }
    } catch (error) {
      console.log('Error fetching data:', error.message);
    } finally {
      setIsLoading(false); // Loader stop
    }
  };

  const formatDate = date => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to your storage to save PDF files.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage permission granted');
        } else {

        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    requestStoragePermission();
  }, []);

  const DownloadPDF = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Inter-Regular';
              font-size: 14px;
              color: black;
              padding: 20px;
              background-color: white;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              padding: 10px;
              text-align: left;
              border: 1px solid #000;
            }
            th {
              font-weight: bold;
            }
            .header-title {
              text-align: center;
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 15px;
            }
              .header-text{
                  text-decoration: underline;
                  }
            .static-text {
              font-size: 14px;
              margin-bottom: 5px;
              text-align: justify;
              
            
            }
            .details-row {
              display: flex;
              justify-content: space-between;
              margin-top: 15px;
            }
            .details-row div {
              width: 48%; /* Both left and right columns take up nearly half the space */
            }
              .address-section {
            margin-top: 10px;
            text-align: left;
            margin-left: 10px;
          }
          .address-section div {
            margin-bottom: 8px;
          }
            .static-Paragraph{
            margin-top: 20px; 
            }
          </style>
        </head>
        <body>
          <!-- Header -->
          <div class="header-title"><h3 class="header-text" style="text-align:center">Pre repossession intimation to Police Station</h3></></div>
          <!-- Static Message -->
         

          
        <!-- Address and Recipient Details -->
        <div class="address-section">
         <div>Date :____________________</div>
          <div>To,</div>
          <div>The Officer In Charge,</div>
          <div>___________________Police Station,</div>
          <div>_____________________________,</div>
          <div>Gujarat,</div>

           <div>Dear Sir,</div>
        </div>


          <!-- Table for Dynamic Vehicle Details -->
              <table>
            <tr>
              <th>RC No</th>
              <td>${vehicleDetails.vehicle_registration_no || '----------'}</td>
            </tr>
            <tr>
              <th>Chasis No</th>
              <td>${vehicleDetails.vehicle_chassis_no || '----------'}</td>
            </tr>
            <tr>
              <th>Engine No</th>
              <td>${vehicleDetails.vehicle_engine_no || '----------'}</td>
            </tr>
            <tr>
              <th>Vehicle Maker</th>
              <td>${vehicleDetails.vehicle_maker || '----------'}</td>
            </tr>
            <tr>
              <th>Vehicle Model</th>
              <td>${vehicleDetails.vehicle_product || '----------'}</td>
            </tr>
            <tr>
              <th>Finance Name</th>
              <td>${vehicleDetails.vehicle_finance_name || '----------'}</td>
            </tr>
            <tr>
              <th>Agreement No</th>
              <td>${vehicleDetails.vehicle_agreement_no || '----------'}</td>
            </tr>
            <tr>
              <th>Customer Name</th>
              <td>${vehicleDetails.vehicle_customer_name || '----------'}</td>
            </tr>
            <tr>
              <th>Customer Address</th>
              <td>${vehicleDetails.vehicle_customer_address || '----------'}</td>
            </tr>
            <tr>
              <th>Bucket</th>
              <td>${vehicleDetails.vehicle_bucket || '----------'}</td>
            </tr>
            <tr>
              <th>Emi</th>
              <td>${vehicleDetails.vehicle_emi || '----------'}</td>
            </tr>
            <tr>
              <th>Total Collectable</th>
              <td>${vehicleDetails.vehicle_total_outstanding || '----------'}</td>
            </tr>
            <tr>
              <th>Principle Outstanding</th>
              <td>${vehicleDetails.vehicle_principle_outstanding || '----------'}</td>
            </tr>
            <tr>
              <th>Agency Name</th>
              <td>${vehicleDetails.vehicle_finance_admin || '----------'}</td>
            </tr>
          </table>

          <!-- Static Footer Text with 3 Paragraphs -->
          <div class="static-Paragraph">
            <p>The above customer / borrower has defaulted in the scheduled repayment of instalments of the above said loan and thereby failed to confirm to the terms and conditions of the above mentioned Loan Agreement.</p>
            <p>Pursuant to our rights of the above said Loan Agreement, we are taking steps to recover possession of the above said vehicle. It is expressly agreed by the customer / borrower under the above said Loan Agreement that in the event of default, Bank is entitled to take charge / possession of the above said vehicle.</p>
            <p>This communication is for your records and to prevent any confusion that may arise from any complaint that may be lodged with you about the aforesaid vehicle being stolen or disposed in any other manner.</p>
          </div>

          <!-- Finance and Agency Details (Displayed on left and right side) -->
          <div class="static-text">
          <p>Thankyou,</br>
          Sincerely,</br>For , <Strong>${vehicleDetails.vehicle_finance_name || '----------'
      }</Strong>
          <Strong>Authorised Signatory</Strong></p>
        </div>
        
        </body>
      </html>
    `;

    try {
      // Generate PDF from HTML content
      const options = {
        html: htmlContent,
        fileName: 'IntimationDetails',
        directory: RNFS.CachesDirectoryPath, // Save in app's temporary directory
      };

      const file = await RNHTMLtoPDF.convert(options);
      console.log('PDF file created:', file.filePath);

      // Define the destination path directly to the Downloads folder (Android)
      const destinationPath =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/IntimationDetails(${vehicleDetails.vehicle_registration_no}).pdf` // Downloads folder on Android
          : `${RNFS.DocumentDirectoryPath}/IntimationDetails(${vehicleDetails.vehicle_registration_no}).pdf`; // iOS uses Document directory

      // Move the file to the Downloads folder (Android)
      await RNFS.moveFile(file.filePath, destinationPath);
      console.log('PDF saved to:', destinationPath);

      // Optionally, trigger the system to scan the file (Android)
      if (Platform.OS === 'android') {
        await RNFS.scanFile(destinationPath); // Makes the file visible in file explorer
      }

      // Inform the user that the PDF is saved
      Alert.alert(
        'PDF Downloaded',
        'Your PDF has been saved to your device in the Downloads folder.',
      );
    } catch (error) {
      console.error('Error generating or saving PDF:', error);
      Alert.alert('Error', 'There was an issue generating or saving the PDF.');
    }
  };

  // const DownloadPDF = async () => {
  //   const htmlContent = `
  //     <html>
  //       <head>
  //         <style>
  //           body {
  //             font-family: 'Inter-Regular';
  //             font-size: 14px;
  //             color: black;
  //             padding: 20px;
  //             background-color: white;
  //           }
  //           table {
  //             width: 100%;
  //             border-collapse: collapse;
  //             margin-top: 20px;
  //           }
  //           th, td {
  //             padding: 10px;
  //             text-align: left;
  //             border: 1px solid #000;
  //                 font-size: 14px;
  //           }
  //           th {
  //             font-weight: bold;
  //           }
  //           .header-title {
  //             text-align: center;
  //             font-size: 14px;
  //             font-weight: bold;
  //             margin-bottom: 15px;
  //           }
  //           .static-text {
  //             font-size: 14px;
  //             margin-bottom: 10px;
  //             text-align: justify;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <!-- Header -->
  //         <div class="header-title">Intimation of Repossession to Police Station</div>
  //         <!-- Static Message -->
  //         <div class="static-text">
  //           Date :  ${currentDate || '----------'}
  //         </div>

  //         <!-- Static Message -->
  //         <div class="static-text">
  //           This is to inform you that the below customer has defaulted in payment and has not shown up to pay money even after several reminders. We are going to repossess the vehicle.
  //         </div>

  //         <!-- Table for Dynamic Vehicle Details -->
  //         <table>
  //          <tr>
  //             <th>Vehicle Registration No</th>
  //             <td>${vehicleDetails.vehicle_registration_no || '----------'}</td>
  //           </tr>
  //           <tr>
  //             <th>Loan Agreement No</th>
  //             <td>${
  //               vehicleDetails.vehicle_loan_agreement_no || '----------'
  //             }</td>
  //           </tr>
  //           <tr>
  //             <th>Engine No</th>
  //             <td>${vehicleDetails.vehicle_engine_no || '----------'}</td>
  //           </tr>
  //           <tr>
  //           <th>Chassis No</th>
  //           <td>${vehicleDetails.vehicle_chassis_no || '----------'}</td>
  //         </tr>
  //          <tr>
  //           <th>Product Model</th>
  //           <td>${vehicleDetails.vehicle_product || '----------'}</td>
  //         </tr>
  //           <th>Customer Name</th>
  //           <td>${vehicleDetails.vehicle_customer_name || '----------'}</td>
  //         </tr>
  //           </tr>
  //           <th>Customer Address</th>
  //           <td>${vehicleDetails.vehicle_customer_address || '----------'}</td>
  //         </tr>

  //       </table>

  //         <!-- Static Footer Text with 3 Paragraphs -->
  //         <div class="static-text">
  //           <p>The above customer / borrower has defaulted in the scheduled repayment of instalments of the above said loan and thereby failed to confirm to the terms and conditions of the above mentioned Loan Agreement.</p>
  //           <p>Pursuant to our rights of the above said Loan Agreement, we are taking steps to recover possession of the above said vehicle. It is expressly agreed by the customer / borrower under the above said Loan Agreement that in the event of default, Bank is entitled to take charge / possession of the above said vehicle.</p>
  //           <p>This communication is for your records and to prevent any confusion that may arise from any complaint that may be lodged with you about the aforesaid vehicle being stolen or disposed in any other manner.</p>
  //         </div>

  //         <!-- Finance and Agency Details (Displayed on left and right side) -->
  //         <div class="static-text">
  //         <p>Thankyou</p>
  //         <p>Sincerely</br>For , ${
  //           vehicleDetails.vehicle_finance_name || '----------'
  //         }</p>
  //         <p>${vehicleDetails.vehicle_agency_name || '----------'}</p>
  //       </div>
  //       </body>
  //     </html>
  //   `;

  //   try {
  //     // Generate PDF from HTML content
  //     const options = {
  //       html: htmlContent,
  //       fileName: 'IntimationDetails',
  //       directory: RNFS.DocumentDirectoryPath, // Save in app's document directory temporarily
  //     };

  //     const file = await RNHTMLtoPDF.convert(options);
  //     console.log('PDF file created:', file.filePath);

  //     // Optionally, trigger the system to scan the file (Android)
  //     if (Platform.OS === 'android') {
  //       await RNFS.scanFile(file.filePath); // Makes the file visible in file explorer
  //     }

  //     // Share the generated PDF file
  //     const shareOptions = {
  //       title: 'Share PDF',
  //       url: 'file://' + file.filePath,
  //       type: 'application/pdf',
  //     };

  //     await Share.open(shareOptions); // Open the share dialog for the generated PDF

  //     // Inform the user that the PDF is ready for sharing
  //     Alert.alert(
  //       'PDF Created',
  //       'Your PDF has been generated. You can now share it.',
  //     );
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //     Alert.alert('Error', 'There was an issue generating the PDF.');
  //   }
  // };

  const GeneratePdf = async () => {


    // Create the message content
    const messageContent = `
 *RC No:* ${vehicleDetails.vehicle_registration_no || '---'}
*Chasis No:* ${vehicleDetails.vehicle_chassis_no || '---'}
*Engine No:* ${vehicleDetails.vehicle_engine_no || '---'}
*Vehicle Maker:* ${vehicleDetails.vehicle_maker || '---'}
*Vehicle Model:* ${vehicleDetails.vehicle_product || '---'}
*Finance Name:* ${vehicleDetails.vehicle_finance_name || '---'}
*Agreement No:* ${vehicleDetails.vehicle_agreement_no || '---'}
*Customer Name:* ${vehicleDetails.vehicle_customer_name || '---'}
*Customer Address:* ${vehicleDetails.vehicle_customer_address || '---'}
*Bucket:* ${vehicleDetails.vehicle_bucket || '---'}
*Emi:* ${vehicleDetails.vehicle_emi || '---'}
*Total Collectable:* ${vehicleDetails.vehicle_total_outstanding || '---'}
*Principle Outstanding:* ${vehicleDetails.vehicle_principle_outstanding || '---'}
*Agency Name:* ${vehicleDetails.vehicle_finance_admin || '---'}
`;

    try {
      const url = `whatsapp://send?text=${encodeURIComponent(messageContent)}`;

      // Check if WhatsApp can handle the URL scheme
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        console.log('WhatsApp is supported, opening...');
        await Linking.openURL(url); // This opens WhatsApp with the message pre-filled
      } else {
        // WhatsApp is not installed or cannot open the URL scheme
        console.log('WhatsApp not supported or not installed. Trying the fallback...');

        // Fallback to WhatsApp Web or App Store (for devices without WhatsApp)
        const fallbackUrl = `https://wa.me/?text=${encodeURIComponent(messageContent)}`;
        await Linking.openURL(fallbackUrl);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'There was an issue sending the message.');
    }
  };
  const fields = [
    { label: 'RC No', value: vehicleDetails.vehicle_registration_no || '---' },
    { label: 'Chasis No', value: vehicleDetails.vehicle_chassis_no || '---' },
    { label: 'Engine No', value: vehicleDetails.vehicle_engine_no || '---' },
    { label: 'Vehicle Maker', value: vehicleDetails.vehicle_maker || '---' },
    { label: 'Vehicle Model', value: vehicleDetails.vehicle_product || '---' },
    { label: 'Finance Name', value: vehicleDetails.vehicle_finance_name || '---' },
    { label: 'Agreement No', value: vehicleDetails.vehicle_agreement_no || '---' },
    { label: 'Customer Name', value: vehicleDetails.vehicle_customer_name || '---' },
    { label: 'Customer Address', value: vehicleDetails.vehicle_customer_address || '---' },
    { label: 'Bucket', value: vehicleDetails.vehicle_bucket || '---' },
    { label: 'Emi', value: vehicleDetails.vehicle_emi || '---' },
    { label: 'Total Collectable', value: vehicleDetails.vehicle_total_outstanding || '---' },
    { label: 'Principle outstanding', value: vehicleDetails.vehicle_principle_outstanding || '---' },
    { label: 'Agency Name', value: vehicleDetails.vehicle_finance_admin || '---' },
  ];

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
          Intimation
        </Text>
        <View
          style={{
            width: '15%',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: 6,
            top: 5,

            height: 50,


          }}>

          <TouchableOpacity onPress={GeneratePdf}>
            <Image source={whatsapp} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled">
        <View style={{ padding: 20 }}>
          <View style={{ marginBottom: 20, borderWidth: 1, borderBottomWidth: 0 }}>
            {fields.map((item, index) => (

              <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1 }}>
                <View style={{ width: '30%', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <Text
                    style={{
                      fontSize: 12,

                      fontFamily: 'Inter-Bold',
                      padding: 6,
                      color: 'black',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      textTransform: 'uppercase'

                    }}>
                    {item.label}
                  </Text>
                </View>
                <View style={{ width: '70%', borderLeftWidth: 1 }}>
                  <TouchableOpacity
                    style={{

                      borderRadius: 8,
                      padding: 6,

                      flex: 2,
                      fontSize: 12,
                      justifyContent: 'center',
                      alignItems: 'flex-start'
                    }}
                    disabled
                  >
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Inter-Regular',
                      }}>
                      {item.value}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

            ))}
          </View>
          {/* Staff Type */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              marginBottom: 5,
              fontFamily: 'Inter-Medium',
              color: 'black',
            }}>
            Vehicle Confirmation Type
          </Text>

          {/* Type Dropdown */}
          <View style={{}}>
            <View style={{ position: 'relative' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                  padding: 12,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderColor: '#ddd',
                  borderWidth: 1,
                }}
                onPress={toggleDropdown}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Inter-Regular',
                    color: selectedType ? 'black' : '#777',
                  }}>
                  {selectedType}
                </Text>
                <Image
                  source={
                    isDropdownVisible
                      ? require('../assets/images/arrow-up.png')   // 👈 arrow up image
                      : require('../assets/images/down-arrow.png') // 👈 arrow down image
                  }
                  style={{ width: 20, height: 20, tintColor: 'black' }}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Dropdown list visibility */}
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
                        onPress={() => handleSelect(item)}>
                        <Text
                          style={{
                            fontSize: 16,
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
            </View>
          </View>

          {selectedType !== 'Select Type' && (
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  marginBottom: 5,
                  fontFamily: 'Inter-Medium',
                  color: 'black',
                }}
              >
                Repossession Agent
              </Text>

              <View
                style={{
                  width: '100%',
                  marginBottom: 15,
                  borderRadius: 8,
                  borderWidth: 1,
                  height: 50,
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderColor: '#ddd',
                  paddingHorizontal: 10,
                }}
              >
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontFamily: 'Inter-Regular',
                    color: 'black',
                    height: 50,
                  }}
                  placeholder="Enter Agent Name"
                  placeholderTextColor="grey"
                  value={ReppoAgency}
                  onChangeText={setReppoAgency}
                />
              </View>
            </View>
          )}

          {/* Search Text button */}



          {/* <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  fontFamily: 'Inter-Medium',
                  color: 'black',
                  flex: 1,
                  textAlign: 'center',
                }}>
                Date
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  fontFamily: 'Inter-Medium',
                  color: 'black',
                  flex: 1,
                  textAlign: 'center',
                }}>
                Time
              </Text>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                borderRadius: 8,

                borderWidth: 1,
                borderColor: '#ddd',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              disabled>
              <View
                style={{
                  width: '50%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                  borderRightWidth: 1,
                  borderColor: '#ddd',
                }}>
                <Text style={{ color: 'black', fontFamily: 'Inter-Regular' }}>
                  {date || '----------'}
                </Text>
              </View>

              <View
                style={{
                  width: '50%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <Text style={{ color: 'black', fontFamily: 'Inter-Regular' }}>
                  {time || '----------'}
                </Text>
              </View>
            </TouchableOpacity>
          </View> */}
          {selectedType !== 'Select Type' && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {/* Download PDF Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: isLoading ? 'grey' : colors.Brown,// Brown color
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                  width: '40%',
                }}
                onPress={AddIntimation}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" /> // Loader show
                ) : (
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 16,
                      fontWeight: 'bold',
                      fontFamily: 'Inter-Bold',
                    }}>
                    Save
                  </Text>
                )}

              </TouchableOpacity>
              {/* Download PDF Button */}
              {/* Download Button */}
              <TouchableOpacity
                onPress={DownloadPDF}
                style={{
                  backgroundColor:
                    selectedType === 'Cancel' ? 'grey' : colors.Brown, // Disable button if Cancel
                  paddingVertical: 12,
                  paddingHorizontal: 30,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                  width: '50%',
                }}
                disabled={selectedType === 'Cancel'} // Disable button if Cancel is selected
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 'bold',
                    fontFamily: 'Inter-Bold',
                  }}>
                  Download PDF
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default IntimationScreen;
