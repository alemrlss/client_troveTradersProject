/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/socketContext";
import { Link } from "react-router-dom";
import CreatePost from "./CreatePost";
import axios from "axios";

function HomeComponent({ posts, user }) {
  //^  Contexto.
  const socket = useContext(SocketContext);
  const [isVisible, setIsVisible] = useState(false);

  //~ Estados (showNotification y notifications) es para las notificaciones.. dataPosts son todos los posts
  const [dataPosts] = useState(posts);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [verificationEmailUser] = useState(user.verificationEmail);
  const [emailSend, setEmailSend] = useState(false);

  //!UseEffect para la escucha de las notificaciones
  useEffect(() => {
    setIsVisible(true);
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
  const MAX_IMAGES = 4;
  return (
    <div className="container mx-auto px-4">
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

      {/* Filtros */}
      <div className="flex items-center justify-between m-4">
        <form className="relative w-full max-w-md mr-4">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary-300 placeholder-gray-400"
            placeholder="Buscar publicaciones..."
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Buscar
          </button>
        </form>

        {/* Botón para crear una publicación */}
        <Link to="/crear-publicacion">
          <button className="bg-primary-200 hover:bg-primary-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Crear publicación
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-300 p-4">
        {dataPosts.map((post) => (
          <div
            key={post._id}
            className={`bg-white shadow rounded p-6 m-2  hover:scale-105 transition-opacity duration-1000 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
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
              {post.photos.slice(0, MAX_IMAGES).map((photo, index) => (
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
      <ul>
        <li
          className={`transition-opacity duration-1000 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          Elemento 1
        </li>
        <li
          className={`transition-opacity duration-1000 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          Elemento 2
        </li>
        <li
          className={`transition-opacity duration-1000 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          Elemento 3
        </li>
      </ul>
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
