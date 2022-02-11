import React, { useState, useEffect } from "react";
import { Text, StyleSheet, Dimensions, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";

import Card from "../components/Card";
import { getVideoPath } from "../api";
import MoviePlayer from "../components/MoviePlayer";

const { width } = Dimensions.get("window");
const pickerStyle = {
  inputIOS: {
    color: "black",
    width: 30,
    height: 30,
    textAlign: "center",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRadius: 3,
    fontSize: 15,
    fontWeight: "400",
  },
  inputAndroid: {
    color: "black",
    width: 80,
    height: 30,
    fontWeight: "400",
  },
};

const Movie = ({ token, movieInfo }) => {
  const [season, setSeason] = useState("1");
  const [episode, setEpisode] = useState("1");
  const [seasonsList, setSeasonsList] = useState([]);
  const [episodesList, setEpisodesList] = useState([]);

  const updateLists = curSeason => {
    if (movieInfo.seasons) {
      const result1 = [];
      for (var i = 2; i < movieInfo.seasons.length; i++) {
        result1.push({ label: i.toString(), value: i.toString() });
      }
      setSeasonsList(result1);

      const result2 = [];
      for (var i = 2; i <= movieInfo.seasons[curSeason]; i++) {
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
    if (curSeason != season) {
      updateLists(curSeason);
      setSeason(curSeason);
      setEpisode("1");
    } else {
      setEpisode(curEpisode);
    }
  };

  return (
    <>
      {movieInfo.key ? (
        <Card style={styles.videoPlayerContainer}>
          <MoviePlayer
            uri={getVideoPath(
              token,
              movieInfo.key,
              movieInfo.seasons.length !== 0 ? season : null,
              movieInfo.seasons.length !== 0 ? episode : null
            )}
          />
          {movieInfo.seasons.length !== 0 ? (
            <View style={styles.pickersContainer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ marginRight: "5%" }}>Сезон</Text>
                <RNPickerSelect
                  items={[{ label: "1", value: "1" }, ...seasonsList]}
                  selectedValue={season}
                  placeholder={{}}
                  style={pickerStyle}
                  onValueChange={item => {
                    onChange(item, episode);
                  }}
                />
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ marginRight: "5%" }}>Серия</Text>
                <RNPickerSelect
                  items={[{ label: "1", value: "1" }, ...episodesList]}
                  selectedValue={episode}
                  placeholder={{}}
                  style={pickerStyle}
                  onValueChange={item => {
                    onChange(season, item);
                  }}
                />
              </View>
            </View>
          ) : (
            <></>
          )}
        </Card>
      ) : (
        <></>
      )}
    </>
  );
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
});

export default Movie;
