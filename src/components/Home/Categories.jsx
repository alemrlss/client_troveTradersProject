import { Link } from "react-router-dom";
import imgCategory from "../../assets/img/categories/1.jpg";
import imgCategory2 from "../../assets/img/categories/2.jpg";
import imgCategory3 from "../../assets/img/categories/3.jpg";
import imgCategory4 from "../../assets/img/categories/4.jpeg";
import imgCategory5 from "../../assets/img/categories/5.jpg";
import imgCategory6 from "../../assets/img/categories/6.jpeg";
import imgCategory7 from "../../assets/img/categories/7.jpeg";
import imgCategory8 from "../../assets/img/categories/8.jpeg";
import imgCategory9 from "../../assets/img/categories/9.png";

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

export default function Categories() {
  return (
    <div className="">
      fff
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <div className="mx-auto py-4 lg:py-4">
          <h2 className="text-2xl font-bold text-gray-900">Categorias</h2>

          <div className="grid-cols-4 mt-6 grid lg:grid-cols-4 gap-x-6">
            {callouts.map((callout) => (
              <a href={callout.href} key={callout.id}>
                <div className="mx-0 my-0">
                  <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 shadow-2xl">
                    <img
                      src={callout.imageSrc}
                      alt={callout.imageAlt}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <p className="text-sm font-semibold justify-center mb-4">
                    {callout.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
