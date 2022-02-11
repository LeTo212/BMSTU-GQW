import React from "react";
import { Dimensions, View, Text, StyleSheet, Image } from "react-native";

import Genres from "../components/Genres";
import Rating from "../components/Rating";
import Card from "../components/Card";

export const deviceWidth = Dimensions.get("window").width;

const MovieListItem = ({ movie }) => (
  <Card style={styles.container}>
    <Image source={{ uri: movie.poster }} style={styles.posterImage} />
    <View style={styles.infoContainer}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>{movie.title}</Text>
      <Rating rating={movie.rating} />
      <Genres genres={movie.genres} />
    </View>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    height: 150,
    width: deviceWidth * (9 / 10),
    marginBottom: "5%",
    flexDirection: "row",
    alignItems: "center",
  },
  posterImage: {
    width: 100,
    height: "100%",
    resizeMode: "cover",
    borderRadius: 24,
    marginRight: "3%",
  },
  infoContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
  },
});

export default MovieListItem;
