import React, {useState} from 'react';
import {Text, View, Switch} from 'react-native';

export default DeviceDashboard = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={{flex: 5.8}}>
      <Text>Control your devices from here!</Text>
      <Text style={{textAlign: 'center'}}>Device List</Text>
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
