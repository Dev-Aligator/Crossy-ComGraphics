import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../styles/index.css";
import Images from "../../src/Images";
import { StyleSheet } from "react-native";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import Button from "../Button";
// import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

const Carousel = (props) => {
  const hotAnimeList = [
    {
      name: "Weathering With You",
      year: "2019",
      poster: Images.particle.fire,
    },
    {
      name: "Overlord",
      year: "2015",
      poster: Images.particle.fire,
    },
    {
      name: "That Time I Got Reincarnated as a Slime",
      year: "2018",
      poster: Images.particle.fire,
    },
    {
      name: "Mirai",
      year: "2018",
      poster: Images.particle.fire,
    },
  ];
  const imageStyle = { width: 80, height: 56 };

  return (
    <div className="flex-container-carousel">
      <div className="banner-carousel relative-top-50px">
        <p>SELECT YOUR CHARACTER</p>
      </div>
      <div className="main-carousel-container">
        <Swiper
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
          {hotAnimeList.map((anime, index) => (
            <SwiperSlide key={index}>
              <img src={anime.poster} alt={anime.name + anime.year} />
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
            <div className="swiper-button-confirm-selection banner-carousel">
              <p>SELECT</p>
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
