import { Component } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Platform,
  Vibration,
  View,
  useColorScheme,
} from "react-native";

class Loading extends Component {
  render() {
    return (
      <View style={loadingStyles.container}>
        <p>Loading...</p>
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
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  text: {
    color: "#fff",
    fontSize: 20,
  },
});

export default LoadingScreen;
