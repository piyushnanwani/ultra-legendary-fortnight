import React, {useState, useEffect} from 'react';
import {Text, View, Switch, Button, Alert} from 'react-native';

const mqttFunction = (state) => {
  let stateStr = state == true ? 'ON' : 'OFF';
  var mqtt = require('@taoqf/react-native-mqtt');
  var client = mqtt.connect(
    'mqtt://io.adafruit.com',
    (opts = {username: 'morios', password: 'aio_fuXG44GKfB6d5aPqQEF3C8QwlDRo'}),
  );

  client.on('connect', function () {
    client.subscribe('morios/feeds/led', function (err) {
      if (!err) {
        client.publish('morios/feeds/led', stateStr);
      }
    });
  });

  client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
    client.end();
  });
};

export default DeviceDashboard = () => {
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
          mqttFunction(isEnabled);
        }}></Button>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 40,
        }}>
        <Text>Device Name</Text>
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
