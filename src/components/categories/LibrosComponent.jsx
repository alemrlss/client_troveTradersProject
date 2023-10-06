/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { Link } from "react-router-dom";
import Barra from "../Home/Barra";
import CardProduct from "../Home/CardProduct";

function librosComponent({ posts, user }) {
  const [dataPosts] = useState(posts);

  //Filtro
  const librosPosts = dataPosts.filter((post) => post.category === "libros");

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(20);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const currentPosts = librosPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(librosPosts.length / postsPerPage);
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
          Libros
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
              <CardProduct key={post._id} post={post} />
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
export default librosComponent;
