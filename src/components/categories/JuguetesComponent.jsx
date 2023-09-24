/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { Link } from "react-router-dom";
import Barra from "../Home/Barra";

function antiguedadesComponent({ posts, user }) {
  const [dataPosts] = useState(posts);

  //Filtro
  const juguetesPosts = dataPosts.filter(
    (post) => post.category === "juguetes"
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(20);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const currentPosts = juguetesPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(juguetesPosts.length / postsPerPage);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div>
      <Barra />
      {/* Contenedor de Productos */}
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Juguetes
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 bg-white animate-fade animate-duration-[600ms]">
          {currentPosts.length === 0 ? (
            <div className="text-gray-800 text-center py-6 col-span-full">
              <p>No hay publicaciones para la categoría seleccionada.</p>
              <Link to={`/crear-publicacion`}>
                <button className="bg-secondary-100 text-white font-semibold py-2 px-4 rounded-md mt-4">
                  Publicar
                </button>
              </Link>
            </div>
          ) : (
            currentPosts.map((post) => (
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
            ))
          )}
        </div>
        {totalPages > 1 && ( // Validación para verificar si se necesita la paginación
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md border border-secondary-200 ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-secondary-100 hover:text-white"
              }`}
            >
              Anterior
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-4 py-2 rounded-md border border-secondary-200 ${
                  currentPage === pageNumber
                    ? "bg-secondary-100 text-white"
                    : "hover:bg-secondary-100 hover:text-white"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md border border-secondary-200 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-secondary-100 hover:text-white"
              }`}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
      <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
    </div>
  );
}

export default antiguedadesComponent;
