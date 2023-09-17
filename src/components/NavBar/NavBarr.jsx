/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useEffect } from "react";
import { FaHome, FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import img from "../../assets/img/logo.png";
import { SocketContext } from "../../contexts/socketContext";
import { useAuthContext } from "../../contexts/authContext";
import { useModal } from "../../hooks/useModal";
import axios from "axios";
import { getDataUser } from "../../services/Auth";
import ModalRequests from "../Modals/ModalRequests/ModalRequests";
import ModalTrades from "../Modals/ModalTrades.jsx/ModalTrades";
import NotificationsComponent from "./NotificationsComponent";
import TradesComponent from "./TradesComponent";
import RequestsComponent from "./RequestsComponent";
import { Link, useNavigate } from "react-router-dom";

function NavBarr() {
  //^  Contexto.
  const socket = useContext(SocketContext);

  const { logout } = useAuthContext();

  const [showNotification, setShowNotification] = useState(false);
  const [notificationsB, setNotificationsB] = useState([]);

  const [isMenuOpen, setMenuOpen] = useState(false);

  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  //!UseEffect para la escucha de las notificaciones
  useEffect(() => {
    if (socket) {
      socket.on("newNotification", (payload) => {
        // Manejar la notificación recibida desde el servidor
        console.log(payload);
        const msgHTML = (
          <p>
            <b>{payload.msgNotification}</b>
          </p>
        );
        console.log("Nueva notificación recibida:", payload.msgNotification);
        showAndHideNotification(
          payload.msgNotification,
          msgHTML,
          payload.bgColor
        );

        // Puedes realizar otras acciones con la notificación, como mostrarla en la interfaz de usuario
      });
    }
    return () => {
      if (socket) {
        socket.off("newNotification");
      }
    };
  }, []);

  //!UseEffect para cuando una notificacion cambie se renderize
  useEffect(() => {
    // Timer para eliminar las notificaciones después de 2 segundos
    let timer;

    if (notificationsB.length > 0) {
      timer = setTimeout(() => {
        setNotifications([]);
        setShowNotification(true);
      }, 2500);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [notificationsB]);

  //!Funcion para mostrar las Notificaciones
  const showAndHideNotification = (msg, messageHTML, bgColor) => {
    // ~Verificar si la notificación ya existe en el estado de notificaciones
    const notificationExists = notificationsB.some(
      (notification) => notification.msg === msg
    );
    if (!notificationExists) {
      setShowNotification(true);
      setNotificationsB((prevNotifications) => [
        ...prevNotifications,
        { msg, messageHTML, bgColor },
      ]);
    }
  };
  //? Funcion para enviar la notificacion al socket de socket.io
  const sendNotification = (authorId, msgNotification, bgColor, target) => {
    if (socket) {
      socket.emit("notification", {
        authorId,
        msgNotification,
        bgColor,
        target,
      });
    }
  };

  //~MODALES DE REQUESTS Y TRADES
  const [isOpenModalRequests, openModalRequests, closeModalRequests] =
    useModal(false);
  const [isOpenModalTrades, openModalTrades, closeModalTrades] =
    useModal(false);

  //!idUser de la session!
  const idUser = getDataUser().id;

  //?Estados de las notificaciones
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  //?Estados de las requests
  const [requests, setRequests] = useState([]);

  //?Estado de los trades
  const [trades, setTrades] = useState([]);

  //!MANEJO DEL LOGOUT
  const handleLogout = () => {
    logout();
  };

  const readNotification = (idNotification, idUser) => {
    console.log("h");
    axios
      .put(
        `http://localhost:3001/notifications/${idUser}/read/${idNotification}`
      )
      .then((response) => {
        console.log("Notificación marcada como leída:", response.data);
        // Realiza alguna acción adicional si es necesario
      })
      .catch((error) => {
        console.error("Error al marcar la notificación como leída:", error);
      });
  };

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = () => {
    setMenuOpen(false); // Cerrar el menú móvil cuando se hace clic en un elemento
  };

  return (
    <div>
      <nav className="bg-primary-100 p-4 shadow-lg mx-auto">
        <div className="sm:mx-auto	container flex justify-between items-center lg:text-sm">
          {/* Logotipo */}
          <div className="text-white text-sm font-bold flex items-center">
            <img src={img} className="h-24" alt="TroveTraders Logo" />
            <p className="text-secondary-100 hidden xl:block">TroveTraders</p>
          </div>
          {/* menu hamb */}
          <button
            className="text-white mr-4 sm:hidden"
            onClick={handleMenuToggle}
          >
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6" /> // Icono "x" para cerrar el menú
            ) : (
              <FaBars className="w-6 h-6" /> // Icono de menú hamburguesa
            )}
          </button>
          <div className="hidden sm:flex items-center">
            {/* Iconos para las solicitudes de compra, trades en ejecución, notificaciones */}
            <div className="flex items-center text-white">
              {/* Contenedor para alinear ícono con texto */}
              <Link className="text-white p-2" to={`/home`}>
                <FaHome className="w-7 h-7 text-xl text-white m-2" />
              </Link>
            </div>
            <div className="flex items-center text-white">
              {/* Contenedor para alinear ícono con texto */}
              <Link className="text-white p-2" to={`/profile/${idUser}`}>
                <FaUser className="w-6 h-6 text-xl text-white m-2" />
              </Link>
            </div>
          </div>

          {/*-------------------------------------------------------------- BUSQUEDA ------------------------------------------------------------------*/}
          <form
            className="flex-grow w-full sm:w-2/6 sm:mr-4"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/resultados?query=${query}`);
            }}
          >
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
                className="block w-full rounded-full p-4 pl-10 text-sm text-gray-900 border border-jisselColor1-300 bg-gray-150 focus:ring-jisselColor1-200 focus:border-jisselColor1-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Buscar objetos.."
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                className="text-gray-400 rounded-full absolute right-2.5 bottom-2.5 bg-jisselColor1-300 hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Buscar
              </button>
            </div>
          </form>

          <div className="hidden sm:flex items-center space-x-0">
            <TradesComponent
              id={idUser}
              openModal={openModalTrades}
              setTrades={setTrades}
            />
            <RequestsComponent
              id={idUser}
              openModal={openModalRequests}
              setRequests={setRequests}
            />

            <NotificationsComponent
              idUser={idUser}
              setNotifications={setNotifications}
              setIsOpen={setIsOpen}
              isOpen={isOpen}
            />
            {/* Botón o icono de cerrar sesión */}
            <button
              onClick={handleLogout}
              className="text-secondary-200 rounded-md p-3 hover:text-red-700 ml-8"
            >
              <FaSignOutAlt className="w-8 h-8" />
            </button>
          </div>

          {/* Menú para dispositivos móviles */}
          {isMenuOpen && (
            <div className="sm:hidden absolute top-20 bg-primary-100 right-0 p-4 z-50 animate-fade-down animate-once animate-duration-100 animate-delay-0 animate-ease-linear">
              <div className="flex flex-col items-center space-y-2">
                <TradesComponent
                  id={idUser}
                  openModal={openModalTrades}
                  setTrades={setTrades}
                />
                <RequestsComponent
                  className="text-black"
                  id={idUser}
                  openModal={openModalRequests}
                  setRequests={setRequests}
                />

                <NotificationsComponent
                  className="text-black"
                  idUser={idUser}
                  setNotifications={setNotifications}
                  setIsOpen={setIsOpen}
                  isOpen={isOpen}
                />
                <Link
                  className="text-white p-3 flex items-center "
                  onClick={handleMenuItemClick}
                  to={`/home`}
                >
                  <FaHome />
                  <span className="ml-2">Inicio</span>
                </Link>
                <Link
                  onClick={handleMenuItemClick}
                  to={`/profile/${idUser}`}
                  className="text-white p-3 flex items-center"
                >
                  <FaUser />
                  <span className="ml-2">Perfil</span>
                </Link>
                <button
                  className="text-red-600 p-3 hover:text-red-700 flex items-center"
                  onClick={handleMenuToggle}
                >
                  <FaSignOutAlt />
                  <span
                    onClick={handleLogout}
                    className="ml-2 font-bold text-xl"
                  >
                    Cerrar sesion
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
        {isOpen && (
          <div className="notification-menu absolute top-20 right-0 text-black bg-white border border-gray-300 rounded-lg shadow-md p-4 w-80 max-h-60 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Notificaciones</h2>
            <ul className="divide-y divide-gray-300">
              {notifications.map((notification) => (
                <li
                  className={`p-4 m-1 ${
                    notification.read
                      ? "bg-gray-100 text-gray-700"
                      : "bg-orange-100 text-orange-700"
                  } rounded-md transition duration-300 ease-in-out transform hover:scale-105`}
                  key={notification._id}
                  onClick={() => {
                    readNotification(notification._id, idUser);
                    setIsOpen(false);
                  }}
                >
                  <Link to={notification.target}>{notification.message}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <ModalRequests
          isOpen={isOpenModalRequests}
          closeModal={closeModalRequests}
          requests={requests}
          setRequests={setRequests}
          idUser={idUser}
          showAndHideNotification={showAndHideNotification}
          sendNotification={sendNotification}
        />
        <ModalTrades
          isOpen={isOpenModalTrades}
          closeModal={closeModalTrades}
          trades={trades}
          idUser={idUser}
        />
        {showNotification && (
          <div className="absolute top-4 right-5 space-y-4">
            {notificationsB.map((notification, index) => (
              <div
                key={index}
                className={`${notification.bgColor} text-gray-800 p-4 rounded-md shadow-md`}
              >
                {" "}
                {notification.messageHTML}
              </div>
            ))}
          </div>
        )}
      </nav>

    </div>
  );
}
export default NavBarr;
