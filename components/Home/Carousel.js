import { Swiper, SwiperSlide } from "swiper/react";
import React from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../styles/index.css";
import Images from "../../src/Images";
import { StyleSheet } from "react-native";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import Button from "../Button";
import ActionAreaCard from "../ActionAreaCard";
import Characters from "../../src/Characters";
import GameContext from "../../context/GameContext";

// import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

const Carousel = (props) => {
  const characterMap = {
    0: "bacon",
    1: "brent",
    2: "avocoder",
    3: "wheeler",
    4: "palmer",
    5: "juwan",
    6: "cser",
  };

  const getCharacterIndex = (name) => {
    const index = Object.values(characterMap).indexOf(name);
    return index !== -1 ? index : null;
  };

  const imageStyle = { width: 80, height: 56 };
  const [swiperIndex, setSwiperIndex] = React.useState(0);
  const { setCharacter, character } = React.useContext(GameContext);

  return (
    <div className="flex-container-carousel">
      <div className="relative-top-50px">
        <img width={"100%"} src={Images.banner}></img>
      </div>
      <div className="main-carousel-container">
        <Swiper
          onRealIndexChange={(swiperCore) => {
            setSwiperIndex(swiperCore.realIndex);
          }}
          initialSlide={getCharacterIndex(character)}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
            // clickable: true,
          }}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="swiper_container"
        >
          {Object.keys(Characters).map((index) => (
            <SwiperSlide key={index} className="swiper-element">
              <ActionAreaCard
                image={Characters[index].image}
                name={Characters[index].name}
                description={Characters[index].description}
              ></ActionAreaCard>
            </SwiperSlide>
          ))}

          <div className="slider-controler">
            <div className="swiper-button-prev slider-arrow">
              <Button
                style={{ maxHeight: 56 }}
                imageStyle={[imageStyle, { aspectRatio: 1.25 }]}
                source={Images.button.left_button}
              />
            </div>

            <div className="swiper-button-next slider-arrow">
              <Button
                style={{ maxHeight: 56 }}
                imageStyle={[imageStyle, { aspectRatio: 1.25 }]}
                source={Images.button.right_button}
              />
            </div>
            <div className="swiper-button-confirm-selection">
              <Button
                onPress={() => {
                  setCharacter(Characters[characterMap[swiperIndex]].id);
                  props.setOpenCarousel(false);
                }}
                style={{ maxHeight: 56 }}
                imageStyle={{
                  height: "150px",
                  width: "125px",
                  aspectRatio: 1.25,
                }}
                source={Images.button.select_button}
              />
            </div>
          </div>
        </Swiper>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: "640px",
    padding: "4rem 1rem",
    margin: "0 auto",
  },
  swiper: {
    height: "640px",
    padding: "2rem 0",
    position: "relative",
  },

  slider: {
    width: "400px",
    height: "42rem",
    position: "relative",
  },

  image: {
    width: "420px",
    height: "600px",
    borderRadius: "2rem",
    objectFit: "cover",
  },
});

export default Carousel;
