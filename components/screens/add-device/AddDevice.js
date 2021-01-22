import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Button} from 'react-native-paper';
import MasterForm from './MasterForm';
import GlobalStyles from '../../GlobalStyles';

export default function AddDevice({navigation, route}) {
  const {userId, token} = route.params;
  console.log('AddDevice !');
  console.log([userId, token]);
  return (
    <SafeAreaView style={[styles.container]}>
      <View style={{flex: 1, alignItems: 'flex-start'}}>
        <Button
          color="#9B0177"
          mode="contained"
          uppercase={false}
          style={{flex: 1, maxHeight: 35, maxWidth: 120}}
          onPress={() => navigation.navigate('Home')}>
          Cancel
        </Button>
      </View>
      <View style={styles.subContainer}>
        <MasterForm navigation={navigation} userIdNtoken={{userId, token}} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ddd',
  },
  subContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    flex: 10,
    // justifyContent: "flex-start",
    // justifyContent: 'space-around',
    flexDirection: 'column',
    borderRadius: 20,
  },
  btnView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    maxHeight: 30,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 40,
//     paddingBottom: 40,
//     paddingHorizontal: 20,
//     // paddingBottom: 20,
//     flexDirection: "column",
//     justifyContent: "space-between",
//     backgroundColor: "#ddd",
//   },
//   subContainer: {
//     marginTop: 20,
//     backgroundColor: "#fff",
//     flex: 4,
//     // justifyContent: "flex-end",
//     justifyContent: "space-around",
//     flexDirection: "column",
//     borderRadius: 20,
//   },
//   btnView: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-around",
//     maxHeight: 30,
//   },
// });
