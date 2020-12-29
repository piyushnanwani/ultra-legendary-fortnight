import React, {useState} from 'react';
import {
  Text,
  View,
  Button,
  Alert,
  TextInput,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';

export default class MasterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      email: '',
      wifiName: '',
      wifiPassword: '',
    };
  }

  handleChange = (event) => {
    const {name, value} = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {email, wifiName, wifiPassword} = this.state;
    Alert.alert(`Your registration detail: \n 
           Email: ${email} \n 
           wifiName: ${wifiName} \n
           wifiPassword: ${wifiPassword}`);
  };

  _next = () => {
    let currentStep = this.state.currentStep;
    if (currentStep == 3) {
      const {navigation} = this.props;
      requestBluetoothLocationPermission();
      navigation.navigate('AddingDevice');
    }

    currentStep = currentStep >= 2 ? 3 : currentStep + 1;
    this.setState({
      currentStep: currentStep,
    });
  };

  _prev = () => {
    let currentStep = this.state.currentStep;
    currentStep = currentStep <= 1 ? 1 : currentStep - 1;
    this.setState({
      currentStep: currentStep,
    });
  };

  render() {
    return (
      <View style={styles.masterForm}>
        <Text style={styles.textStyle}>Reset the device</Text>

        <Step1
          currentStep={this.state.currentStep}
          handleChange={this.handleChange}
          email={this.state.email}
        />
        <Step2
          currentStep={this.state.currentStep}
          handleChange={this.handleChange}
          wifiName={this.state.wifiName}
          password={this.state.wifiPassword}
        />
        <Step3
          currentStep={this.state.currentStep}
          handleChange={this.handleChange}
        />
        <View style={[styles.btnView]}>
          <Button
            title="Back"
            onPress={() => {
              this._prev();
            }}
          />
          <Button
            title="Next"
            onPress={() => {
              this._next();
            }}
          />
          {/* {this.previousButton()}
          {this.nextButton()} */}
        </View>
      </View>
    );
  }
}

function Step1(props) {
  if (props.currentStep !== 1) {
    return null;
  }

  return (
    <View style={styles.stepStyle}>
      <Text>
        Step 1: {'\n\n'}
        Power on the device after it has been powered off for 10s
      </Text>
    </View>
  );
}

function Step2(props) {
  if (props.currentStep !== 2) {
    return null;
  }
  const [wifiName, setWifiName] = useState('Enter WiFi Name');
  const [wifiPassword, setWifiPassword] = useState('Enter Password');
  return (
    <View style={styles.stepStyle}>
      <Text>
        Step 2: {'\n\n'}
        Enter your WiFi credentials {'\n'}
      </Text>

      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          paddingLeft: 5,
        }}
        placeholder="Enter WiFi Name"
        value={props.wifiName}
        onFocus={() => {
          if (wifiName == 'Enter WiFi Name') setWifiName('');
        }}
        onChangeText={(text) => setWifiName(text)}
        value={wifiName}
      />

      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          paddingLeft: 5,
        }}
        placeholder="Enter password"
        value={props.wifiPassword}
        secureTextEntry={true}
        onFocus={() => {
          if (wifiPassword == 'Enter password') setWifiPassword('');
        }}
        onChangeText={(text) => setWifiPassword(text)}
        value={wifiPassword}
      />
    </View>
  );
}

function Step3(props) {
  if (props.currentStep !== 3) {
    return null;
  }
  return (
    <View style={styles.stepStyle}>
      <Text>
        Step 3: {'\n\n'}
        Turn on your Bluetooth and select your device {'\n'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  btnView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    maxHeight: 30,
    marginBottom: 25,
  },
  masterForm: {
    flex: 1,
    marginHorizontal: 20,
  },
  textStyle: {
    textAlign: 'center',
    flex: 1,
  },
  stepStyle: {
    paddingHorizontal: 50,
    flex: 1,
  },
});

const requestBluetoothLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the Location');
    } else {
      console.log('Location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
