import imgCategory from "../../assets/img/categories/1.jpg";
import imgCategory2 from "../../assets/img/categories/2.jpg";
import imgCategory3 from "../../assets/img/categories/3.jpg";
import imgCategory4 from "../../assets/img/categories/4.jpeg";
import imgCategory5 from "../../assets/img/categories/5.jpg";
import imgCategory6 from "../../assets/img/categories/6.jpeg";
import imgCategory7 from "../../assets/img/categories/7.jpeg";
import imgCategory8 from "../../assets/img/categories/8.jpeg";
import Slider from "react-slick";
import { Tooltip } from "react-tooltip";
import { useRef, useEffect } from "react";

const callouts = [
  {
    id: 1,
    description: "Antiguedades",
    imageSrc: imgCategory,
    imageAlt: "",
    href: "categoria/antiguedades",
  },
  {
    id: 2,
    description: "Musica",
    imageSrc: imgCategory2,
    imageAlt: "",
    href: "categoria/musica",
  },
  {
    id: 3,
    description: "Cartas",
    imageSrc: imgCategory3,
    imageAlt: "",
    href: "categoria/cartas",
  },
  {
    id: 4,
    description: "Tecnologia",
    imageSrc: imgCategory4,
    imageAlt: "",
    href: "categoria/tecnologia",
  },
  {
    id: 5,
    description: "Comics",
    imageSrc: imgCategory5,
    imageAlt: "",
    href: "categoria/comics",
  },
  {
    id: 6,
    description: "Juguetes",
    imageSrc: imgCategory6,
    imageAlt: "",
    href: "categoria/juguetes",
  },
  {
    id: 7,
    description: "Deporte",
    imageSrc: imgCategory7,
    imageAlt: "",
    href: "categoria/deporte",
  },
  {
    id: 8,
    description: "Libros",
    imageSrc: imgCategory8,
    imageAlt: "",
    href: "categoria/libros",
  },
  /*{
    id: 9,
    description:'Zapatos',
    imageSrc: imgCategory9,
    imageAlt: '',
    href: 'categoria/zapatos', 
  }*/
];
const Categories = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    console.log(sliderRef);
    if (sliderRef.current) {
      // Comienza el carrusel tan pronto como cargue la página
    }
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    speed: 8000,
    autoplaySpeed: 8000,
    cssEase: "linear",
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  return (
    <div className="">
      <h2 className="text-3xl font-bold mx-28 mb-3">Categorias</h2>
      <div className="py-4 space-y-10 bg-orange-40">
        <Slider {...settings} ref={sliderRef}>
          {callouts.map((callout) => (
            <div
              data-tooltip-id="my-tooltip-category"
              data-tooltip-content={callout.description}
              key={callout.id}
              className="hover:opacity-80 px-4"
            >
              <a href={callout.href}>
                <div className="overflow-hidden flex justify-center shadow-lg">
                  <img
                    src={callout.imageSrc}
                    alt={callout.imageAlt}
                    className="w-52 h-60 rounded-lg"
                  />
                </div>
              </a>
            </div>
          ))}
        </Slider>
      </div>
      <Tooltip
        id="my-tooltip-category"
        style={{
          backgroundColor: "rgba(209, 207, 207, 0.7)",
          color: "#000000",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      />
    </div>
  );
};

export default Categories;
