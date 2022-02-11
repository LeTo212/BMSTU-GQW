import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
  Platform,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { AuthContext } from "../constants/context";
import { getMovies } from "../api";
import CustomStatusBar from "../components/CustomStatusBar";
import Loading from "../components/Loading";
import Genres from "../components/Genres";
import Rating from "../components/Rating";
import Colors from "../constants/colors";
import Card from "../components/Card";

const { width, height } = Dimensions.get("window");
const SPACING = 10;
const ITEM_SIZE = Platform.OS === "ios" ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;

const Backdrop = ({ movies, scrollX }) => {
  return (
    <View style={{ height: BACKDROP_HEIGHT, width, position: "absolute" }}>
      <FlatList
        data={movies}
        keyExtractor={item => item.key + "-backdrop"}
        horizontal
        removeClippedSubviews={false}
        contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
        renderItem={({ item, index }) => {
          if (!item.backdrop) {
            return null;
          }
          const translateX = scrollX.interpolate({
            inputRange: [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE],
            outputRange: [0, width],
            // extrapolate:'clamp'
          });
          return (
            <Animated.View
              removeClippedSubviews={false}
              style={{
                position: "absolute",
                width: translateX,
                height,
                overflow: "hidden",
              }}
            >
              <Image
                source={{ uri: item.backdrop }}
                style={{
                  width,
                  height: BACKDROP_HEIGHT,
                  position: "absolute",
                }}
              />
            </Animated.View>
          );
        }}
      />
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", styles.screen.backgroundColor]}
        style={{
          height: BACKDROP_HEIGHT,
          width,
          position: "absolute",
          bottom: 0,
        }}
      />
    </View>
  );
};

const Home = ({ navigation }) => {
  const [token, setToken] = useState();
  const { getToken, signOut } = React.useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState({});
  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 1,
  });
  const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
    viewableItems[1] ? setCurrentMovie(viewableItems[1].item) : null;
  });
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getToken().then(data => {
      setToken(data);
    });

    const fetchData = async () => {
      const movies = await getMovies(token);

      if (movies != null) {
        if (movies.statusCode === 401) {
          signOut();
          return;
        }

        const filtered = movies.data.filter(el => {
          return parseFloat(el.rating) >= 8.7;
        });

        setMovies([{ key: "empty-left" }, ...filtered, { key: "empty-right" }]);
        setCurrentMovie(filtered[0]);
      }
    };

    if (movies.length === 0 || token == null) {
      fetchData(movies);
    }
  }, [movies, token]);

  if (movies.length === 0 || token == null) {
    return <Loading />;
  }

  return (
    <>
      <CustomStatusBar
        backgroundColor={Colors.secondary}
        barStyle="dark-content"
      />
      <View style={styles.screen}>
        <Backdrop movies={movies} scrollX={scrollX} />
        <Animated.FlatList
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewConfigRef.current}
          showsHorizontalScrollIndicator={false}
          data={movies}
          keyExtractor={item => item.key}
          horizontal
          bounces={false}
          decelerationRate={Platform.OS === "ios" ? 0 : 0.98}
          renderToHardwareTextureAndroid
          contentContainerStyle={{ alignItems: "center" }}
          snapToInterval={ITEM_SIZE}
          snapToAlignment="start"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => {
            if (!item.poster) {
              return <View style={{ width: EMPTY_ITEM_SIZE }} />;
            }

            const inputRange = [
              (index - 2) * ITEM_SIZE,
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
            ];

            const translateY = scrollX.interpolate({
              inputRange,
              outputRange: [100, 50, 100],
              extrapolate: "clamp",
            });

            return (
              <View style={styles.moviesCarouselContainer}>
                <TouchableOpacity
                  activeOpacity={0.4}
                  onPress={() =>
                    navigation.navigate("Movie", {
                      token: token,
                      movie: currentMovie,
                    })
                  }
                >
                  <Animated.View style={{ transform: [{ translateY }] }}>
                    <Card style={styles.poster}>
                      <Image
                        source={{ uri: item.poster }}
                        style={styles.posterImage}
                      />
                      <Text
                        style={{ fontSize: item.title.length > 20 ? 20 : 24 }}
                        numberOfLines={3}
                      >
                        {item.title}
                      </Text>
                      <Rating rating={item.rating} />
                      <Genres genres={item.genres} />
                    </Card>
                  </Animated.View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  moviesCarouselContainer: {
    width: ITEM_SIZE,
    height: height,
    justifyContent: "center",
  },
  poster: {
    marginHorizontal: SPACING,
    padding: SPACING * 2,
    alignItems: "center",
  },
  posterImage: {
    width: "100%",
    height: ITEM_SIZE * 1.2,
    resizeMode: "cover",
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
});

export default Home;
