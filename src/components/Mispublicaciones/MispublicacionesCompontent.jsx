/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom"; // Importa Link para el botón
import { useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/socketContext";
import { Navigate } from "react-router-dom";
function MisPublicacionesComponent({ posts, user }) {
  //^  Contexto.
  const socket = useContext(SocketContext);

  //~ Estados (showNotification y notifications) es para las notificaciones..
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);

   //!Verificacion de cuenta bloqueada:
   const [redirectToCompletionBlocked, setRedirectToCompletionBlocked] =
   useState(!user.blocked);

 useEffect(() => {
   if (!user.redirectToCompletionBlocked) {
     setRedirectToCompletionBlocked(true)
   }
 }, [user.redirectToCompletionBlocked]);

 if (!redirectToCompletionBlocked) {
   return <Navigate to="/bloqueado" />;
 }


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

        // Puedes realizar otras acciones con la notificación, como mostrarla en la interfaz de usuario
      });
    }
    return () => {
      if (socket) {
        socket.off("newNotification");
      }
    };
  }, [socket]);

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

  //!Funcion para mostrar las Notificaciones
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
  const [selectedPost, setSelectedPost] = useState(null);

  const handleEditClick = (post) => {
    // Lógica para editar el post
    // Puedes redirigir a una página de edición aquí usando React Router
  };

  const handleDeleteClick = (post) => {
    // Lógica para eliminar el post
  };

  const handleCloseClick = () => {
    setSelectedPost(null);
  };

  const handleBackgroundClick = (e) => {
    // Verificar si el clic se realizó en el fondo oscuro (fuera de la información del post)
    if (e.target.classList.contains("bg-opacity-50")) {
      setSelectedPost(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Mis Publicaciones</h2>

      {posts.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600">Aún no tienes publicaciones activas.</p>
          <Link
            to="/crear-publicacion"
            className="text-secondary-100 hover:underline"
          >
            Crea una aquí
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <li
              key={post._id}
              className="bg-white rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={`http://localhost:3001/images/posts/${post.photos[0]}`}
                alt={`Foto de ${post.title}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="text-gray-600">{post.description}</p>
                <p className="text-blue-600 font-semibold">
                  Precio: ${post.price}
                </p>
                <p className="text-gray-600">Categoría: {post.category}</p>
                <p className="text-gray-600">
                  Fecha de Creación:{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="bg-secondary-100 text-white px-3 py-2 rounded-lg hover:opacity-90"
                  >
                    Ver Detalles
                  </button>
                  <button
                    onClick={() => handleEditClick(post)}
                    className="bg-secondary-300 text-white px-3 py-2 rounded-lg  hover:opacity-90"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClick(post)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedPost && (
        <div
          onClick={handleBackgroundClick}
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
        >
          <div className="bg-white rounded-lg overflow-hidden shadow-md w-96 p-4">
            <button
              onClick={handleCloseClick}
              className="absolute top-2 right-2 text-red-400 hover:text-red-500"
            >
              <FaTimes className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-semibold">{selectedPost.title}</h2>
            <p className="text-gray-600">{selectedPost.description}</p>
            <p className="text-blue-600 font-semibold">
              Precio: ${selectedPost.price}
            </p>
            <p className="text-gray-600">Categoría: {selectedPost.category}</p>
            <p className="text-gray-600">
              Fecha de Creación: {selectedPost.createdAt}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {selectedPost.photos.map((photo, index) => (
                <img
                  key={index}
                  src={`http://localhost:3001/images/posts/${photo}`}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-34 object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {showNotification && (
        <div className="absolute top-4 right-5 space-y-4">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className={`${notification.bgColor} text-gray-800 p-4 rounded-md shadow-md bg`}
            >
              {" "}
              {notification.messageHTML}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MisPublicacionesComponent;
