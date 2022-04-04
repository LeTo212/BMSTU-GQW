import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  View,
  Text,
  Platform,
} from "react-native";
import { Searchbar } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { debounce } from "lodash";
import Fuse from "fuse.js";

import { getMovies, getTypesAndGenres } from "../api";
import AuthContext from "../constants/context";
import moviesSearchConfig from "../constants/moviesSearchConfig";
import Loading from "../components/Loading";
import MovieListItem from "../components/MovieListItem";
import NotFound from "../components/NotFound";
import Colors from "../constants/colors";

const { width, height } = Dimensions.get("window");

const Search = ({ navigation }) => {
  const [token, setToken] = useState();
  const { getToken, signOut } = React.useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [list, setList] = useState({});
  const [type, setType] = useState("");
  const [genre, setGenre] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    getToken().then((data) => {
      if (!data) {
        signOut();
        return;
      }

      setToken(data);
    });

    const fetchData = async () => {
      const mvs = await getMovies(token);

      if (mvs !== "Not authorized") {
        const lst = await getTypesAndGenres();

        setMovies(mvs);
        setList(lst);
        setSearchResult(mvs);
      } else signOut();
    };

    if ((movies.length === 0 || Object.keys(list).length === 0) && token) {
      fetchData(movies, list);
    }
  }, [movies, list, token]);

  const handler = useCallback(
    debounce(
      (query, filterType, filterGenre) =>
        onChangeSearch(query, filterType, filterGenre),
      500
    ),
    [movies]
  );

  const onChangeSearch = (query, filterType, filterGenre) => {
    const filteredMovies = movies.filter(
      (movie) =>
        movie.type.includes(filterType) &&
        (filterGenre === "" ? true : movie.genres.includes(filterGenre))
    );

    if (query.length === 0) {
      setSearchResult(filteredMovies);
    } else {
      setSearchResult(
        new Fuse(filteredMovies, moviesSearchConfig)
          .search(query)
          .map((mv) => mv.item)
      );
    }
  };

  if (movies.length === 0 || Object.keys(list).length === 0) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", Colors.primary]}
        style={{
          height: height / 3,
          width,
          position: "absolute",
          bottom: 0,
        }}
      />

      <Searchbar
        placeholder="Поиск"
        onChangeText={(query) => {
          setSearchQuery(query);
          handler(query, type, genre);
        }}
        value={searchQuery}
        style={
          Platform.OS === "ios" ? styles.searchbarIOS : styles.searchbarAndroid
        }
      />

      <View
        style={
          Platform.OS === "android"
            ? styles.dropDownPickersContainerAndroid
            : styles.dropDownPickersContainerIOS
        }
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ marginRight: "2%" }}>Тип</Text>
          <DropDownPicker
            items={list.types}
            defaultValue={type}
            containerStyle={{ height: 40, width: 110 }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            onChangeItem={(item) => {
              setType(item.value);
              handler(searchQuery, item.value, genre);
            }}
          />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ marginRight: "2%" }}>Жанр</Text>
          <DropDownPicker
            items={list.genres}
            defaultValue={genre}
            containerStyle={{ height: 40, width: 110 }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            onChangeItem={(item) => {
              setGenre(item.value);
              handler(searchQuery, type, item.value);
            }}
          />
        </View>
      </View>

      <FlatList
        style={{ width: "100%", height: "100%" }}
        contentContainerStyle={{ alignItems: "center", paddingTop: "5%" }}
        data={searchResult}
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
        ListEmptyComponent={() => <NotFound>Not Found</NotFound>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    height,
    width,
  },
  searchbarAndroid: {
    marginTop: "3%",
    marginHorizontal: "5%",
    shadowOpacity: 0.1,
  },
  searchbarIOS: {
    marginTop: 0,
    marginHorizontal: "5%",
    borderColor: "rgba(158, 150, 150, 0.5)",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRadius: 3,
  },
  dropDownPickersContainerAndroid: {
    marginVertical: "2%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  dropDownPickersContainerIOS: {
    marginVertical: "2%",
    width: "100%",
    zIndex: 100,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default Search;
