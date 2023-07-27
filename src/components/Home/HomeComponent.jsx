/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/socketContext";
import { Link } from "react-router-dom";
import axios from "axios";
import CreatePost from "./CreatePost";
import Categories from "./Categories";
import BannerArea from "./BannerArea";
import Panel from "./Panel";

function HomeComponent({ posts, user }) {
  //^  Contexto.
  const socket = useContext(SocketContext);

  //~ Estados (showNotification y notifications) es para las notificaciones.. dataPosts son todos los posts
  const [dataPosts] = useState(posts);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [verificationEmailUser] = useState(user.verificationEmail);
  const [emailSend, setEmailSend] = useState(false);

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

  const handleSendEmailVerification = async () => {
    try {
      // Realizar la solicitud al endpoint del backend para enviar el correo de verificación
      const response = await axios.post(
        "http://localhost:3001/auth/verification-email",
        {
          email: user.email,
        }
      );

      // Manejar la respuesta del backend si es necesario (por ejemplo, mostrar una notificación de éxito)
      console.log(response.data);
      setEmailSend(true);
    } catch (error) {
      // Manejar el error si ocurriera algún problema con la solicitud al backend
      console.error(
        "Error al enviar el correo de verificación:",
        error.message
      );
    }
  };

  return (
    <body className="">
      {/* Mensaje de verificación de correo electrónico */}
      {!verificationEmailUser && (
        <div className="text-lg mb-4 flex items-center m-2">
          <p className="m-1 text-xl">
            Por favor, verifica tu correo electrónico para acceder a todas las
            funciones de la aplicación.
          </p>

          {emailSend && (
            <p className="text-green-600 font-bold m-1 text-lg">
              ¡Correo enviado con éxito a: {user.email}!
            </p>
          )}
          {!emailSend && (
            <button
              className="bg-primary-300 hover:bg-primary-200 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSendEmailVerification}
            >
              Enviar correo de verificación
            </button>
          )}
        </div>
      )}

      {/* Panel de la homePage */}
      <Panel />
      {/* Banner de la homePage */}
      <BannerArea />
      {/* Contenedor de la homePage */}
      <div className="container mx-auto px-4 sm:px-8 md:px-24">
        <Categories />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-300 p-4">
          {dataPosts.map((post) => (
            <div
              key={post._id}
              className={`bg-white shadow rounded p-6 m-2 animate-fade animate-once animate-duration-[2000ms] animate-delay-100`}
            >
              {/* Datos de cada publicación */}
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-gray-600">{post.description}</p>

              {/* Información del precio */}
              <p className="text-green-600 font-bold mt-2">
                Precio: {post.price} $
              </p>

              {/* Fecha de creación */}
              <p className="text-gray-400 mt-2">
                Creado: {new Date(post.createdAt).toLocaleDateString()}
              </p>

              {/* Imágenes del post */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
                {post.photos.slice(0, 4).map((photo, index) => (
                  <img
                    key={index}
                    src={`http://localhost:3001/images/posts/${photo}`}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
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
        <CreatePost />
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
    </body>
  );
}

export default HomeComponent;
