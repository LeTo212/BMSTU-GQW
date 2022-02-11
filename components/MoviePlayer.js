import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Modal, StatusBar } from "react-native";
import { Video } from "expo-av";
import VideoPlayer from "expo-video-player";
import * as ScreenOrientation from "expo-screen-orientation";

import Card from "../components/Card";

const { width, height } = Dimensions.get("window");

const MoviePlayer = props => {
  const [fullscreen, setFullscreen] = useState(false);

  const video = () => {
    return (
      <VideoPlayer
        videoProps={{
          shouldPlay: false,
          resizeMode: Video.RESIZE_MODE_CONTAIN,
          source: props.uri,
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
        showControlsOnLoad={true}
        width={fullscreen ? styles.fullscreenVideo.width : styles.video.width}
        height={
          fullscreen ? styles.fullscreenVideo.height : styles.video.height
        }
        videoBackground="#000"
      />
    );
  };

  if (!fullscreen) {
    return (
      <View style={styles.videoContainer}>
        <Card style={styles.video}>{video()}</Card>
      </View>
    );
  } else {
    return (
      <>
        <StatusBar backgroundColor={"black"} />
        <Modal
          style={styles.fullscreenVideo}
          supportedOrientations={["portrait", "landscape"]}
        >
          {video()}
        </Modal>
      </>
    );
  }
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
