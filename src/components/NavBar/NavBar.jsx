import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDataUser } from "../../services/Auth";
import { useAuthContext } from "../../contexts/authContext";
import img from "../../assets/logo.png";
import axios from "axios";
function NavBar() {
  const { logout } = useAuthContext();
  const idUser = getDataUser().id;

  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const loadNotifications = () => {
    // Realiza la solicitud al servidor para obtener las notificaciones
    // Puedes usar axios o cualquier otra librería para hacer la solicitud HTTP
    axios
      .get(`http://localhost:3001/notifications/${idUser}`)
      .then((response) => {
        // Actualiza el estado con las notificaciones obtenidas del servidor
        setNotifications(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        // Manejo de errores si la solicitud falla
        console.log(error);
      });
  };

  const handleNotificationsClick = () => {
    if (isOpen) {
      setIsOpen(!isOpen);
    } else {
      setIsOpen(!isOpen);
      loadNotifications();
    }
    console.log(isOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center">
          <img src={img} className="h-16 mr-3" alt="TroveTraders Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            TroveTraders
          </span>
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleNotificationsClick}
              >
                Notificaciones
              </button>
            </li>
            <li>
              <Link
                to={`/home`}
                className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to={`/profile/${idUser}`}
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                My Profile
              </Link>
            </li>
            <li>
              <a
                onClick={handleLogout}
                href="#"
                className="py-2 pl-3 pr-4  text-red-500 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Cerrar Sesion
              </a>
            </li>
          </ul>
        </div>
      </div>
      {isOpen && (
        <div className="notification-menu absolute top-12 left-0 bg-white bordern border-gray-300 p-4 w-80 h-full overflow-y-scroll">
          <h2 className="bg-green-500 p-2">Notificaciones</h2>
          <ul className="divide-y divide-gray-300 ">
            {notifications.map((notification) => (
              <li
                className={`bg-gray-300 p-4 m-1  ${
                  notification.read === "true" ? "text-gray-500" : "text-black"
                }`}
                key={notification._id}
              >
                {notification.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
