import React, {useState, useEffect} from 'react';
import {Text, View, Switch, Button, Alert} from 'react-native';

const mqttFunction = (state, deviceData) => {
  try {
    let stateStr = state == true ? 'ON' : 'OFF';
    var mqtt = require('@taoqf/react-native-mqtt');
    var client = mqtt.connect(
      `mqtt://${deviceData.brokerUrl}`,
      {
        username: deviceData.brokerUserName,
        password: deviceData.brokerPassword,
      },
    );

    client.on('connect', function () {
      client.subscribe(deviceData.subscribedTopic1, function (err) {
        if (!err) {
          client.publish(deviceData.subscribedTopic1, stateStr);
        }
      });
    });

    client.on('message', function (topic, message) {
      // message is Buffer
      console.log(message.toString());
      client.end();
    });
  } catch (error) {
    console.log(error);
  }
};

export default DeviceDashboard = ({deviceData}) => {
  // const [device, setDevice] = useState(deviceData);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    mqttFunction(!isEnabled, deviceData);
    setIsEnabled((previousState) => !previousState);

  }

  // useEffect(() => {
  //   mqttFunction(isEnabled);
  // }, [isEnabled]);
  return (
    <View style={{flex: 5.8}}>
      <Text style={{textAlign: 'center', fontSize: 16, fontWeight: "600", color: '#A82389'}}>Device List{'\n\n'}
      (Rate: 30/minute)
      </Text>
      <Text></Text>
      {/* <Button
        title="Connect to client"
        onPress={() => {
          mqttFunction(isEnabled, deviceData);
          // mqttFunction2();
          Alert.alert('update to client sent!');
        }}
      ></Button> */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 40,
        }}
      >
        <Text>Device 1</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
};

const DeviceList = (devices) => {
  return <View></View>;
};
