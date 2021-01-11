import React, {Component} from 'react';
import {
  Platform,
  View,
  Text,
  Alert,
  Modal,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {Buffer} from 'buffer';
import secrets from '../../../sercrets';

export default class SensorsComponent extends Component {
  constructor() {
    super();
    this.manager = new BleManager();
    this.state = {info: '', values: {}, modalVisible: false, modalMessage: ''};
    this.sensors = {
      0: 'LED',
    };
  }

  setModalVisible = (visible, message) => {
    this.setState({modalVisible: visible});
    this.setState({modalMessage: message});
  };
  info(message) {
    this.setState({info: message});
  }

  error(message) {
    this.setState({info: 'ERROR: ' + message});
  }

  updateValue(key, value) {
    this.setState({values: {...this.state.values, [key]: value}});
  }

  componentWillMount() {
    if (Platform.OS === 'ios') {
      this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') this.scanAndConnect();
      });
    } else {
      this.scanAndConnect();
      setTimeout(()=> {
        // if( this.props.IsPlaying == false ) {
          this.info('Failed to add device!');
          this.setModalVisible(true, 'Failed to add device!');
        // }
      }, 30000)
    }
  }

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      this.info('Scanning...');
      console.log(device);

      if (error) {
        this.error(error.message);
        this.setModalVisible(true, 'Failed to add device!');
        return;
      }

      if (device.name === 'mpy-uart') {
        this.info('Connecting to mpy-uart');
        this.manager.stopDeviceScan();
        device
          .connect()
          .then((device) => {
            this.info('Discovering services and characteristics');
            return device.discoverAllServicesAndCharacteristics();
          })
          .then((device) => {
            this.info('Writing credentials to device');
            return this.writeCredentials(device, this.props.dataToESP32);
          })
          .then(
            (response) => {
              if (response == 'success') {
                setTimeout(()=> {
                  this.info('Device added successfully!');
                  this.props.setIsPlaying(false);
                  this.setModalVisible(true, 'Device added successfully');
                }, 5000)
              } else {
                this.info('Failed to add device!');
                this.setModalVisible(true, 'Failed to add device!');
              }
              console.log(response);
            },
            (error) => {
              this.error(error.message);
            },
          );
      }
    });
  }

  async writeCredentials(device, dataToESP32) {
    /*  */
    console.log('wifi credentials , userId, token: ');
    console.log(dataToESP32);
    // console.log(props.params);
    let strArr = [
      `userId=${dataToESP32.userId}`,
      `jwt=${dataToESP32.token}`,
      `wifi=${dataToESP32.wifiName}`,
      `pass=${dataToESP32.wifiPassword}`,
    ];

    for (const str in strArr) {
      console.log(strArr[str]);

      // jwt string: SPECIAL CASE , break down and send
      if (strArr[str].slice(0, 3) == 'jwt') {
        let totalCharsSendingAtOnce = 16; // 20 total includeing 'jwt='
        let startIndex = 4;
        let endIndex = 21; // endIndex is not included
        let tokenLengthStr = 16;
        let actualLongTokenStr = strArr[str].substr(4);

        let totalIterationsOfLoop = actualLongTokenStr.length / 16;

        // send batch of 16 , remove these 16 and then other batch
        // of 16 till last
        for (let i = 1; i <= Math.floor(totalIterationsOfLoop); i++) {
          let shortToken = actualLongTokenStr.substr(0, 16);
          actualLongTokenStr = actualLongTokenStr.substr(16);
          // UTF8 input string
          let binaryData = Buffer.from('jwt=' + shortToken, 'utf8');

          // decode buffer as base64
          let base64Data = binaryData.toString('base64');
          const response = await device.writeCharacteristicWithResponseForService(
            secrets.ESP32_BLE_SERVICE_UUID,
            secrets.ESP32_BLE_CHARACTERISTIC_WRITE_UUID,
            base64Data,
          );
        }

        if (totalIterationsOfLoop - Math.floor(totalIterationsOfLoop) > 0) {
          // send left chars
          let shortToken = actualLongTokenStr.substr(0, 16);
          actualLongTokenStr = actualLongTokenStr.substr(16);
          // UTF8 input string
          let binaryData = Buffer.from('jwt=' + shortToken, 'utf8');

          // decode buffer as base64
          let base64Data = binaryData.toString('base64');
          const response = await device.writeCharacteristicWithResponseForService(
            secrets.ESP32_BLE_SERVICE_UUID,
            secrets.ESP32_BLE_CHARACTERISTIC_WRITE_UUID,
            base64Data,
          );
        }
      } else {
        // UTF8 input string
        let binaryData = Buffer.from(strArr[str], 'utf8');

        // decode buffer as base64
        let base64Data = binaryData.toString('base64');
        const response = await device.writeCharacteristicWithResponseForService(
          secrets.ESP32_BLE_SERVICE_UUID,
          secrets.ESP32_BLE_CHARACTERISTIC_WRITE_UUID,
          base64Data,
        );
      }
    }
    // let str = 'mail=bhalobhashi';
    // create buffer from string
    return 'success';
  }
  async setupNotifications(device) {
    for (const id in this.sensors) {
      const service = this.serviceUUID(id);
      const characteristicW = this.writeUUID(id);
      const characteristicN = this.notifyUUID(id);

      // const btoa_data = btoa('mail_piyush');

      const characteristic = await device.writeCharacteristicWithResponseForService(
        service,
        characteristicW,
        'mail=asd' /* 0x01 in hex */,
      );

      device.monitorCharacteristicForService(
        service,
        characteristicN,
        (error, characteristic) => {
          if (error) {
            this.error(error.message);
            return;
          }
          this.updateValue(characteristic.uuid, characteristic.value);
        },
      );
    }
  }

  render() {
    const {modalVisible} = this.state;
    return (
      <View style={styles.centeredView}>
        <Text>{this.state.info}</Text>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{this.state.modalMessage}</Text>

              <TouchableHighlight
                style={{...styles.openButton, backgroundColor: '#2196F3'}}
                onPress={() => {
                  this.setModalVisible(!modalVisible, this.state.modalMessage);
                  this.props.navigation.navigate('Home');
                }}>
                <Text style={styles.textStyle}>Go to Home</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
