/* eslint-disable react/prop-types */

import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/socketContext";
import { getIdUser } from "../../services/Auth";
import axios from "axios";
function HomeComponent({ posts }) {
  useEffect(() => {
    if (socket) {
      socket.on("newNotification", (notification) => {
        // Manejar la notificación recibida desde el servidor
        console.log("Nueva notificación recibida:", notification);
        // Puedes realizar otras acciones con la notificación, como mostrarla en la interfaz de usuario
      });
    }
    return () => {
      if (socket) {
        socket.off("newNotification");
      }
    };
  }, []);

  //!Estado
  const [dataPosts] = useState(posts);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  //!Contexto.
  const socket = useContext(SocketContext);

  const showAndHideNotification = (msgError, messageHTML, bgColor) => {
    // Verificar si la notificación ya existe en el estado de notificaciones
    const notificationExists = notifications.some(
      (notification) => notification.msgError === msgError
    );

    if (!notificationExists) {
      console.log(notificationExists);
      setShowNotification(true);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { msgError, messageHTML, bgColor },
      ]);
    }
  };

  //!UseEffect para las notificaciones...
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

  const sendNotification = (authorId, msgNotification) => {
    if (socket) {
      socket.emit("notification", { authorId, msgNotification });
    }
  };
  const getNameBuyer = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${id}`);
      return response.data.name || "Private Account";
    } catch (error) {
      return `Ha ocurrido un error: ${error}`;
    }
  };
  const handleBuyClick = async ({ author_id, title }, nameBuyer) => {
    setIsButtonDisabled(true);
    const message = `${nameBuyer} ha intentado comprar tu producto con el título:${title}`;

    try {
      const response = await axios.post("http://localhost:3001/notifications", {
        sellerId: author_id,
        message,
      });
      console.log("Notificación creada:", response.data);
      sendNotification(author_id, message);

      setTimeout(() => {
        setIsButtonDisabled(false); // Habilitar el botón después de 4 segundos
      }, 4000);
    } catch (error) {
      console.error("Error al crear la notificación:", error);
      setIsButtonDisabled(false);
    }
  };

  return (
    <div>
      <h2>Es hora de mapiar todos los posts que vienen del backend...</h2>
      <div className="grid grid-cols-3 gap-4 bg-orange-300 p-4">
        {dataPosts.map((post) => (
          <div key={post._id} className="bg-white shadow rounded p-4">
            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            <p className="text-gray-600">{post.description}</p>
            <button
              onClick={() => {
                if (post.author_id === getIdUser()) {
                  const msgError = "No puedes comprarte a ti mismo...";
                  const msgErrorHTML = (
                    <p className="text-xl">
                      <b>{msgError}</b>
                    </p>
                  );
                  showAndHideNotification(msgError, msgErrorHTML, "bg-red-300");
                } else {
                  getNameBuyer(getIdUser()).then((nameBuyer) => {
                    const msgError = "Has solicitado comprar el Objeto ";
                    const msgHTML = (
                      <p className="text-xl">
                        <b>{nameBuyer}</b>, {msgError}
                        <i>{post.title}</i>
                      </p>
                    );
                    showAndHideNotification(msgError, msgHTML, "bg-green-400");
                    handleBuyClick(post, nameBuyer);
                  });
                }
              }}
              disabled={isButtonDisabled}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Comprar
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          console.log(getIdUser());
        }}
      >
        Get my id
      </button>

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

export default HomeComponent;
