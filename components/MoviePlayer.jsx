import React, { useState } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Dimensions, Modal } from "react-native";
import { Video } from "expo-av";
import VideoPlayer from "expo-video-player";
import * as ScreenOrientation from "expo-screen-orientation";

import Card from "./Card";

const { width, height } = Dimensions.get("window");

const MoviePlayer = ({ uri }) => {
  const [fullscreen, setFullscreen] = useState(false);

  const video = () => (
    <VideoPlayer
      videoProps={{
        shouldPlay: false,
        resizeMode: Video.RESIZE_MODE_CONTAIN,
        source: uri,
      }}
      inFullscreen={fullscreen}
      switchToPortrait={() => {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
        setFullscreen(false);
      }}
      switchToLandscape={() => {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
        setFullscreen(true);
      }}
      showControlsOnLoad
      width={fullscreen ? styles.fullscreenVideo.width : styles.video.width}
      height={fullscreen ? styles.fullscreenVideo.height : styles.video.height}
      videoBackground="#000"
    />
  );

  if (!fullscreen) {
    return (
      <View style={styles.videoContainer}>
        <Card style={styles.video}>{video()}</Card>
      </View>
    );
  }
  return (
    <Modal
      style={styles.fullscreenVideo}
      supportedOrientations={["portrait", "landscape"]}
      statusBarTranslucent
    >
      {video()}
    </Modal>
  );
};

MoviePlayer.propTypes = {
  uri: PropTypes.objectOf(PropTypes.any).isRequired,
};

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    width: "100%",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    height: width * (9 / 16),
    width: width * (9 / 10),
    overflow: "hidden",
    backgroundColor: "#000",
  },
  fullscreenVideo: {
    height: width,
    width: height,
    backgroundColor: "#000",
  },
});

export default MoviePlayer;
