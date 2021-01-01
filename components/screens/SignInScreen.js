import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  SafeAreaView,
  Alert,
} from 'react-native';
import GlobalStyles from '../GlobalStyles';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import {AuthContext} from '../../App';
export default function SignInScreen({navigation}) {
  const {signIn} = React.useContext(AuthContext);
  const {isSignedIn} = React.useContext(AuthContext);
  const {getCurrentUser} = React.useContext(AuthContext);
  return (
    <SafeAreaView style={[styles.container, GlobalStyles.droidSafeArea]}>
      <View style={styles.titleView}>
        <Text style={styles.title}>Smart Home App</Text>
      </View>

      <View style={styles.signInBtnView}>
        <GoogleSigninButton
          onPress={async () => {
            const isSignIn = await isSignedIn();
            console.log(isSignIn);
            if (!isSignIn) {
              console.log('sign in !');
              signIn();
            } else {
              // get and sets current user to App state & calls Async storage
              console.log('get user !');
              getCurrentUser();
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#403D3D',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  titleView: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#D9D9D9',
    fontSize: 30,
    textAlign: 'center',
  },
  signInBtnView: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  signInBtn: {},
});
