import React from "react";
import { StyleSheet, Text, View, ViewPropTypes } from "react-native";
import PropTypes from "prop-types";
import Feather from "react-native-vector-icons/Feather";

import Colors from "../constants/colors";

const NotFound = ({ children, style, textStyle }) => (
  <View
    style={{
      ...styles.container,
      ...style,
    }}
  >
    <Text style={{ ...styles.text, ...textStyle }}>{children}</Text>
    <Feather name="frown" color={Colors.primary} size={80} />
  </View>
);

NotFound.propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
  textStyle: ViewPropTypes.style,
};

NotFound.defaultProps = {
  children: null,
  style: null,
  textStyle: null,
};

export default NotFound;

const styles = StyleSheet.create({
  container: {
    marginVertical: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: Colors.primary,
    fontSize: 30,
    marginBottom: "3%",
    textAlign: "center",
  },
});
