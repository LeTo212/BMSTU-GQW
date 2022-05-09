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
import RNPickerSelect from "react-native-picker-select";
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

      if (mvs !== "Error") {
        const lst = await getTypesAndGenres();

        const tmp = {
          types: lst.Types.map((item) => ({ label: item, value: item })),
          genres: lst.Genres.map((item) => ({ label: item, value: item })),
        };

        setList(tmp);
        setMovies(mvs);
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
    <>
      <SafeAreaView style={styles.header} edges={["right", "left", "top"]}>
        <Searchbar
          placeholder="Поиск"
          onChangeText={(query) => {
            setSearchQuery(query);
            handler(query, type, genre);
          }}
          value={searchQuery}
          style={
            Platform.OS === "ios"
              ? styles.searchbarIOS
              : styles.searchbarAndroid
          }
        />

        <View style={styles.dropDownPickersContainer}>
          <View style={styles.container}>
            <Text style={styles.text}>Тип:</Text>
            <RNPickerSelect
              items={[{ label: "Любые", value: "" }, ...list.types]}
              selectedValue={type}
              placeholder={{}}
              useNativeAndroidPickerStyle={false}
              style={pickerStyle}
              onValueChange={(item) => {
                setType(item);
                handler(searchQuery, item, genre);
              }}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.text}>Жанр:</Text>
            <RNPickerSelect
              items={[{ label: "Любые", value: "" }, ...list.genres]}
              selectedValue={genre}
              placeholder={{}}
              useNativeAndroidPickerStyle={false}
              style={pickerStyle}
              onValueChange={(item) => {
                setGenre(item);
                handler(searchQuery, type, item);
              }}
            />
          </View>
        </View>
      </SafeAreaView>

      <FlatList
        style={styles.list}
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
        ListEmptyComponent={() => <NotFound>Пусто</NotFound>}
      />

      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", Colors.primary]}
        style={styles.backgroundLinearGradient}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.background,
    zIndex: 100,
  },
  searchbarAndroid: {
    marginTop: "3%",
    marginHorizontal: "5%",
    shadowOpacity: 0.1,
    backgroundColor: Colors.background,
  },
  searchbarIOS: {
    marginTop: 0,
    marginHorizontal: "5%",
    borderColor: Colors.secondary,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRadius: 3,
    backgroundColor: Colors.background,
  },
  dropDownPickersContainer: {
    marginVertical: "2%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  container: { flexDirection: "row", alignItems: "center" },
  text: { marginRight: "8%" },
  list: {
    width: "100%",
    height: "100%",
  },
  backgroundLinearGradient: {
    height: height / 3,
    width,
    position: "absolute",
    bottom: 0,
    zIndex: -100,
  },
});

const pickerStyle = StyleSheet.create({
  inputIOS: {
    textAlign: "center",
    paddingVertical: "2%",
    paddingHorizontal: "2%",
    borderWidth: 1,
    borderRadius: 8,
    color: "black",
  },
  inputAndroid: {
    textAlign: "center",
    paddingHorizontal: "2%",
    paddingVertical: "1%",
    borderWidth: 1,
    borderRadius: 8,
    color: "black",
  },
});

export default Search;
