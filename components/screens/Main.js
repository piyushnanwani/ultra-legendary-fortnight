import 'react-native-gesture-handler';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  SafeAreaView,
  Alert,
} from 'react-native';
import GlobalStyles from '../GlobalStyles';

export default function Main({navigation}) {
  return (
    <SafeAreaView style={[styles.container, GlobalStyles.droidSafeArea]}>
      <View style={styles.titleView}>
        <Text style={styles.title}>Smart Home App</Text>
      </View>

      <View style={styles.signInBtnView}>
        <Button
          style={styles.signInBtn}
          onPress={() => {
            Alert.alert('Button pressed my boy!');
            navigation.navigate('Home');
          }}
          title="Sign in with Google"></Button>
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
