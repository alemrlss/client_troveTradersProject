import imgCategory from "../../assets/img/categories/1.jpg";
import imgCategory2 from "../../assets/img/categories/2.jpg";
import imgCategory3 from "../../assets/img/categories/3.jpg";
import imgCategory4 from "../../assets/img/categories/4.jpg";
import imgCategory5 from "../../assets/img/categories/5.jpg";
import imgCategory6 from "../../assets/img/categories/6.jpg";
import imgCategory7 from "../../assets/img/categories/7.jpeg";
import imgCategory8 from "../../assets/img/categories/8.jpg";

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
];

export default function Categories() {
  return (
    <marquee className="">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl py-4 sm:py-4 lg:max-w-none lg:py-4">
          <h2 className="text-2xl font-bold text-gray-900">Categorias</h2>

          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-8 lg:gap-x-6 lg:space-y-0 sm:grid-cols-2">
            {callouts.map((callout) => (
              <div key={callout.id} className="group relative">
                <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                  <img
                    src={callout.imageSrc}
                    alt={callout.imageAlt}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <h3 className="mt-6 text-sm text-gray-500">
                  <a href={callout.href}>
                    <span className="absolute inset-0" />
                    {callout.name}
                  </a>
                </h3>
                <p className="text-base font-semibold text-gray-900">
                  {callout.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </marquee>
  );
}
