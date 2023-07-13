/* eslint-disable react-hooks/rules-of-hooks */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../services/Auth";
import Loader from "../components/Loader/Loader";
import ProfileMain from "../components/profile/ProfileMain";

import { useContext } from "react";
import { SocketContext } from "../contexts/socketContext";

function profile() {
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

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/users/${id}`,
          config
        );
        setLoading(false);
        setData(response.data);
      } catch (error) {
        console.log(error); //PROGRAMAR ERROR.
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = {
    width: 100,
    height: 100,
  };

  return (
    <div>
      {loading && <Loader options={options} />}
      {data && <ProfileMain data={data} />}
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
  );
}

export default profile;
