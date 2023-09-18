import { Link } from "react-router-dom";

function Barra() {
  return (
    <nav className="bg-secondary-200 text-white py-2">
      <div className="container mx-auto">
        <ul className="flex justify-center space-x-8 md:space-x-4 text-sm">
          <li>
            <Link
              to="/categoria/antiguedades"
              className="hover:underline"
              aria-current="page"
            >
              Antigüedades
            </Link>
          </li>
          <li>
            <Link
              to="/categoria/musica"
              className="hover:underline"
              aria-current="page"
            >
              Música
            </Link>
          </li>
          <li>
            <Link
              to="/categoria/cartas"
              className="hover:underline"
              aria-current="page"
            >
              Cartas
            </Link>
          </li>
          <li>
            <Link
              to="/categoria/tecnologia"
              className="hover:underline"
              aria-current="page"
            >
              Tecnología
            </Link>
          </li>
          <li>
            <Link
              to="/categoria/comics"
              className="hover:underline"
              aria-current="page"
            >
              Comics
            </Link>
          </li>
          <li>
            <Link
              to="/categoria/juguetes"
              className="hover:underline"
              aria-current="page"
            >
              Juguetes
            </Link>
          </li>
          <li>
            <Link
              to="/categoria/deporte"
              className="hover:underline"
              aria-current="page"
            >
              Deporte
            </Link>
          </li>
          <li>
            <Link
              to="/categoria/libros"
              className="hover:underline"
              aria-current="page"
            >
              Libros
            </Link>
          </li>
          <li>
            <Link
              to="/categoria/otros"
              className="hover:underline"
              aria-current="page"
            >
              Otros
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Barra;
