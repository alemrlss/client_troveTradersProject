import logo from "../../assets/img/logoAlejandro.png";

function Footer() {
  return (
    <footer className="bg-white shadow dark:bg-gray-900">
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo y Nombre de la Empresa */}
          <a
            href="/"
            className="flex items-center mb-4 md:mb-0 text-secondary-100"
          >
            <img src={logo} className="h-20 mr-3" alt="TroveTraders Logo" />
          
          </a>

          {/* Enlaces de Navegación */}
          <ul className="flex flex-wrap mb-6 text-sm font-medium text-gray-700 md:mb-0">
            <li>
              <p>
                Contáctanos: Soportealcliente@trovetraders.com
              </p>
            </li>
          </ul>
        </div>

        {/* Línea divisoria */}
        <hr className="my-6 border-gray-200 dark:border-gray-700" />

        {/* Derechos de Autor */}
        <span className="block text-sm text-gray-700 text-center dark:text-gray-400">
          © {new Date().getFullYear()}{" "}
          <a href="/" className="hover:underline">
            TroveTraders
          </a>
          . Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
