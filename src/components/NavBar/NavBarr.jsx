/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useEffect } from "react";
import { FaHome, FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import img from "../../assets/logo.png";
import { SocketContext } from "../../contexts/socketContext";
import { useAuthContext } from "../../contexts/authContext";
import { useModal } from "../../hooks/useModal";
import axios from "axios";
import { getDataUser } from "../../services/Auth";
import { Link } from "react-router-dom";
import ModalRequests from "../Modals/ModalRequests/ModalRequests";
import ModalTrades from "../Modals/ModalTrades.jsx/ModalTrades";
import NotificationsComponent from "./NotificationsComponent";
import TradesComponent from "./TradesComponent";
import RequestsComponent from "./RequestsComponent";

function NavBarr() {
  //^  Contexto.
  const socket = useContext(SocketContext);

  const { logout } = useAuthContext();

  const [showNotification, setShowNotification] = useState(false);
  const [notificationsB, setNotificationsB] = useState([]);

  const [isMenuOpen, setMenuOpen] = useState(false);

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
    <nav className="bg-primary-200 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logotipo */}
        <div className="text-white text-2xl font-bold flex items-center">
          <img src={img} className="h-12 mr-3" alt="TroveTraders Logo" />
          <p>TroveTraders</p>
        </div>
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
        <div className="hidden sm:flex items-center space-x-3">
          {/* Iconos para las solicitudes de compra, trades en ejecución, notificaciones */}
          <div className="flex items-center text-white">
            {/* Contenedor para alinear ícono con texto */}
            <FaHome className="w-6 h-6 text-xl text-black" />
            <Link className="text-black p-2" to={`/home`}>
              <span>Inicio</span>
            </Link>
          </div>
          <div className="flex items-center text-white">
            {/* Contenedor para alinear ícono con texto */}
            <FaUser className="w-6 h-6 text-xl text-black" />
            <Link
              className="text-black p-2"
              to={`/profile/${idUser}`}
            >
              <span>Perfil</span>
            </Link>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-4">
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
            className="text-primary-400 rounded-md p-3 hover:text-red-700 ml-8"
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
              <RequestsComponent className="text-black"
                id={idUser}
                openModal={openModalRequests}
                setRequests={setRequests}
              />

              <NotificationsComponent className="text-black"
                idUser={idUser}
                setNotifications={setNotifications}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
              />
              <Link
                className="text-black p-3 flex items-center "
                onClick={handleMenuItemClick}
                to={`/home`}
              >
                <FaHome />
                <span className="ml-2">Inicio</span>
              </Link>
              <Link
                onClick={handleMenuItemClick}
                to={`/profile/${idUser}`}
                className="text-black p-3 flex items-center"
              >
                <FaUser />
                <span className="ml-2">Perfil</span>
              </Link>
              <button
                className="text-red-600 p-3 hover:text-red-700 flex items-center"
                onClick={handleMenuToggle}
              >
                <FaSignOutAlt />
                <span onClick={handleLogout} className="ml-2 font-bold text-xl">
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
  );
}

export default NavBarr;
