import { Component } from "react";
import { StyleSheet, View, Text, Animated } from "react-native";
import { generateTextShadow } from "../src/utils/ThreeUtils";
import { ClipLoader } from "react-spinners";
class Loading extends Component {
  textShadow = generateTextShadow(4);
  render() {
    return (
      <View style={loadingStyles.container}>
        <Text style={[loadingStyles.text, this.textShadow]}>Crossy Road</Text>
        <Animated.Image
          source={require("../assets/images/loading.png")}
          style={loadingStyles.image}
        ></Animated.Image>

        <ClipLoader color={"white"} loading={true} size={150} />
      </View>
    );
  }
}

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
