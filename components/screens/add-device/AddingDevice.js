import 'react-native-gesture-handler';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import SensorComponent from './SensorComponent';
import {Button} from 'react-native-paper';

export default function AddingDevice({navigation, route}) {
  /* 2. Get the param */
  const {userId, wifiName, wifiPassword, token} = route.params;
  const [isPlaying, setIsPlaying] = useState(true);
  console.log(userId);
  console.log(wifiName);
  console.log(wifiPassword);
  console.log(token);
  console.log('recieved the params');
  return (
    <View style={styles.container}>
      <View style={{flex: 1, alignItems: 'flex-start'}}>
        <Button
          color="#9B0177"
          mode="contained"
          uppercase={false}
          style={{flex: 1, maxHeight: 35, maxWidth: 120}}
          onPress={() => navigation.navigate('Home')}>
          Cancel
        </Button>
      </View>
      <View style={styles.subContainer}>
        <Text
          style={{
            textAlign: 'center',
            flex: 1,
            paddingTop: 20,
            fontSize: 18,
            fontWeight: '700',
          }}>
          Adding device...
        </Text>
        <Text style={{textAlign: 'center', flex: 1, padding: 20}}>
          Ensure that the Wifi signal is good and you are near your device
        </Text>
        <View style={{flex: 0.75, alignItems: 'center'}}>
          <CountdownCircleTimer
            isPlaying={isPlaying}
            duration={60}
            size={80}
            colors={[
              ['#004777', 0.4],
              ['#F7B801', 0.4],
              ['#A30000', 0.2],
            ]}>
            {({remainingTime, animatedColor}) => (
              <Animated.Text style={{color: animatedColor}}>
                {remainingTime}
              </Animated.Text>
            )}
          </CountdownCircleTimer>
        </View>
        <SensorComponent
          navigation={navigation}
          dataToESP32={route.params}
          setIsPlaying={setIsPlaying}
          isPlaying={isPlaying}
        />
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
    flex: 10,
    // justifyContent: "flex-end",
    justifyContent: 'space-around',
    flexDirection: 'column',
    borderRadius: 20,
  },
  remainingTime: {},
});
