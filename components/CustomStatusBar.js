import React from "react";
import { View, StyleSheet, StatusBar, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getStatusBarHeight } from "react-native-status-bar-height";

const STATUSBAR_HEIGHT =
  getStatusBarHeight() + Dimensions.get("window").height / 10;

const CustomStatusBar = ({ backgroundColor, ...props }) => {
  return (
    <View style={styles.statusBar}>
      <LinearGradient
        colors={[backgroundColor, "rgba(0, 0, 0, 0)"]}
        style={{
          height: STATUSBAR_HEIGHT,
          width: "100%",
          position: "absolute",
          top: 0,
        }}
      />
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    position: "absolute",
    zIndex: 10,
    height: STATUSBAR_HEIGHT,
    width: "100%",
  },
});

export default CustomStatusBar;
