/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useEffect } from "react";
import {
  FaHome,
  FaUser,
  FaAngleRight,
  FaBars,
  FaTimes,
  FaPlus,
  FaList,
} from "react-icons/fa";
import logo from "../../assets/img/imagen3.png";
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
import { useLocation } from "react-router-dom"; // Importa useLocation
import { Tooltip } from "react-tooltip";
import { Navigate } from "react-router-dom"; // Asegúrate de importar el Navigate correcto según tu biblioteca de enrutamiento

function NavBarr() {
  //^  Contexto.
  const socket = useContext(SocketContext);
  const location = useLocation(); // Obtiene la ubicación actual

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
  const [isOpenRequest, setIsOpenRequest] = useState(false);
  const [isOpenTrade, setIsOpenTrade] = useState(false);
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

  const handleAccept = async (request) => {
    try {
      await axios.post(
        `http://localhost:3001/users/${idUser}/requests/${request._id}/accept`
      );
      await axios.post("http://localhost:3001/notifications", {
        sellerId: request.buyerID,
        message: `🤩 El vendedor ${request.nameSeller} ha aceptado tu solicitud de compra por el articulo: ${request.titlePost}. Click para ir al trade`,
        target: `/trade/${request._id}`,
      });

      await axios.put(`http://localhost:3001/posts/${request.postID}`, {
        newState: "acuerdo",
      });

      sendNotification(
        request.buyerID,
        `🤩 El vendedor ${request.nameSeller} ha aceptado tu solicitud de compra por el articulo: ${request.titlePost}. Click para ir al trade`,
        "bg-green-200",
        `/trade/${request._id}`
      );
      setIsOpenRequest(!isOpenRequest);
    } catch (error) {
      // Manejo de errores si la solicitud falla
      console.error("Error al aceptar la solicitud:", error);
    }
  };

  const handleReject = async (request) => {
    console.log(request);
    try {
      await axios.delete(
        `http://localhost:3001/users/${idUser}/requests/${request._id}`
      );
      const updatedRequests = requests.filter((r) => r._id !== request._id);
      setRequests(updatedRequests);

      await axios.post("http://localhost:3001/notifications", {
        sellerId: request.buyerID,
        message: `😭 El vendedor ${request.nameSeller} ha rechazado tu solicitud por la compra del articulo: ${request.titlePost} 😭`,
        target: `/home`,
      });
      sendNotification(
        request.buyerID,
        `😭 El vendedor ${request.nameSeller} ha rechazado tu solicitud por la compra del articulo: ${request.titlePost} 😭`,
        "bg-pink-400",
        "/home"
      );
    } catch (error) {
      console.error("Error al eliminar la solicitud:", error);
    }
  };

  //Funcion para dar formato a la hora
  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString(undefined, options);

    return formattedDate;
  }

  return (
    <div>
      <nav className="bg-white shadow-lg mx-auto flex items-center justify-between px-4 py-1">
        {/* Logo */}
        <div className="flex items-center w-2/6">
          <div className="hidden sm:flex items-center space-x-2 ">
            <Link
              data-tooltip-id="my-tooltip-home"
              data-tooltip-content="Inicio"
              to={`/home`}
              className={`text-secondary-100 p-1 ${
                location.pathname === "/home"
                  ? "border-b-2 border-b-secondary-200"
                  : ""
              }`}
            >
              <FaHome className="w-6 h-6 " />
            </Link>
            <Link
              data-tooltip-id="my-tooltip-perfil"
              data-tooltip-content="Perfil"
              to={`/profile/${idUser}`}
              className={`text-secondary-100 flex flex-col p-1 ${
                location.pathname === `/profile/${idUser}`
                  ? "border-b-2 border-b-secondary-200"
                  : ""
              }`}
            >
              <FaUser className="w-6 h-6" />
            </Link>
            <Link
              data-tooltip-id="my-tooltip-crear-publicacion"
              data-tooltip-content="Crear publicacion"
              to={`/crear-publicacion`}
              className={`text-secondary-300 p-1 ${
                location.pathname === "/crear-publicacion"
                  ? "border-b-2 border-b-secondary-200"
                  : ""
              }`}
            >
              <FaPlus className="w-6 h-6 rounded-full border-2 p-1 border-secondary-100 " />
            </Link>
            <Link
              data-tooltip-id="my-tooltip-mis-publicaciones"
              data-tooltip-content="Mis publicaciones"
              to={`/mis-publicaciones`}
              className={`text-secondary-100 flex flex-col p-1 ${
                location.pathname === `/mis-publicaciones`
                  ? "border-b-2 border-b-secondary-200"
                  : ""
              }`}
            >
              <FaList className="w-6 h-6" />
            </Link>
            <Tooltip
              id="my-tooltip-home"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "#fff" }}
            />
            <Tooltip
              id="my-tooltip-perfil"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "#fff" }}
            />
            <Tooltip
              id="my-tooltip-crear-publicacion"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "#fff" }}
            />
            <Tooltip
              id="my-tooltip-mis-publicaciones"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "#fff" }}
            />
          </div>
          <Link
            to={`/home`}
            className="ml-2 text-secondary-200 font-semibold italic text-lg"
          ></Link>

          <form
            className="hidden w-96 sm:flex items-center border border-jisselColor1-300 rounded-lg ml-4"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/resultados?query=${query}`);
            }}
          >
            <input
              type="search"
              id="default-search"
              className="w-full px-4 py-2 rounded-l-full text-gray-900 focus:outline-none"
              placeholder="Buscar objetos..."
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-jisselColor1-300 text-gray-400 hover:bg-opacity-90 rounded-r-full px-4 py-2  focus:outline-none"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Search bar */}
        {/* Links */}
        <div className="flex w-2/6  justify-center">
          <img src={logo} className="h-10" alt="" />
        </div>

        {/* Menu icon and links */}
        <div className=" items-center space-x-4 w-2/6 flex justify-end">
          <button
            className="text-secondary-100 text-xl sm:hidden"
            onClick={handleMenuToggle}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Notification, trades, requests, and logout */}
          <div className="hidden sm:flex items-center ">
            <div
              data-tooltip-id="my-tooltip-trades"
              data-tooltip-content="Trades en ejecucion"
            >
              <TradesComponent
                id={idUser}
                openModal={openModalTrades}
                setTrades={setTrades}
                isOpenTrade={isOpenTrade}
                setIsOpenTrade={setIsOpenTrade}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isOpenRequest={isOpenRequest}
                setIsOpenRequest={setIsOpenRequest}
              />
            </div>
            <div
              data-tooltip-id="my-tooltip-trades"
              data-tooltip-content="Solicitudes"
            >
              <RequestsComponent
                id={idUser}
                setRequests={setRequests}
                setIsOpenRequest={setIsOpenRequest}
                isOpenRequest={isOpenRequest}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isOpenTrade={isOpenTrade}
                setIsOpenTrade={setIsOpenTrade}
              />
            </div>
            <div
              data-tooltip-id="my-tooltip-notificaciones"
              data-tooltip-content="Notificaciones"
            >
              <NotificationsComponent
                idUser={idUser}
                setNotifications={setNotifications}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                isOpenRequest={isOpenRequest}
                setIsOpenRequest={setIsOpenRequest}
                isOpenTrade={isOpenTrade}
                setIsOpenTrade={setIsOpenTrade}
              />
            </div>
            <div
              data-tooltip-id="my-tooltip-logout"
              data-tooltip-content="Cerrar sesion"
              onClick={handleLogout}
              className=" shadow-md flex rounded-lg p-2 ml-6 items-center cursor-pointer hover:text-red-700"
            >
              <FaAngleRight className="w-6 h-6 text-black hover:text-red-500" />

              <Tooltip
                id="my-tooltip-logout"
                style={{ backgroundColor: "rgba(255,0,0,0.5)	", color: "#fff" }}
              />
            </div>
            <Tooltip
              id="my-tooltip-trades"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "#fff" }}
            />

            <Tooltip
              id="my-tooltip-solicitudes"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "#fff" }}
            />
            <Tooltip
              id="my-tooltip-notificaciones"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "#fff" }}
            />
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden absolute top-20 right-0 bg-white p-4 z-50 animate-fade-down animate-once animate-duration-100 animate-delay-0 animate-ease-linear">
            <div className="flex flex-col items-center space-y-2">
              <TradesComponent
                id={idUser}
                openModal={openModalTrades}
                setTrades={setTrades}
              />

              <NotificationsComponent
                className="text-black"
                idUser={idUser}
                setNotifications={setNotifications}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
              />
              <Link
                className="text-white p-3 flex items-center"
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
                <FaAngleRight />
                <span onClick={handleLogout} className="ml-2 font-bold text-xl">
                  Cerrar sesion
                </span>
              </button>
            </div>
          </div>
        )}
      </nav>
      {/* Notifications */}
      {isOpen && (
        <div className="notification-menu absolute top-15 right-0 text-black bg-white border border-gray-300 rounded-lg shadow-md p-4 w-80 max-h-60 overflow-y-auto z-50">
          <h2 className="text-xl font-semibold mb-4">Notificaciones</h2>
          <ul className="divide-y divide-gray-300">
            {notifications.length === 0 ? ( // Verifica si no hay notificaciones
              <li className="p-4 m-1 bg-gray-100 text-gray-700 rounded-md">
                No hay notificaciones
              </li>
            ) : (
              // Mapea las notificaciones si hay alguna
              notifications.map((notification) => (
                <li
                  className={`p-4 m-2 text-xs ${
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
              ))
            )}
          </ul>
        </div>
      )}

      {isOpenRequest && (
        <div className="notification-menu absolute top-15 right-0 text-black bg-white border border-gray-300 rounded-lg shadow-md p-4 w-full md:w-80 max-h-60 overflow-y-auto z-50">
          <h2 className="text-xl font-semibold mb-4">Solicitudes</h2>
          <ul className="divide-y divide-gray-300">
            {requests.length === 0 ? (
              <li className="p-4 m-1 bg-gray-100 text-gray-700 rounded-md">
                No hay solicitudes
              </li>
            ) : (
              requests.map((request) => (
                <div
                  key={request._id}
                  className="p-2 mb-4 border rounded flex flex-col md:flex-col md:items-center"
                >
                  <div className="mb-4 md:mb-0 md:mr-4 text-xs">
                    <p className="mb-2"> {request.message}</p>
                  </div>
                  <div className="flex">
                    <button
                      className="px-2 py-1 md:mb-0 md:mr-2 text-xs text-white bg-green-500 rounded hover:bg-green-600"
                      onClick={() => {
                        handleAccept(request);
                      }}
                    >
                      Aceptar
                    </button>
                    <button
                      className="px-2 py-1 text-xs rounded-md text-white bg-red-500  hover:bg-red-600"
                      onClick={() => {
                        handleReject(request);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </ul>
        </div>
      )}
      {isOpenTrade && (
        <div className="notification-menu absolute top-15 right-0 text-black bg-white border border-gray-300 rounded-lg shadow-md p-4 w-full md:w-80 max-h-60 overflow-y-auto z-50">
          <h2 className="text-xl font-semibold mb-4">Trades en ejecucion</h2>
          <ul className="divide-y divide-gray-300">
            {trades.length === 0 ? (
              <li className="p-4 m-1 bg-gray-100 text-gray-700 rounded-md">
                No hay trades en ejecucion
              </li>
            ) : (
              trades.map((trade) => (
                <div
                  key={trade._id}
                  className="p-2 mb-4 border rounded flex flex-col md:flex-col md:items-center"
                >
                  <div>
                    <p className="font-bold text-sm">{trade.titlePost}</p>
                    <div className="flex justify-between space-x-4">
                      <p className="text-gray-500 text-xs">
                        Vendedor: {trade.nameSeller}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Comprador: {trade.nameBuyer}
                      </p>
                    </div>
                    <div className=" flex justify-end mx-2">
                      <button
                        onClick={() => {
                          setIsOpenTrade(!isOpenTrade);
                          navigate(`/trade/${trade._id}`);
                          window.location.reload();
                        }}
                        className=" bg-orange-400 hover:bg-green-600 text-white font-bold py-1 px-2 rounded my-1"
                      >
                        Ver Trade
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ul>
        </div>
      )}

      {/* Modals */}
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

      {/* Notifications bar */}
      {showNotification && (
        <div className="absolute top-4 right-5 space-y-4">
          {notificationsB.map((notification, index) => (
            <div
              key={index}
              className={`${notification.bgColor} text-gray-800 p-4 rounded-md shadow-md`}
            >
              {notification.messageHTML}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NavBarr;
