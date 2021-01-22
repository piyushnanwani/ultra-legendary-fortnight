import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import GlobalStyles from '../GlobalStyles';
import {AuthContext} from '../../App';
import {Button} from 'react-native-paper';
export default function Profile({navigation}) {
  const {getCurrentUser2} = React.useContext(AuthContext);
  const {signOut} = React.useContext(AuthContext);
  const [name, setName] = useState('Username');
  const [email, setEmail] = useState('user@email.com');
  const [photo, setPhoto] = useState(null);
  useEffect(() => {
    getCurrentUser2().then((response) => {
      setName(response.user.name);
      setEmail(response.user.email);
      setPhoto(response.user.photo);
    });
  }, []);

  return (
    <View style={[styles.container, GlobalStyles.droidSafeArea]}>
      {/* User profile View */}
      <View style={styles.profileView}>
        {photo == '' ? (
          <Image
            style={styles.userImg}
            source={require('../../assets/me-icon-pink.png')}
          />
        ) : (
          <Image style={styles.userImg} source={{uri: photo}} />
        )}
        {/* User Details */}
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{name}</Text>
          {/* <Text style={styles.userName}>Piyush Nanwani</Text> */}
          <Text style={styles.userEmail}>
            {email}
            {/* dummy@email.com {userProfile.user.email} */}
          </Text>
        </View>
      </View>

      {/* Sign Out */}
      <View style={styles.signOutBtnView}>
        <Button
          color="#9B0177"
          style={styles.signOutBtn}
          mode="contained"
          uppercase={false}
          onPress={() => {
            navigation.goBack();
            signOut();
          }}>
          Sign out
        </Button>
      </View>

      {/* Bottom NavBar */}
      <View style={styles.dock}>
        <View style={styles.navHome}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image
              style={styles.navIcon}
              source={require('../../assets/home-icon-black.png')}
            />

            <Text style={{textAlign: 'center'}}>Home</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.navMe}>
          <TouchableOpacity>
            <Image
              style={styles.navIcon}
              source={require('../../assets/me-icon-pink.png')}
            />
            <Text style={{textAlign: 'center', color: '#9B0177'}}>Me</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3EFEF',
    flexDirection: 'column',
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ffff',
    justifyContent: 'flex-end',
    paddingTop: 50,
    paddingLeft: 10,
  },
  userImg: {
    flex: 1.9,
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
  },

  userDetails: {
    flex: 4,
    paddingLeft: 20,
    paddingTop: 20,
  },

  userName: {
    fontSize: 24,
  },
  userEmail: {
    fontSize: 16,
  },

  signOutBtnView: {
    flex: 2,
    // backgroundColor: "#ffff",
    justifyContent: 'flex-start',
    // alignItems: "center",
    alignSelf: 'center',
    marginTop: 40,
  },

  signOutBtn: {
    maxWidth: 120,
    maxHeight: 50,
  },

  dock: {
    flex: 0.25,
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
});
