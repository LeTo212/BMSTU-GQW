import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import AppLoading from "expo-app-loading";

import Colors from "../constants/colors";

const Loading = (props) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator
      animating
      size="large"
      style={{ opacity: 1 }}
      color={Colors.primary}
    />
    <AppLoading {...props} />
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Loading;
