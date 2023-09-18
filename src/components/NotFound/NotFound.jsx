import React from "react";
import { Link } from "react-router-dom"; // Importa Link para agregar un enlace de regreso

function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-gray-800">404 - Página no encontrada</h1>
        <p className="text-lg text-gray-600 mt-2">
          Lo sentimos, la página que estás buscando no se pudo encontrar.
        </p>
        <Link
          to="/"
          className="mt-4 inline-block bg-secondary-100 hover:opacity-95 text-white font-bold px-6 py-3 rounded-lg"
        >
          Volver a la página de inicio
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
