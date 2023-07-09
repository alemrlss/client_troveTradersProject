/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import ProfileBody from "./ProfileBody";
import SidebarProfile from "./SidebarProfile";
import NavBar from "../NavBar/NavBar";
import { SocketContext } from "../../contexts/socketContext";
function ProfileMain({ data }) {
  //^  Contexto.
  const socket = useContext(SocketContext);

  //~ Estados (showNotification y notifications) es para las notificaciones..
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);

  //!UseEffect para la escucha de las notificaciones
  useEffect(() => {
    if (socket) {
      socket.on("newNotification", (msgNotification) => {
        // Manejar la notificación recibida desde el servidor

        const msgHTML = (
          <p>
            <b>{msgNotification}</b>
          </p>
        );
        console.log("Nueva notificación recibida:", msgNotification);
        showAndHideNotification(msgNotification, msgHTML, "bg-orange-400");

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
    const timer = setTimeout(() => {
      setShowNotification(false);
      setNotifications([]);
    }, 2500);

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
    <div>
      <NavBar />
      <div className="p-16 bg-green-300 h-screen">
        <div className=" h-full shadow-2xl bg-white flex rounded-md">
          <SidebarProfile data={data} />
          <ProfileBody data={data} />
          {showNotification && (
            <div className="absolute top-4 right-5 space-y-4">
              {notifications.map((notification, index) => (
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
        </div>
      </div>
    </div>
  );
}

export default ProfileMain;
