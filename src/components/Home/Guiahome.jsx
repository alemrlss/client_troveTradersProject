import { FaUser, FaAngleRight, FaStar } from "react-icons/fa";

function Guiahome() {
  return (
    <div className="flex flex-wrap justify-center gap-4 text-center py-16 animate-fade-down animate-duration-[400ms] animate-delay-100">
      <div className="w-1/4 xl:w-1/4 px-4 py-4 mt-6 bg-gradient-to-b from-secondary-600 to-secondary-100 rounded-lg shadow-lg">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-12 h-12 mx-auto text-white rounded-md ">
            <FaUser className="w-10 h-10" />
          </div>
        </div>
        <h3 className="py-4 text-1xl font-semibold text-white sm:text-xl dark:text-white">
          Regístrate
        </h3>
        <p className="py-4 text-gray-200  text-md dark:text-gray-300">
          Todos nuestros usuarios deben estar verificados para garantizar un
          entorno de mercado seguro. Registrarte es el primer paso para
          comenzar.
        </p>
      </div>
      <div className="w-1/4 xl:w-1/4 px-4 py-4 -mt-6 bg-gradient-to-b from-secondary-600 to-secondary-100 rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-12 h-12 mx-auto text-white rounded-md">
            <FaAngleRight className="w-10 h-10" />
          </div>
        </div>
        <h3 className="py-4 text-1xl font-semibold text-white sm:text-xl dark:text-white">
          Compra y Vende
        </h3>
        <p className="py-4 text-gray-200 font-bold text-md dark:text-gray-300">
          Compra y vende cualquier artículo de tu colección de la manera que
          desees y al precio que elijas. Explora nuestras colecciones para
          encontrar lo que estás buscando y mucho más.
        </p>
      </div>
      <div className="w-1/4 px-4 py-4 mt-6 bg-gradient-to-b from-secondary-600 to-secondary-100  rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-12 h-12 mx-auto text-white rounded-md ">
            <FaStar className="h-10 w-10" />
          </div>
        </div>
        <h3 className="py-4 text-1xl font-semibold text-white sm:text-xl dark:text-white">
          Confía en el Sistema de Ratings
        </h3>
        <p className="py-4 text-gray-200 text-md dark:text-gray-300">
          Sé un vendedor responsable y recibe una buena calificación. Evita
          riesgos y haz negocios únicamente con vendedores que tengan una
          calificación positiva en nuestro sistema de calificación.
        </p>
      </div>
    </div>
  );
}

export default Guiahome;
