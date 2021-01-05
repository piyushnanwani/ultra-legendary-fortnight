import React, {useState, useEffect} from 'react';
import {Text, View, Switch, Button, Alert} from 'react-native';

const mqttFunction = (state, deviceData) => {
  console.log(deviceData);
  let stateStr = state == true ? 'ON' : 'OFF';
  var mqtt = require('@taoqf/react-native-mqtt');
  var client = mqtt.connect(
    deviceData.brokerUrl,
    (opts = {
      username: deviceData.brokerUserName,
      password: deviceData.brokerPassword,
    }),
    // (opts = {username: 'morios', password: 'aio_fuXG44GKfB6d5aPqQEF3C8QwlDRo'}),
  );

  client.on('connect', function () {
    client.subscribe(deviceData.publishedTopic1, function (err) {
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
};

export default DeviceDashboard = ({deviceData}) => {
  // const [device, setDevice] = useState(deviceData);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  // useEffect(() => {
  //   mqttFunction(isEnabled);
  // }, [isEnabled]);
  return (
    <View style={{flex: 5.8}}>
      <Text style={{textAlign: 'center'}}>Device List</Text>
      <Text>Control your devices from here!(Rate: 30/minute)</Text>
      <Button
        title="Connect to client"
        onPress={() => {
          Alert.alert('update to client sent!');
          mqttFunction(isEnabled, deviceData);
        }}></Button>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 40,
        }}>
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
