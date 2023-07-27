import img from "../../assets/logo.png";

function Footer() {
  return (
    <footer className="bg-jisselColor1-300 shadow dark:bg-gray-900">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="#"
            className="flex items-center mb-4 sm:mb-0"
          >
            <img
              src={img}
              className="h-12 mr-3"
              alt="TroveTraders Logo"
            />
            <span className=" text-white self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              TroveTraders
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-white sm:mb-0 dark:text-gray-400">
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                About
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-white sm:text-center dark:text-gray-400">
          © 2023{" "}
          <a href="#" className="hover:underline">
            TroveTraders
          </a>
          . Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
