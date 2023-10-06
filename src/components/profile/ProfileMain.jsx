/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import ProfileBody from "./ProfileBody";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../contexts/socketContext";
import { Link } from "react-router-dom";

function ProfileMain({ data, user }) {
  //^  Contexto.
  const socket = useContext(SocketContext);

  //~ Estados (showNotification y notifications) es para las notificaciones..
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
      <div>
        <div>
          <ProfileBody data={data} user={user} />
        </div>
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
    </div>
  );
}

export default ProfileMain;
