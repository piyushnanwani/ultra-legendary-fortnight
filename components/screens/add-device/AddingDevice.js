import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  TouchableOpacity,
} from 'react-native';
import SensorComponent from './SensorComponent';

export default function AddingDevice({navigation, route}) {
  /* 2. Get the param */
  const {userId, wifiName, wifiPassword, token} = route.params;
  console.log(userId);
  console.log(wifiName);
  console.log(wifiPassword);
  console.log(token);
  console.log('recieved the params');
  return (
    <View style={styles.container}>
      <Button
        title="Cancel"
        style={{flex: 1, paddingRight: 40}}
        onPress={() => navigation.navigate('Home')}></Button>
      <View style={styles.subContainer}>
        <Text style={{textAlign: 'center', flex: 1, paddingTop: 20}}>
          Adding device...
        </Text>
        <Text style={{textAlign: 'center', flex: 1, paddingTop: 20}}>
          Ensure that the Wifi signal is good and you are near your device
        </Text>
        <SensorComponent navigation={navigation} dataToESP32={route.params} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ddd',
  },
  subContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    flex: 1,
    // justifyContent: "flex-end",
    justifyContent: 'space-around',
    flexDirection: 'column',
    borderRadius: 20,
  },
});
