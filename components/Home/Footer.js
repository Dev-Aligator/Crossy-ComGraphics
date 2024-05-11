import React, { Component } from "react";
import { LayoutAnimation, Animated, StyleSheet, View } from "react-native";

import Images from "../../src/Images";
import Button from "../Button";
import CharacterPicker from "../CharacterPicker";
import { Dimensions } from "react-native";

const imageStyle = { width: 80, height: 56 };

export default function Footer(props) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const collapse = React.useCallback(
    (onPress) => () => {
      setMenuOpen(false);
      onPress();
    },
    [setMenuOpen]
  );

  const renderMenu = React.useMemo(() => {
    return (
      <View style={{ flexDirection: "column" }}>
        <Button
          onPress={collapse(props.onMultiplayer)}
          style={[{ marginBottom: 8 }, imageStyle]}
          imageStyle={imageStyle}
          source={Images.button.controller}
        />
        <Button
          onPress={collapse(props.onShop)}
          style={[{ marginBottom: 8 }, imageStyle]}
          imageStyle={imageStyle}
          source={Images.button.shop}
        />
        <Button
          onPress={collapse(props.onCamera)}
          style={[{ marginBottom: 8 }, imageStyle]}
          imageStyle={imageStyle}
          source={Images.button.camera}
        />
      </View>
    );
  }, [collapse]);

  const [screenWidth, setScreenWidth] = React.useState(
    Dimensions.get("window").width
  );

  const handleResize = () => {
    setScreenWidth(Dimensions.get("window").width);
  };

  React.useEffect(() => {
    Dimensions.addEventListener("change", handleResize);
    return () => {
      Dimensions.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <Animated.View style={[styles.container, props.style]}>
      {screenWidth < 700 ? (
        <CharacterPicker></CharacterPicker>
      ) : (
        <Button
          style={{ maxHeight: 56 }}
          onPress={() => {
            props.setOpenCarousel(!props.openCarousel);
          }}
          imageStyle={[imageStyle, { aspectRatio: 1.25 }]}
          source={Images.button.character}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    justifyContent: "center",
    flexDirection: "row",
    // maxHeight: 48,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e",
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
