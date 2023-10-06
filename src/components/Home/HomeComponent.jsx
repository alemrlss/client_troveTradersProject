/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/socketContext";
import { Link } from "react-router-dom";
import Categories from "./Categories";
import Carousel from "./Carousel";
import Guiahome from "./Guiahome";
import Barra from "./Barra";

import { Navigate } from "react-router-dom";
import CardProduct from "./CardProduct";

function HomeComponent({ posts, user }) {
  //^  Contexto.
  const socket = useContext(SocketContext);

  console.log(user);
  const [dataPosts] = useState(posts);
  //~ Estados (showNotification y notifications) es para las notificaciones.. dataPosts son todos los posts
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);

  //~ Paginacion.

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const currentPosts = dataPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(dataPosts.length / postsPerPage);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  //!Verificacion de terminar el registro:
  const [redirectToCompletion, setRedirectToCompletion] = useState(
    user.registrationCompleted
  );

  useEffect(() => {
    // Verificar si registrationCompleted es false
    if (!user.registrationCompleted) {
      // Redirigir al formulario de completar información
      setRedirectToCompletion(true);
    }
  }, [user.registrationCompleted]);

  if (!redirectToCompletion) {
    return <Navigate to="/registro" />;
  }

  //!Verificacion de cuenta bloqueada:
  const [redirectToCompletionBlocked, setRedirectToCompletionBlocked] =
    useState(!user.blocked);

  useEffect(() => {
    if (!user.redirectToCompletionBlocked) {
      setRedirectToCompletionBlocked(true);
    }
  }, [user.redirectToCompletionBlocked]);

  if (!redirectToCompletionBlocked) {
    return <Navigate to="/bloqueado" />;
  }
  //!UseEffect para la escucha de las notificaciones
  useEffect(() => {
    if (socket) {
      socket.on("newNotification", (payload) => {
        // Manejar la notificación recibida desde el servidor
        const msgHTML = (
          <Link to={payload.target}>
            <b>{payload.msgNotification}</b>
          </Link>
        );
        showAndHideNotification(
          payload.msgNotification,
          msgHTML,
          payload.bgColor
        );
      });
    }
    return () => {
      if (socket) {
        socket.off("newNotification");
      }
    };
  }, []);

  //!UseEffect para cuando una notificacion cambie se renderize
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // Timer para eliminar las notificaciones después de 2 segundos
    let timer;

    if (notifications.length > 0) {
      timer = setTimeout(() => {
        setNotifications([]);
        setShowNotification(true);
      }, 2500);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [notifications]);

  //!Funcion para mostrar las notificaciones
  const showAndHideNotification = (msg, messageHTML, bgColor) => {
    // ~Verificar si la notificación ya existe en el estado de notificaciones
    const notificationExists = notifications.some(
      (notification) => notification.msg === msg
    );
    if (!notificationExists) {
      setShowNotification(true);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { msg, messageHTML, bgColor },
      ]);
    }
  };

  return (
    <div className="">
      <Barra />
      <Carousel />
      <Guiahome />
      <Categories />
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-12 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-10">
          Productos Disponibles
        </h2>

        {currentPosts.length === 0 ? (
          <p className="text-base text-center italic text-secondary-100">
            No hay productos disponibles publicados
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {currentPosts.map((post) => (
              <CardProduct key={post._id} post={post} />
            ))}
          </div>
        )}

        {totalPages > 1 && ( // Validación para verificar si se necesita la paginación
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md border border-secondary-200 ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-secondary-100 hover:text-white"
              }`}
            >
              Anterior
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-4 py-2 rounded-md border border-secondary-200 ${
                  currentPage === pageNumber
                    ? "bg-secondary-100 text-white"
                    : "hover:bg-secondary-100 hover:text-white"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md border border-secondary-200 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-secondary-100 hover:text-white"
              }`}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
      {showNotification && (
        <div className="absolute top-4 right-5 space-y-4">
          {notifications.map((notification, index) => (
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

export default HomeComponent;
