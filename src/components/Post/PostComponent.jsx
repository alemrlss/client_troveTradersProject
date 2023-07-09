/* eslint-disable react/prop-types */
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { SocketContext } from "../../contexts/socketContext";
import { getIdUser } from "../../services/Auth";

function PostComponent({ post }) {

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
    }, 2000);

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


  //? Funcion para obtener el nombre del vendedor(Promise)
  const getNameBuyer = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${id}`);
      return response.data.name || "Private Account";
    } catch (error) {
      return `Ha ocurrido un error: ${error}`;
    }
  };


  //? Funcion para enviar la notificacion al socket de socket.io
  const sendNotification = (authorId, msgNotification) => {
    if (socket) {
      socket.emit("notification", { authorId, msgNotification });
    }
  };

  //? Funcion manejadora del evento compra(Peticion al servidor para guardar la notificacion)
  const handleBuyClick = async ({ author_id, title }, nameBuyer) => {
    //setIsButtonDisabled(true);
    const message = `${nameBuyer} ha intentado comprar tu producto con el título:${title}`;

    try {
      const response = await axios.post("http://localhost:3001/notifications", {
        sellerId: author_id,
        message,
      });
      console.log("Notificación creada:", response.data);
      sendNotification(author_id, message);

      setTimeout(() => {
        //  setIsButtonDisabled(false); // Habilitar el botón después de 4 segundos
      }, 4000);
    } catch (error) {
      console.error("Error al crear la notificación:", error);
      // setIsButtonDisabled(false);
    }
  };

 
  return (
    <div>
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-4xl font-bold mb-4">{post.title}</h2>
          <p className="text-gray-600 mb-4">{post.description}</p>
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
                  const msg = "Has solicitado comprar el Objeto ";
                  const msgHTML = (
                    <p className="text-xl">
                      <b>{nameBuyer}</b>, {msg}
                      <i>{post.title}</i>
                    </p>
                  );
                  showAndHideNotification(msg, msgHTML, "bg-green-400");
                  handleBuyClick(post, nameBuyer);
                });
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Comprar
          </button>
        </div>
      </div>
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

export default PostComponent;
