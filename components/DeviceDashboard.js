import React, {useState, useEffect} from 'react';
import {Text, View, Switch, Button, Alert, Image} from 'react-native';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';

const mqttFunction = (state, deviceData) => {
  try {
    let stateStr = state == true ? 'ON' : 'OFF';
    let param = {
      username: deviceData.brokerUserName,
      x_aio_key: deviceData.brokerPassword,
      feed_key: 'led',
    };
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AIO-Key': deviceData.brokerPassword,
      },
      body: JSON.stringify({value: stateStr}),
    };
    fetch(
      `https://io.adafruit.com/api/v2/` +
        deviceData.brokerUserName +
        `/` +
        `feeds/` +
        `led/` +
        `data?username=${encodeURIComponent(param.username)}&x-aio-key=${
          param.x_aio_key
        }&feed_key=${param.feed_key}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        // Alert.alert(JSON.stringify(response));
      });
  } catch (e) {
    // Do something about it!
    console.log(e);
  }
};

const resetDeviceUsingMQTT = async (deviceData) => {
  try {
    let param = {
      username: deviceData.brokerUserName,
      x_aio_key: deviceData.brokerPassword,
      feed_key: 'led',
    };
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AIO-Key': deviceData.brokerPassword,
      },
      body: JSON.stringify({value: 'RST'}),
    };
    fetch(
      `https://io.adafruit.com/api/v2/` +
        deviceData.brokerUserName +
        `/` +
        `feeds/` +
        `led/` +
        `data?username=${encodeURIComponent(param.username)}&x-aio-key=${
          param.x_aio_key
        }&feed_key=${param.feed_key}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        // Alert.alert(JSON.stringify(response));
      });
  } catch (e) {
    // Do something about it!
    console.log(e);
  }
};
export default DeviceDashboard = (props) => {
  // const [device, setDevice] = useState(deviceData);
  let deviceData = props.deviceData;
  let deleteDevice = props.deleteDeviceFunction;
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    mqttFunction(!isEnabled, deviceData);
    setIsEnabled((previousState) => !previousState);
  };

  return (
    <View style={{flex: 5.8}}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 16,
          fontWeight: '600',
          color: '#A82389',
        }}>
        Device List{'\n\n'}
        (Rate: 30/minute)
      </Text>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 40,
            backgroundColor: '#7A2222',
            borderRadius: 20,
            padding: 20,
            opacity: 0.7,
          }}>
          <Text>Device 1</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEnabled ? '#A82389' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        <TouchableOpacity
          style={{
            flex: 2,
            marginLeft: 10,
            marginRight: 10,
            marginTop: 50,
            width: 50,
            height: 50,
            paddingTop: 5,
          }}
          onPress={() =>
            Alert.alert(
              'Remove device?',
              'On removing the device, you will no longer be able to control it.',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => {
                    console.log(
                      'OK Pressed! So deleting device from API + device RST',
                    );
                    deleteDevice().then(() => {
                      resetDeviceUsingMQTT(deviceData).then(() =>
                        console.log(
                          'deleted device from API & MQTT RST command send',
                        ),
                      );
                    });
                  },
                },
              ],
              {cancelable: false},
            )
          }>
          <Image
            style={{width: '50%', height: '50%'}}
            source={require('../assets/trash.png')}></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DeviceList = (devices) => {
  return <View></View>;
};
