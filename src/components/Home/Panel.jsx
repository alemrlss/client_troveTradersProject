/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import testImg from "../../assets/img/logo-bg.png";

// Componente para mostrar la calificación en forma de estrellas
function RatingStars({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 text-yellow-500 ${
          i <= rating ? "fill-current" : "fill-current"
        }`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M2.64 8.243l5.602.832L10 2.763l1.758 6.312 5.602-.832-4.467 3.556 1.77 6.308-4.988-3.987-4.987 3.987 1.77-6.308L1.04 9.075l5.603-.832z"
        />
      </svg>
    );
  }
  return <div className="flex">{stars}</div>;
}

function Panel() {
  // Datos simulados del usuario (puedes reemplazar estos datos con los tuyos)
  const userData = {
    name: "Alejandro Morales",
    profilePicture: testImg, // Reemplaza esto con la URL de la imagen del usuario
    rating: 4.5, // Puntuación del usuario (puedes cambiarla para probar diferentes calificaciones)
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 m-4 items-center animate-fade animate-once animate-duration-1000 animate-delay-0 animate-ease-in-out">
      {/* Información del usuario */}
      <div className="flex items-center gap-2 sm:w-1/6">
        <img
          src={userData.profilePicture}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="text-gray-900 dark:text-white  text-l font-bold">
            {userData.name}
          </p>
          <RatingStars rating={userData.rating} />
        </div>
      </div>

      {/* Botón "Crear Publicación" y "Mis Publicaciones" */}
      <div className="flex-grow-0 w-full sm:w-2/6 flex justify-center sm:justify-start space-x-4">
        <Link to="/crear-publicacion">
          <button className="text-white rounded-full bg-jisselColor1-400 hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Crear Publicación
          </button>
        </Link>
        <Link to="/mis-publicaciones">
          <button className="text-white rounded-full bg-jisselColor1-400 hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Mis Publicaciones
          </button>
        </Link>
      </div>

      {/* Filtro de Búsqueda */}
      <form className="flex-grow w-full sm:w-2/6 sm:mr-4">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-900 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                d="M9 17a7 7 0 100-14 7 7 0 000 14z"
              />
              <path stroke="currentColor" d="M20 20l-5.2-5.2" />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full rounded-full p-4 pl-10 text-sm text-gray-900 border border-jisselColor1-300 bg-gray-50 focus:ring-jisselColor1-200 focus:border-jisselColor1-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Buscar publicaciones..."
            required
          />
          <button
            type="submit"
            className="text-white rounded-full absolute right-2.5 bottom-2.5 bg-jisselColor1-300 hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Buscar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Panel;
