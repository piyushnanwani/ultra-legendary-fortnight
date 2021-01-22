import React, {useState} from 'react';
import {
  Text,
  View,
  Alert,
  TextInput,
  StyleSheet,
  PermissionsAndroid,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Dimensions,
} from 'react-native';
import {Button} from 'react-native-paper';
import FormInput from '../../../src/components/FormInput';
import FormButton from '../../../src/components/FormButton';
import {event} from 'react-native-reanimated';

const {width, height} = Dimensions.get('screen');

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

  handleChange = (eventData) => {
    if (eventData.wifiName) {
      this.setState({
        wifiName: eventData.wifiName,
      });
    } else if (eventData.wifiPassword) {
      this.setState({
        wifiPassword: eventData.wifiPassword,
      });
    }
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
    const {email, wifiName, wifiPassword} = this.state;
    console.log(this.state);
    let currentStep = this.state.currentStep;
    if (currentStep == 3) {
      console.log('printing state value in step 3 ');
      console.log(this.state);
      const {navigation, userIdNtoken} = this.props;
      console.log('Adding Device being called here!');
      console.log(userIdNtoken);
      console.log(userIdNtoken.userId);
      requestBluetoothLocationPermission().then(() => {
        navigation.navigate('AddingDevice', {
          userId: userIdNtoken.userId,
          wifiName,
          wifiPassword,
          token: userIdNtoken.token,
        });
      });
    }
    if (currentStep == 2) {
      if (wifiName === '') {
        Alert.alert('Please enter wifi name');
        return;
      }
      if (wifiPassword == '') {
        Alert.alert('Please enter wifi password');
        return;
      }
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
          // handleChange={this.handleChange}
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
          // handleChange={this.handleChange}
        />
        <View style={[styles.btnView]}>
          <Button
            icon="chevron-left"
            mode="contained"
            uppercase={false}
            color="#9B0177"
            disabled={this.state.currentStep == 1 ? true : false}
            onPress={() => {
              this._prev();
            }}>
            Back
          </Button>
          <Button
            icon="chevron-right"
            color="#9B0177"
            mode="contained"
            uppercase={false}
            onPress={() => {
              this._next();
            }}>
            Next
          </Button>
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
      <Text style={styles.instructionSteps}>
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
  const [wifiName, setWifiName] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  console.log(props);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.stepStyle}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.instructionSteps}>
            Step 2: {'\n\n'}
            Enter your WiFi credentials {'\n'}
          </Text>

          <FormInput
            autocapitalize="none"
            labelName="WiFi Name"
            value={props.wifiName}
            onChangeText={(text) => {
              setWifiName(text);
              props.handleChange({wifiName: text});
            }}
            value={wifiName}
            style={styles.input}
          />

          <FormInput
            labelName="Password"
            autocapitalize="none"
            secureTextEntry={true}
            onChangeText={(text) => {
              setWifiPassword(text);
              props.handleChange({wifiPassword: text});
            }}
            value={wifiPassword}
            style={styles.input}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

function Step3(props) {
  if (props.currentStep !== 3) {
    return null;
  }
  return (
    <View style={styles.stepStyle}>
      <Text style={styles.instructionSteps}>
        Step 3: {'\n\n'}
        Turn on your bluetooth and location{'\n'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    marginTop: 10,
    width: width / 2.5,
    height: height / 15,
  },
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
    paddingBottom: 30,
  },
  textStyle: {
    textAlign: 'center',
    flex: 1,
    fontSize: 16,
    paddingTop: 20,
    fontWeight: '700',
  },
  stepStyle: {
    paddingHorizontal: 50,
    flex: 2,
  },
  instructionSteps: {
    color: '#504F4F',
  },
  inner: {
    padding: 24,
    flex: 2,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 20,
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
      Alert.alert('We need these permissions to add the device');
      console.log('Location permission denied');
      // requestBluetoothLocationPermission('')
    }
  } catch (err) {
    console.warn(err);
  }
};
