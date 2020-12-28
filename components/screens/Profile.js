import "react-native-gesture-handler";
import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import GlobalStyles from "../GlobalStyles";

export default function Profile({ navigation }) {
  return (
    <View style={[styles.container, GlobalStyles.droidSafeArea]}>
      {/* User profile View */}
      <View style={styles.profileView}>
        <Image
          style={styles.userImg}
          source={require("../../assets/me-icon-pink.png")}
        />

        {/* User Details */}
        <View style={styles.userDetails}>
          <Text style={styles.userName}>User name</Text>
          <Text style={styles.userEmail}>demo@emailid.com</Text>
        </View>
      </View>

      {/* Sign Out */}
      <View style={styles.signOutBtnView}>
        <Button
          style={styles.signOutBtn}
          title="Sign out"
          onPress={() => {
            Alert.alert("Signed out successfully!");
            navigation.navigate("Sign In");
          }}
        ></Button>
      </View>

      {/* Bottom NavBar */}
      <View style={styles.dock}>
        <View style={styles.navHome}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Image
              style={styles.navIcon}
              source={require("../../assets/home-icon-black.png")}
            />

            <Text style={{ textAlign: "center" }}>Home</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.navMe}>
          <TouchableOpacity>
            <Image
              style={styles.navIcon}
              source={require("../../assets/me-icon-pink.png")}
            />
            <Text style={{ textAlign: "center", color: "#9B0177" }}>Me</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3EFEF",
    flexDirection: "column",
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileView: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#ffff",
    justifyContent: "flex-end",
    paddingTop: 50,
    paddingLeft: 10,
  },
  userImg: {
    flex: 1.9,
    width: 130,
    height: 130,
    borderRadius: 130 / 2,
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
    justifyContent: "flex-start",
    // alignItems: "center",
    alignSelf: "center",
    marginTop: 40,
  },

  signOutBtn: {
    maxWidth: 120,
    maxHeight: 50,
  },

  dock: {
    flex: 0.25,
    justifyContent: "flex-end",
    display: "flex",
    flexDirection: "row",
  },

  navHome: {
    flex: 1,
    alignItems: "center",
  },

  navMe: {
    flex: 1,
    alignItems: "center",
  },

  navIcon: {
    width: 28,
    height: 28,
    marginLeft: 3.5,
  },
});
