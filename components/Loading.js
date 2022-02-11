import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { AppLoading } from "expo";

const Loading = props => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
      <AppLoading {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Loading;
