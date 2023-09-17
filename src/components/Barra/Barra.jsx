import { Link } from "react-router-dom";
function Barra() {
  return (
    <nav className="bg-secondary-200 dark:bg-gray-700 mt-4">
      <div className="px-4 py-3">
        <div className="flex items-center">
          <ul className="mx-auto flex flex-row font-medium mt-0 space-x-8 text-sm">
            <li>
              <Link
                to="/categoria/antiguedades"
                className="text-white  hover:underline"
                aria-current="page"
              >
                Antiguedades
              </Link>
            </li>
            <li>
              <Link
                to="/categoria/musica"
                className="text-white  hover:underline"
                aria-current="page"
              >
                Musica
              </Link>
            </li>
            <li>
              <Link
                to="/categoria/cartas"
                className="text-white  hover:underline"
                aria-current="page"
              >
                Cartas
              </Link>
            </li>
            <li>
              <Link
                to="/categoria/tecnologia"
                className="text-white  hover:underline"
                aria-current="page"
              >
                Tecnologia
              </Link>
            </li>
            <li>
              <Link
                to="/categoria/comics"
                className="text-white  hover:underline"
                aria-current="page"
              >
                Comics
              </Link>
            </li>
            <li>
              <Link
                to="/categoria/juguetes"
                className="text-white  hover:underline"
                aria-current="page"
              >
                Juguetes
              </Link>
            </li>
            <li>
              <Link
                to="/categoria/deporte"
                className="text-white  hover:underline"
                aria-current="page"
              >
                Deporte
              </Link>
            </li>
            <li>
              <Link
                to="/categoria/libros"
                className="text-white  hover:underline"
                aria-current="page"
              >
                Libros
              </Link>
            </li>
            <li>
              <Link
                to="/categoria/otros"
                className="text-white  hover:underline"
                aria-current="page"
              >
                Otros
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Barra;
