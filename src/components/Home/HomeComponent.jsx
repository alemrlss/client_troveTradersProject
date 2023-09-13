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


function HomeComponent({posts}) {
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
      {/* Mensaje de verificación de correo electrónico 
        {!verificationEmailUser && (
          <div className="text-sm flex items-center">
            <p className="text-sm">
              Por favor, verifica tu correo electrónico para acceder a todas las
              funciones de la aplicación.
            </p>

            {emailSend && (
              <p className="text-green-600 font-bold text-lg">
                ¡Correo enviado con éxito a: {user.email}!
              </p>
            )}
            {!emailSend && (
              <button
                className="bg-primary-100 hover:bg-primary-200 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2"
                onClick={handleSendEmailVerification}
              >
                Enviar correo de verificación
              </button>
            )}
          </div>
        )}*/}
      <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
      {/* Panel de la homePage */}
      <Panel />
      <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
      {/* Carousel de la homePage */}
      <Carousel />
      <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
      <Guiahome />
      <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
      {/* Contenedor de la homePage */}
      <Categories />
      <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />

      {/* Contenedor de Productos */}
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Productos disponibles
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 bg-white">
          {dataPosts.map((post) => (
            <div
              key={post._id}
              className={`bg-white shadow rounded p-6 m-2 animate-fade animate-once animate-duration-[2000ms] animate-delay-100`}
            >
              <div className="">
                {/* Imágenes del post */}
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  {post.photos.slice(0, 1).map((photo, index) => (
                    <img
                      key={index}
                      src={`http://localhost:3001/images/posts/${photo}`}
                      alt={`Foto ${index + 1}`}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  ))}
                </div>
                {/* Datos de cada publicación */}
                <h3 className="text-sm text-gray-700">{post.title}</h3>
                <p className="text-gray-600">{post.description}</p>

                {/* Información del precio */}
                <p className="text-green-600 font-bold mt-2">
                  Precio: {post.price} $
                </p>

                {/* Fecha de creación */}
                <p className="text-gray-400 mt-2">
                  Creado: {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              {/* Botón de "Más información" */}
              <Link to={`/post/${post._id}`} className="block mt-4 text-center">
                <button className="bg-primary-200 hover:bg-primary-300 text-white font-bold py-2 px-4 rounded">
                  Más información
                </button>
              </Link>
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
