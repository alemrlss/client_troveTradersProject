/* eslint-disable react/prop-types */
import CreatePost from "./CreatePost";
import { SocketContext } from "../../contexts/socketContext";
import { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

function CrearProductoComponent({ user }) {
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
      setRedirectToCompletionBlocked(true);
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
  return (
    <div className="">
      <CreatePost />
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

export default CrearProductoComponent;
