import React, { useState, useEffect } from "react";
import { FlatList, RefreshControl, TouchableOpacity } from "react-native";

import { getHistory } from "../api";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import MovieListItem from "../components/MovieListItem";
import Colors from "../constants/colors";

const wait = (timeout) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

const History = ({ navigation }) => {
  const [userHistory, setUserHistory] = useState(null);
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const { getToken } = React.useContext(AuthContext);
  const { signOut } = React.useContext(AuthContext);

  const fetchData = async () => {
    const hst = await getHistory(token);
    if (hst !== "Error") {
      setUserHistory(hst);
    } else signOut();
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
    wait(2000).then(() => setRefreshing(false));
  }, [userHistory]);

  useEffect(() => {
    getToken().then((data) => {
      if (!data) {
        signOut();
        return;
      }

      setToken(data);
    });

    if (userHistory === null && token) {
      fetchData();
    }
  }, [token]);

  if (userHistory === null || !token) {
    return <Loading />;
  }

  return (
    <FlatList
      style={{ width: "100%", height: "100%" }}
      contentContainerStyle={{ alignItems: "center", paddingTop: "5%" }}
      data={userHistory}
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
      ListEmptyComponent={() => <NotFound>Пусто</NotFound>}
    />
  );
};

export default History;
