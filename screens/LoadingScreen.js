import { Component, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Image,
  InteractionManager,
} from "react-native";
import { generateTextShadow } from "../src/utils/ThreeUtils";
import { ClipLoader } from "react-spinners";
const Loading = () => {
  const textShadow = generateTextShadow(4);
  const animation = new Animated.Value(0);
  const animatedImageStyle = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
  };

  useEffect(() => {
    InteractionManager.runAfterInteractions((_) => {
      Animated.timing(animation, {
        useNativeDriver: true,
        toValue: 1,
        duration: 300,
        delay: 0,
      }).start();
    });
  }, []);

  return (
    <View style={loadingStyles.container}>
      <Text style={[loadingStyles.text, textShadow]}>Crossy Road</Text>
      <Animated.Image
        source={require("../assets/images/loading.png")}
        style={[loadingStyles.image, animatedImageStyle]}
      ></Animated.Image>

      <ClipLoader color={"white"} loading={true} size={150} />
    </View>
  );
};

const LoadingScreen = ({ isLoading }) => {
  return isLoading && <Loading />;
};

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#58c2e9",
    width: "100%",
    height: "100%",
  },
  text: {
    color: "white",
    fontFamily: "retro",
    fontSize: 48,
    backgroundColor: "transparent",
  },

  image: {
    resizeMode: "contain",
    maxWidth: 600,
    width: "100%",
    height: 500,
  },
});

export default LoadingScreen;
