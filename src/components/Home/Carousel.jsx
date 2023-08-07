import React from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import slide1 from '../../assets/img/carousel1.png';
import slide2 from '../../assets/img/carousel2.png';
import slide3 from '../../assets/img/carousel3.png';

const Carousel = () => {
    const slides = [slide1, slide2, slide3];
  
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
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
      <div className="carousel-container bg-primary-200 p-12 max-w-screen-lg mx-auto">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden"
              style={{ width: '100%', height: '250px' }}
            >
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </Slider>
      </div>
    );
  };
  
  export default Carousel;
