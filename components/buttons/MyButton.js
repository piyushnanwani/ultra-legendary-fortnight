import React from "react";
import { Button, StyleSheet } from "react-native";

const MyButton = ({ title, type, disabled }) => {
  let opacity = { disabled } == true ? 0.4 : 1;
  let typeGet = type;
  return (
    <Button
      title={title}
      style={[styles.typeGet, { opacity: { opacity } }]}
    ></Button>
  );
};

const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: "#A82389",
    color: "#ffff",
    borderRadius: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryBtn: {
    backgroundColor: "#ffff",
    color: "#919191",
    borderColor: "#707070",
    borderRadius: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  tertiaryBtn: {},
});

export default MyButton;
