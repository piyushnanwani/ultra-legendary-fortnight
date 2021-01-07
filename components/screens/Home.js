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
  Alert,
} from 'react-native';
import DeviceDashboard from '../DeviceDashboard';
import GlobalStyles from '../GlobalStyles';
import {AuthContext} from '../../App';

import secrets from '../../sercrets';

export default function Home({navigation}) {
  const {getCurrentUser2} = React.useContext(AuthContext);

  const [isLoading, setLoading] = useState(true);

  const [apiJwtToken, setApiJwtToken] = useState('');

  const [userId, setUserId] = useState('');
  // const [deviceId, setDeviceId] = useState('');

  const [user, setUser] = useState({});
  const [device, setDevice] = useState({});

  const [isDeviceRegistered, setIsDeviceRegistered] = useState(false);

  const getSetGoogleUser = async () => {
    const currentUser = await getCurrentUser2();
    setUser(await currentUser.user);
    // console.log(currentUser);

    let emailStr = await currentUser.user.email;
    let userIdStr = await emailStr.slice(0, await emailStr.indexOf('@'));
    setUserId(await userIdStr);
    return {
      user: await currentUser.user,
      userId: await currentUser.user.email.slice(
        0,
        await currentUser.user.email.indexOf('@'),
      ),
    };
  };
  // const getSetGoogleUserId = async () => {
  //   const response = await user;
  //   /* extracting userId from emailId */
  //   let emailStr = await response.email;
  //   let userIdStr = await emailStr.slice(0, await emailStr.indexOf('@'));
  //   setUserId(await userIdStr);
  // };

  const regsiterUserToAPI = async (user, userId) => {
    const userPOST = {
      userId: userId,
      password: secrets.CLIENT_API_PASS,
      email: user.email,
      firstName: user.givenName,
      lastName: user.familyName,
      imageUrl: user.photo,
    };
    console.log('registering user to API!');
    console.log(userPOST);
    console.log(user);

    const options = {
      method: 'POST',
      body: JSON.stringify(userPOST),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return await fetch(secrets.API_URL + '/users/register', options).then(
      function (res) {
        console.log(res.status);
        return {res: res.json(), status: res.status, user, userId};
      },
    );
  };

  const loginUserToAPI = async (user, userId) => {
    const userPOST = {
      userId: userId,
      password: secrets.CLIENT_API_PASS,
    };
    console.log('logging user to API here!');
    console.log(user);
    console.log(userPOST);
    const options = {
      method: 'POST',
      body: JSON.stringify(userPOST),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return await fetch(secrets.API_URL + '/users/authenticate', options).then(
      async function (res) {
        return {res: await res.json(), status: res.status, user, userId};
      },
    );
  };

  const getSetUserDeviceFromAPI = async (jwtToken, userId) => {
    console.log('getting device registered with this user from API!');
    console.log(jwtToken);
    console.log('reminder!  set jwt toten as global state, use context!');
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    return await fetch(secrets.API_URL + `/devices/${userId}`, options).then(
      async function (res) {
        return {res: await res.json(), status: res.status, userId};
      },
    );
  };
  const userSetup = async () => {
    const response = await loginUserToAPI();
    // const responseJSON = await response.json();
    console.log(response);
    // let jwtToken = await responseJSON.token;

    // if (responseJSON.status == 400) {
    //   // register user
    //   const responseOnRegister = await regsiterUserToAPI();
    //   const responseOnRegisterJSON = await responseOnRegister.json();

    //   // now login
    //   const responseOnLogin = await loginUserToAPI();
    //   const responseOnLoginJSON = await responseOnLogin.json();

    //   jwtToken = await responseOnLoginJSON.token;
    // }

    // // now get UserDevice from API
    // // 1. set device details 2. set isregistered to true
    // const responseOnDevice = await getSetUserDeviceFromAPI(jwtToken);
  };

  useEffect(() => {
    try {
      (() => {
        console.log('1');
        getSetGoogleUser()
          .then(({user, userId}) => {
            console.log('2');
            console.log(user);
            console.log(userId);
            let jwtToken = '';
            // loginUserToAPI('pnanwani61', userId).then(({res, status, user, userId}) => {
            loginUserToAPI(user, userId).then(
              async ({res, status, user, userId}) => {
                console.log('3');
                console.log(res);
                console.log(status);
                console.log(user);
                console.log(userId);
                if (status == 400) {
                  console.log('4');
                  regsiterUserToAPI(user, userId).then(
                    ({res, status, user, userId}) => {
                      console.log('5');
                      if (status == 200) {
                        console.log('6');
                        loginUserToAPI(user, userId).then(
                          async ({res, status, user, userId}) => {
                            console.log('7');
                            console.log(res);
                            console.log(status);
                            jwtToken = await res.token;
                          },
                        );
                      }
                    },
                  );
                } else if (status == 200) {
                  console.log('8');
                  console.log(res);
                  jwtToken = await res.token;
                } else {
                  Alert.alert('Error! try again!');
                }
                if (jwtToken != '') {
                  setApiJwtToken(jwtToken); // first set token
                  // means user logged in and we have token
                  getSetUserDeviceFromAPI(jwtToken, userId).then(
                    ({res, status, userId}) => {
                      // some device is registered with this user
                      if (status == 200) {
                        console.log('Details of registered device!');
                        console.log(res);
                        setDevice(res);
                        setIsDeviceRegistered(true);
                        console.log(device);
                        console.log(
                          'Now load device dasboard with above info and control',
                        );
                      } else {
                        console.log('No device registered with this user!');
                      }
                      /* Now Loading is done */
                      setLoading(false);
                    },
                  );
                }
              },
            );
          })
          .then(() => {
            console.log('Hulara hjkashdkjashd');
            // setLoading(false);
          });
      })();
    } catch (err) {
      console.error(err);
    } finally {
      console.log('hello , finally finally called!!!!!!!');
    }
  }, []);
  // useEffect(() => {
  //   try {
  //     console.log('jinga laa ');
  //     // console.log('6');
  //     // console.log(userId);
  //     // console.log(user);
  //     // console.log('7');
  //     // userSetup();
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

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
    <SafeAreaView style={[styles.container, GlobalStyles.droidSafeArea]}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    </SafeAreaView>
  ) : isDeviceRegistered == false ? (
    <SafeAreaView style={[styles.container, GlobalStyles.droidSafeArea]}>
      {/* <Button
        title="Toggle Device register behavior"
        onPress={() => setIsDeviceRegistered(!isDeviceRegistered)}></Button> */}
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
          onPress={() =>
            navigation.navigate('AddDevice', {
              userId: userId,
              token: apiJwtToken,
            })
          }></Button>
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
      {/*       <Button
        title="Toggle Device register behavior"
        onPress={() => setIsDeviceRegistered(!isDeviceRegistered)}></Button> */}
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
