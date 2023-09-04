/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import testImg from "../../assets/img/logo.png";

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

function Panel( user ) {
  // Datos simulados del usuario (puedes reemplazar estos datos con los tuyos)
  const userData = {
    name: user.name,
    profilePicture: testImg, // Reemplaza esto con la URL de la imagen del usuario
    rating: 4.5, // Puntuación del usuario (puedes cambiarla para probar diferentes calificaciones)
  };

  return (
    
    <div className="flex flex-col sm:flex-row gap-4 m-2 items-center animate-fade animate-once animate-duration-1000 animate-delay-0 animate-ease-in-out">
      {/* Información del usuario */}
      <div className="flex items-center gap-2 sm:w-1/6">
        <img
          src={userData.profilePicture}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <div>
        <p className="capitalize">{userData.name}</p>
          <RatingStars rating={userData.rating} />
        </div>
      </div>

      {/* Botón "Crear Publicación" y "Mis Publicaciones" */}
      <div className="flex-grow-0 w-full sm:w-2/6 flex justify-center sm:justify-start space-x-4">
        <Link to="/crear-publicacion">
          <button className="text-white rounded-full bg-secondary-100 hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Crear Publicación
          </button>
        </Link>
        <Link to="/mis-publicaciones">
          <button className="text-white rounded-full bg-secondary-100 hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Mis Publicaciones
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Panel;
