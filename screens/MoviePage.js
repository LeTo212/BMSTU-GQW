import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Text,
  View,
  Platform,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { AuthContext } from "../constants/context";

import Movie from "../components/Movie";
import Genres from "../components/Genres";
import Card from "../components/Card";
import Colors from "../constants/colors";
import { getFavorites, changeFavorite } from "../api";
import Loading from "../components/Loading";

const { width, height } = Dimensions.get("window");
const TEXTMARGINVERTICAL = "2%";
const ITEM_SIZE = Platform.OS === "ios" ? width * 0.72 : width * 0.74;
const BACKDROP_HEIGHT = height * 0.65;
const FAVORITE_COLOR = "#DC7633";

const MoviePage = props => {
  const token = props.route.params.token;
  const movie = props.route.params.movie;
  const { signOut } = React.useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const favorites = await getFavorites(token);

      if (favorites.statusCode === 401) {
        signOut();
        return;
      }

      setIsFavorite(
        favorites.data.find(x => x.MovieID == movie.key) ? true : false
      );
    };

    if (isFavorite == null) {
      fetchData();
    }
  }, [isFavorite]);

  const pressHandler = (movieID, isValid) => {
    setIsFavorite(isValid);
    changeFavorite(movieID, isValid, token);
  };

  if (isFavorite == null) {
    return <Loading />;
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ alignItems: "center" }}
      horizontal={false}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={{ height: BACKDROP_HEIGHT, width, position: "absolute" }}>
        <LinearGradient
          colors={[Colors.primary, "rgba(0, 0, 0, 0)"]}
          style={{
            height: BACKDROP_HEIGHT / 2,
            zIndex: 1,
            width,
            position: "absolute",
            top: 0,
          }}
        />
        <Image
          source={{ uri: movie.backdrop }}
          blurRadius={2}
          style={{
            width,
            height: BACKDROP_HEIGHT,
            position: "absolute",
          }}
        />
        <LinearGradient
          colors={["rgba(0, 0, 0, 0)", Colors.primary]}
          style={{
            height: BACKDROP_HEIGHT,
            width,
            position: "absolute",
            bottom: 0,
          }}
        />
      </View>
      <Card style={styles.posterContainer}>
        <Image source={{ uri: movie.poster }} style={styles.posterImage} />
        <Text style={styles.title}>{movie.title}</Text>
      </Card>

      <View style={styles.movieContainer}>
        <Card style={styles.movieInfo}>
          <TouchableOpacity
            onPress={() => pressHandler(movie.key, !isFavorite)}
            style={[
              styles.favorite,
              isFavorite
                ? { borderColor: FAVORITE_COLOR }
                : { borderColor: "black" },
            ]}
          >
            <AntDesign
              name={isFavorite ? "heart" : "hearto"}
              color={isFavorite ? FAVORITE_COLOR : "black"}
              size={20}
            />
            <Text
              style={[
                styles.appButtonText,
                isFavorite ? { color: FAVORITE_COLOR } : { color: "black" },
              ]}
            >
              {isFavorite ? "Добавлено в избранное" : "Добавить в избранное"}
            </Text>
          </TouchableOpacity>

          <Text style={{ marginVertical: TEXTMARGINVERTICAL }}>
            Тип: {movie.type}
          </Text>
          <Text style={{ marginVertical: TEXTMARGINVERTICAL }}>
            Рейтинг: <Text style={{ color: "#ff6347" }}>{movie.rating}</Text>
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginVertical: TEXTMARGINVERTICAL }}>Жанры: </Text>
            {movie.genres ? <Genres genres={movie.genres} /> : null}
          </View>
          <Text style={{ marginVertical: TEXTMARGINVERTICAL }}>
            Режисер: {movie.directors ? movie.directors.join(", ") : null}
          </Text>
          <Text style={{ marginVertical: TEXTMARGINVERTICAL }}>
            Выпуск: {movie.releaseDate}
          </Text>
          <Text
            style={{ marginVertical: TEXTMARGINVERTICAL, textAlign: "justify" }}
          >
            Описание: {movie.description}
          </Text>
        </Card>

        <Movie token={token} movieInfo={movie} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.primary,
  },
  posterContainer: {
    width: "60%",
    alignItems: "center",
    padding: "3%",
    marginVertical: "5%",
    borderRadius: 24,
  },
  posterImage: {
    width: "100%",
    height: ITEM_SIZE,
    resizeMode: "cover",
    borderRadius: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: "5%",
  },
  movieContainer: {
    flex: 1,
    width: "100%",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  movieInfo: {
    width: width * (9 / 10),
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "5%",
  },
  favorite: {
    flex: 1,
    top: "3%",
    right: "5%",
    position: "absolute",
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRadius: 10,
  },
  appButtonText: {
    marginLeft: "2%",
    fontSize: 15,
    fontWeight: "400",
  },
});

export default MoviePage;
