import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function resultadosComponent({ posts }) {
  const [dataPosts] = useState(posts);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  //Filtro, de momento solo nombre y descripcion
  const filtradoPosts = dataPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      {/* Contenedor de Productos */}
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 h-screen">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Resultados de la busqueda de: {query}
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 bg-white">
          {filtradoPosts.map((post) => (
            <div
              key={post._id}
              className={`bg-white shadow rounded p-6 m-2 animate-fade animate-once animate-duration-[2000ms] animate-delay-100`}
            >
              <div className="">
                {/* Imágenes del post */}
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  {post.photos.slice(0, 1).map((photo, index) => (
                    <img
                      key={index}
                      src={`http://localhost:3001/images/posts/${photo}`}
                      alt={`Foto ${index + 1}`}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  ))}
                </div>
                {/* Datos de cada publicación */}
                <h3 className="text-sm text-gray-700">{post.title}</h3>
                <p className="text-gray-600">{post.description}</p>

                {/* Información del precio */}
                <p className="text-green-600 font-bold mt-2">
                  Precio: {post.price} $
                </p>

                {/* Fecha de creación */}
                <p className="text-gray-400 mt-2">
                  Creado: {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              {/* Botón de "Más información" */}
              <Link to={`/post/${post._id}`} className="block mt-4 text-center">
                <button className="bg-secondary-100 hover:bg-secondary-200 text-white font-bold py-2 px-4 rounded">
                  Más información
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
    </div>
  );
}

export default resultadosComponent;
