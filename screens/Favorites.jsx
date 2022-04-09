import React, { useState, useEffect } from "react";
import { FlatList, RefreshControl, TouchableOpacity } from "react-native";

import { getMovies, getFavorites } from "../api";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import MovieListItem from "../components/MovieListItem";
import Colors from "../constants/colors";

const wait = (timeout) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

const Favorites = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const { getToken } = React.useContext(AuthContext);
  const { signOut } = React.useContext(AuthContext);

  const fetchData = async () => {
    const favorites = await getFavorites(token);
    if (favorites !== "Not authorized") {
      setUserFavorites(
        favorites.sort((a, b) => new Date(b.Date) - new Date(a.Date))
      );
    } else signOut();
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

    const fetchMovies = async () => {
      const mvs = await getMovies(token);
      if (mvs !== "Not authorized") {
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

  if (movies.length === 0 || !token) {
    return <Loading />;
  }

  return (
    <FlatList
      style={{ width: "100%", height: "100%" }}
      contentContainerStyle={{ alignItems: "center", paddingTop: "5%" }}
      data={(() => {
        const tmp = [];
        userFavorites.forEach((el) =>
          movies.find((x) => (el.MovieID === x.key ? tmp.push(x) : null))
        );
        return tmp;
      })()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
          colors={[Colors.primary, Colors.secondary]}
        />
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
      ListEmptyComponent={() => <NotFound>Empty</NotFound>}
    />
  );
};

export default Favorites;
