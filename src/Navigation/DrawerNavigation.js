import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';

const DrawerNavigation = props => {
  const navigation = useNavigation();
  const sports = require('../assets/images/sportbike.png');
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
        <TouchableOpacity
          style={{
            paddingVertical: 7,
            paddingLeft: 30,
            marginBottom: 10,
            borderRadius: 10,
            marginTop: 10,

            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.navigate('SearchHistory');
          }}>
          <Image
            source={sports}
            color="black"
            style={{width: 24, height: 24}}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: 'black',
              fontFamily: 'Inter-Regular',
              marginLeft: 10,
            }}>
            Search History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            paddingVertical: 7,
            paddingLeft: 30,
            marginBottom: 10,
            borderRadius: 10,
            marginTop: 10,

            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.navigate('StaffSchedule');
          }}>
          <Image
            source={sports}
            color="black"
            style={{width: 24, height: 24}}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: 'black',
              fontFamily: 'Inter-Regular',
              marginLeft: 10,
            }}>
            Staff Schedule
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({});
