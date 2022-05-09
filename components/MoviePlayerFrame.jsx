import React, { useState, useEffect } from "react";
import { Text, StyleSheet, Dimensions, View } from "react-native";
import PropTypes from "prop-types";
import RNPickerSelect from "react-native-picker-select";

import Card from "./Card";
import { getVideoPath, addToHistory } from "../api";
import MoviePlayer from "./MoviePlayer";

const { width } = Dimensions.get("window");

const MoviePlayerFrame = ({ token, movieInfo }) => {
  const [season, setSeason] = useState("1");
  const [episode, setEpisode] = useState("1");
  const [seasonsList, setSeasonsList] = useState([]);
  const [episodesList, setEpisodesList] = useState([]);
  const [playButtonPressed, setPlayButtonPressed] = useState(false);

  const updateLists = (curSeason) => {
    if (movieInfo.seasons) {
      const result1 = [];
      for (let i = 2; i < movieInfo.seasons.length; i += 1) {
        result1.push({ label: i.toString(), value: i.toString() });
      }
      setSeasonsList(result1);

      const result2 = [];
      for (let i = 2; i <= movieInfo.seasons[curSeason]; i += 1) {
        result2.push({
          label: i.toString(),
          value: i.toString(),
        });
      }
      setEpisodesList(result2);
    }
  };

  useEffect(() => {
    updateLists(season);
  }, [movieInfo]);

  const onChange = (curSeason, curEpisode) => {
    if (curSeason !== season) {
      updateLists(curSeason);
      setSeason(curSeason);
      setEpisode("1");
    } else {
      setEpisode(curEpisode);
    }
  };

  const moviePlayerHandler = (status) => {
    if (status.isPlaying !== playButtonPressed) {
      setPlayButtonPressed(status.isPlaying);

      if (status.isPlaying) addToHistory(token, movieInfo.key);
    }
  };

  return (
    <View>
      {movieInfo.key ? (
        <Card style={styles.videoPlayerContainer}>
          <MoviePlayer
            uri={getVideoPath(
              token,
              movieInfo.key,
              movieInfo.seasons.length !== 0 ? season : null,
              movieInfo.seasons.length !== 0 ? episode : null
            )}
            playbackCallback={moviePlayerHandler}
          />
          {movieInfo.seasons.length !== 0 ? (
            <View style={styles.pickersContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Сезон:</Text>
                <RNPickerSelect
                  items={[{ label: "1", value: "1" }, ...seasonsList]}
                  selectedValue={season}
                  placeholder={{}}
                  useNativeAndroidPickerStyle={false}
                  style={pickerStyle}
                  onValueChange={(item) => {
                    onChange(item, episode);
                  }}
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.text}>Серия:</Text>
                <RNPickerSelect
                  items={[{ label: "1", value: "1" }, ...episodesList]}
                  selectedValue={episode}
                  placeholder={{}}
                  useNativeAndroidPickerStyle={false}
                  style={pickerStyle}
                  onValueChange={(item) => {
                    onChange(season, item);
                  }}
                />
              </View>
            </View>
          ) : null}
        </Card>
      ) : null}
    </View>
  );
};

MoviePlayerFrame.propTypes = {
  token: PropTypes.string.isRequired,
  movieInfo: PropTypes.objectOf(PropTypes.any).isRequired,
};

const styles = StyleSheet.create({
  videoPlayerContainer: {
    marginVertical: "5%",
    width: width * (9 / 10),
  },
  pickersContainer: {
    marginVertical: "2%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  textContainer: { flexDirection: "row", alignItems: "center" },
  text: { marginRight: "8%", color: "black" },
});

const pickerStyle = StyleSheet.create({
  inputIOS: {
    textAlign: "center",
    paddingVertical: "3%",
    paddingHorizontal: "4%",
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

export default MoviePlayerFrame;
