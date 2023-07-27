import imgCategory from "../../assets/img/63e8c4e754ac2e32897cb53b_tech-min.png";
import imgCategory2 from "../../assets/img/63e8c4e52d6553668075697e_hand bag-min.png";
import imgCategory3 from "../../assets/img/63e8c4e71eb4ad6d07e7568f_travel-min.png";
import imgCategory4 from "../../assets/img/63e8c4e754ac2e32897cb53b_tech-min.png";
import imgCategory5 from "../../assets/img/63e8c4e570738029a725e686_Furniture-min.png";

function Categories() {
  const categories = [
    {
      name: "Deporte",
      image: imgCategory,
    },
    {
      name: "Antigüedad",

      image: imgCategory2,
    },
    {
      name: "Música",
      image: imgCategory3,
    },
    {
      name: "Colección",

      image: imgCategory4,
    },
    {
      name: "Personal",
      image: imgCategory5,
    },
    {
      name: "Tecnología",

      image: imgCategory,
    },
  ];
  return (
    <div className="categories flex flex-col">
      <h5 className="text-3xl m-1 font-bold mb-4 text-center md:text-left sm:text-left">
        Categorias Principales
      </h5>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className="p-1 relative cursor-pointer animate-fade-right animate-once animate-duration-1000 animate-delay-0 animate-ease-in-out"
          >
            <div className="relative group rounded-xl overflow-hidden">
              <img src={category.image} className="w-full h-auto " alt="" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-white text-2xl font-bold">{category.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
