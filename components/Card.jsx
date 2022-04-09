import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, ViewPropTypes } from "react-native";

import Colors from "../constants/colors";

const Card = ({ style, children }) => (
  <View style={{ ...styles.card, ...style }}>{children}</View>
);

Card.propTypes = {
  style: ViewPropTypes.style,
  children: PropTypes.node,
};

Card.defaultProps = {
  style: null,
  children: null,
};

const styles = StyleSheet.create({
  card: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    backgroundColor: Colors.secondary,
    borderRadius: 34,
    zIndex: 100,
  },
});

export default Card;
