import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import slide1 from "../../assets/img/carousel1.png";
import slide2 from "../../assets/img/carousel2.png";
import slide3 from "../../assets/img/carousel3.png";

const Carousel = () => {
  const slides = [slide1, slide2, slide3];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="carousel-containe bg-white  border-4 border-secondary-300 mx-10 m-8 rounded-xl animate-fade animate-once animate-duration-[800ms] animate-delay-0">
      <Slider {...settings} className="">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden"
            style={{ width: "100%", height: "250px" }}
          >
            <img
              src={slide}
              alt={`Slide ${index + 1}`}
              className="w-50% h-50% object-cover mx-auto"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
