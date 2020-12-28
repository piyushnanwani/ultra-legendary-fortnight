import "react-native-gesture-handler";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import MasterForm from "./MasterForm";
import GlobalStyles from "../../GlobalStyles";

export default function AddDevice({ navigation }) {
  return (
    <SafeAreaView style={[styles.container]}>
      <Button
        title="Cancel"
        style={{ flex: 1, paddingRight: 40 }}
        onPress={() => navigation.navigate("Home")}
      ></Button>
      <View style={styles.subContainer}>
        <MasterForm navigation={navigation} />
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
    backgroundColor: "#ddd",
  },
  subContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    flex: 1,
    // justifyContent: "flex-end",
    justifyContent: "space-around",
    flexDirection: "column",
    borderRadius: 20,
  },
  btnView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
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
