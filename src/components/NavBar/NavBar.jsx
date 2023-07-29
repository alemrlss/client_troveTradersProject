/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDataUser } from "../../services/Auth";
import { useAuthContext } from "../../contexts/authContext";
import NotificationsComponent from "./NotificationsComponent";
import img from "../../assets/img/logo.png";
import TradesComponent from "./TradesComponent";
import RequestsComponent from "./RequestsComponent";
import { useModal } from "../../hooks/useModal";
import ModalRequests from "../Modals/ModalRequests/ModalRequests";
import ModalTrades from "../Modals/ModalTrades.jsx/ModalTrades";
import { useContext } from "react";
import { SocketContext } from "../../contexts/socketContext";
import axios from "axios";
function NavBar() {
  //^  Contexto.
  const socket = useContext(SocketContext);
  const { logout } = useAuthContext();

  const [showNotification, setShowNotification] = useState(false);
  const [notificationsB, setNotificationsB] = useState([]);

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

  //

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-300">
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
            <RequestsComponent
              id={idUser}
              openModal={openModalRequests}
              setRequests={setRequests}
            />
            <TradesComponent
              id={idUser}
              openModal={openModalTrades}
              setTrades={setTrades}
            />
            <NotificationsComponent
              idUser={idUser}
              setNotifications={setNotifications}
              setIsOpen={setIsOpen}
              isOpen={isOpen}
            />

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
              //~Aqui se puede poner un ternario para cambiar el color de la notificacion(la condicion es si esta leida o no)
                className={` p-4 m-1  ${notification.read ? "bg-gray-200 text-gray-700" : "bg-orange-200 text-orange-700"}`}
                key={notification._id}
                onClick={() => {
                  readNotification(notification._id, idUser);
                  setIsOpen(false);
                }}
              >
                <Link to={notification.target}>
                  {notification.message}
                 {console.log(notification)}
                </Link>
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

export default NavBar;
