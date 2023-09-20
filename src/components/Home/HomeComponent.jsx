/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/socketContext";
import { Link } from "react-router-dom";
import Categories from "./Categories";
import Panel from "./Panel";
import Carousel from "./Carousel";
import Guiahome from "./Guiahome";
import Barra from "./Barra";

function HomeComponent({ posts }) {
  //^  Contexto.
  const socket = useContext(SocketContext);

  const [dataPosts] = useState(posts);
  //~ Estados (showNotification y notifications) es para las notificaciones.. dataPosts son todos los posts
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);

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

      {/* Carousel de la homePage */}
      <Carousel />
      <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
      <Guiahome />
      <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
      {/* Contenedor de la homePage */}

      {/* Contenedor de Productos */}
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Productos disponibles
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {dataPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {/* Imágenes del post */}
              <div className="relative aspect-w-2 aspect-h-1">
                <div className="absolute inset-0">
                  {post.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={`http://localhost:3001/images/posts/${photo}`}
                      alt={`Foto ${index + 1}`}
                      className={`object-cover w-full h-full transition-opacity duration-300 ease-in-out transform hover:scale-105 ${
                        index === 0 ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="p-4">
                {/* Fecha de creación */}
                <p className="text-gray-400 text-right text-xs p-1 mt-2">
                  Creado: {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <h3 className="text-base font-semibold text-gray-900">
                  {post.title}
                </h3>
                <p className="text-gray-600 mt-1 leading-5 text-sm">
                  {post.description.slice(0, 30)}
                  {post.description.length > 30 && "..."}
                </p>

                {/* Información del precio */}
                <p className="text-gray-900 font-bold mt-1">
                  Precio: {post.price}$
                </p>

                {/* Botón de "Más información" */}
                <Link to={`/post/${post._id}`} className="block mt-4">
                  <button className="bg-secondary-100 hover:opacity-95 rounded-r-xl text-white font-semibold py-2 px-3 rounded-xs full w-full">
                    Ver mas
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
      {/*<CreatePost />*/}
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
