import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const Rating = ({ rating }) => {
  const filledStars = Math.floor(rating / 2);
  const maxStars = Array(5 - filledStars).fill("staro");
  const r = [...Array(filledStars).fill("star"), ...maxStars];
  let key = 0;

  return (
    <View style={styles.rating}>
      <Text style={styles.ratingNumber}>{rating}</Text>
      {r.map((type) => {
        key += 1;
        return <AntDesign key={key} name={type} size={12} color="tomato" />;
      })}
    </View>
  );
};

Rating.propTypes = {
  rating: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  ratingNumber: { marginRight: 4, fontFamily: "Menlo", fontSize: 14 },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
});

export default Rating;
