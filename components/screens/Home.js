import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import DeviceDashboard from '../DeviceDashboard';
import GlobalStyles from '../GlobalStyles';
import {AuthContext} from '../../App';

export default function Home({navigation}) {
  const {getCurrentUser2} = React.useContext(AuthContext);

  const [isLoading, setLoading] = useState(true);

  const [userId, setUserId] = useState('');
  // const [deviceId, setDeviceId] = useState('');

  const [user, setUser] = useState({});
  const [device, setDevice] = useState({});

  const [isDeviceRegistered, setIsDeviceRegistered] = useState(false);

  useEffect(() => {
    getCurrentUser2()
      .then((response) => {
        setUser(response.user);
        let emailStr = response.user.email;
        let userIdStr = emailStr.slice(0, emailStr.indexOf('@'));
        console.log(emailStr);
        console.log(userIdStr);
        /* extracting userId from emailId */
        setUserId(userIdStr);
        console.log('response 1');
        return userIdStr;
      })
      .then((userIdStr) => {
        return fetch('http://192.168.29.190:3000' + '/users/' + userIdStr).then(
          (userResponse) => {
            console.log('response 2');
            console.log(userResponse);
            return userIdStr;
          },
        );
      })
      .then((userIdStr) => {
        fetch('http://192.168.29.190:3000' + '/devices/' + userIdStr, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
          .then((deviceResponse) => {
            return deviceResponse.json();

            // // this means device is registered and we have got device details
            // if (deviceResponse.status == 200) {
            //   console.log(deviceResponse);
            // }
          })
          .then((res) => {
            setIsDeviceRegistered(true);
            setDevice(res);
            console.log(res);
          });
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  // useEffect(() => {
  //   // get user id from google sign in and setState => fetch that user from APi if not present POST

  // }, []);
  // useEffect(() => {
  //   // check if user is registered or not
  //   // if yes load user data and device data
  //   fetch('http://localhost:3000/users/pnanwani61')
  //     .then((response) => {
  //       response.json()
  //     })
  //     .then((json) => {
  //       setUser(json.movies)
  //     })
  //     .catch((error) => console.error(error))
  //     .finally(() => setLoading(false));

  // }, []);
  // useEffect(() => {
  //   // 1. api call to check if any device registered with this user or not
  //   if (true) {
  //     setIsDeviceRegistered(true);
  //   }

  //   // if yes, load device dashboard with data from api
  //   // if not, button to add device (i.e load default screen)
  // }, []);
  return isLoading == true ? (
    <View style={{flex: 1}}>
      <ActivityIndicator />
    </View>
  ) : isDeviceRegistered == false ? (
    <SafeAreaView style={[styles.container, GlobalStyles.droidSafeArea]}>
      <Button
        title="Toggle Device register behavior"
        onPress={() => setIsDeviceRegistered(!isDeviceRegistered)}></Button>
      <View style={styles.imgView}>
        <Image
          style={styles.cloudImg}
          source={require('../../assets/cloud-computing.png')}
        />
      </View>
      <View style={styles.titleView}>
        <Text style={styles.title}>No devices</Text>
      </View>
      <View style={styles.btnView}>
        <Button
          style={styles.addDeviceBtn}
          title="Add device"
          onPress={() => navigation.navigate('AddDevice')}></Button>
      </View>

      <View style={styles.dock}>
        <View style={styles.navHome}>
          <TouchableOpacity>
            <Image
              style={styles.navIcon}
              source={require('../../assets/home-icon-pink.png')}
            />

            <Text style={{textAlign: 'center', color: '#9B0177'}}>Home</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.navMe}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              style={styles.navIcon}
              source={require('../../assets/me-icon-black.png')}
            />
            <Text style={{textAlign: 'center'}}>Me</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={[styles.container, GlobalStyles.droidSafeArea]}>
      <Button
        title="Toggle Device register behavior"
        onPress={() => setIsDeviceRegistered(!isDeviceRegistered)}></Button>
      <DeviceDashboard style={styles.deviceDashboard} deviceData={device} />
      {/* Bottom Dock */}

      <View style={styles.dock}>
        <View style={styles.navHome}>
          <TouchableOpacity>
            <Image
              style={styles.navIcon}
              source={require('../../assets/home-icon-pink.png')}
            />

            <Text style={{textAlign: 'center', color: '#9B0177'}}>Home</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.navMe}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              style={styles.navIcon}
              source={require('../../assets/me-icon-black.png')}
            />
            <Text style={{textAlign: 'center'}}>Me</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3EFEF',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cloudImg: {
    height: 80,
    width: 80,
    opacity: 0.4,
    alignSelf: 'center',
  },
  imgView: {
    flex: 2.8,
    justifyContent: 'flex-end',
  },
  titleView: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  btnView: {
    flex: 2,
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },

  title: {
    textAlign: 'center',
    // marginTop: "5%",
    color: '#312C2C',
    fontSize: 20,
    // flex: 1,
  },
  addDeviceBtn: {
    maxHeight: 40,
    maxWidth: 120,
    // fontSize: 24,
    // backgroundColor: "#9B0177",
    // backgroundColor: "black",
    // borderRadius: 30,
  },
  dock: {
    flex: 0.5,
    justifyContent: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
  },
  navHome: {
    flex: 1,
    alignItems: 'center',
  },
  navMe: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    width: 28,
    height: 28,
    marginLeft: 3.5,
  },
  deviceDashboard: {
    flex: 5.8,
  },
});
