/* eslint-disable react-hooks/rules-of-hooks */
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
        <h2 className="text-2xl font-bold tracking-tight text-gray-800">
          Resultados de la busqueda de: {query}
        </h2>

        {filtradoPosts.length === 0 ? (
          // Mensaje cuando no hay resultados
          <div className="mt-6 text-center m7b">
            <p className="text-gray-600">
              No se encontraron resultados para tu búsqueda.
            </p>
            <Link to="/" className="mt-4">
              <button className="bg-secondary-100 hover:opacity-90 text-white mt-3 font-bold py-2 px-4 rounded">
                Ir al inicio
              </button>
            </Link>
          </div>
        ) : (
          // Lista de resultados cuando hay resultados
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 bg-white">
            {filtradoPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-xl overflow-hidden border border-secondary-100"
              >
                <div className="relative aspect-w-2 aspect-h-1">
                  <div className="absolute inset-0">
                    {post.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={`http://localhost:3001/images/posts/${photo}`}
                        alt={`Foto ${index + 1}`}
                        className={`object-cover w-full h-full ${
                          index === 0 ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Link
                      to={`/post/${post._id}`}
                      className="bg-secondary-100 hover:opacity-80 text-white font-semibold py-2 px-4 rounded-full"
                    >
                      Ver más
                    </Link>
                  </div>
                </div>
                <div className="p-4 border-t border-secondary-100">
                  <p className="text-gray-400 text-right text-xs mb-2">
                    Creado: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {post.title.slice(0, 35)}
                    {post.title.length > 35 && "..."}
                  </h3>
                  <p className="text-gray-600 mt-1 leading-5 text-xs">
                    {post.description.slice(0, 65)}
                    {post.description.length > 65 && "..."}
                  </p>
                  <p className="text-gray-900 font-bold mt-2 text-center">
                    Precio: {post.price}$
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
    </div>
  );
}

export default resultadosComponent;
