import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Loading from "../components/Loading";

import { getMovies, getFavorites } from "../api";
import AuthContext from "../constants/context";
import Card from "../components/Card";
import MovieListItem from "../components/MovieListItem";

const source = require("../assets/userIcon.png");

const wait = (timeout) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

const Profile = ({ navigation }) => {
  const [user, setUser] = useState();
  const [movies, setMovies] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [token, setToken] = useState();
  const { getToken } = React.useContext(AuthContext);
  const { getUser, signOut } = React.useContext(AuthContext);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchData = async () => {
    const favorites = await getFavorites(token);
    if (favorites != null) setUserFavorites(favorites);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
    wait(2000).then(() => setRefreshing(false));
  }, [userFavorites]);

  useEffect(() => {
    getToken().then((data) => {
      if (!data) {
        signOut();
        return;
      }

      setToken(data);
    });

    getUser().then((data) => {
      setUser(data);
    });

    const fetchMovies = async () => {
      const mvs = await getMovies(token);
      if (mvs !== "Error") {
        setMovies(mvs);
      } else signOut();
    };

    if (userFavorites.length === 0 && token) {
      fetchData();
    }

    if (movies.length === 0 && token) {
      fetchMovies();
    }
  }, [movies, token]);

  if (movies.length === 0 || !token || !user) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Card style={styles.profile}>
        <Image
          source={source}
          style={{
            width: 100,
            height: 100,
            marginHorizontal: "5%",
            position: "relative",
          }}
        />
        {user ? (
          <View style={styles.info}>
            <Text style={styles.text}>Имя: {user.firstname}</Text>
            {user.middlename ? (
              <Text style={styles.text}>Отчество: {user.middlename}</Text>
            ) : null}
            <Text style={styles.text}>Фамилия: {user.surname}</Text>
            <Text style={styles.text}>Почта: {user.email}</Text>
          </View>
        ) : null}

        <View style={styles.signOut}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              signOut();
            }}
          >
            <Text style={{ ...styles.text, marginRight: "3%" }}>Выйти</Text>
            <MaterialCommunityIcons name="logout" size={20} />
          </TouchableOpacity>
        </View>
      </Card>

      <View style={{ margin: "5%", borderBottomWidth: 1, marginBottom: 0 }}>
        <Text
          style={{ fontSize: 20, fontWeight: "800", paddingVertical: "1%" }}
        >
          Избранное
        </Text>
      </View>

      <FlatList
        style={{ width: "100%", height: "100%" }}
        contentContainerStyle={{ alignItems: "center", paddingTop: "5%" }}
        data={movies.filter((x) =>
          userFavorites
            ? userFavorites.find((el) => el.MovieID === x.key)
            : null
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={(movie) => (
          <TouchableOpacity
            activeOpacity={0.4}
            onPress={() =>
              navigation.navigate("Movie", { token, movie: movie.item })
            }
          >
            <MovieListItem key={movie.key} movie={movie.item} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profile: {
    height: 200,
    marginVertical: "2%",
    marginHorizontal: "5%",
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    flexDirection: "column",
    height: 100,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
  signOut: {
    flex: 1,
    position: "absolute",
    height: "100%",
    width: "100%",
    padding: "5%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
});

export default Profile;
