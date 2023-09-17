/* eslint-disable react/prop-types */
import axios from "axios";
import { FaBell } from "react-icons/fa";

function NotificationsComponent({
  idUser,
  setNotifications,
  isOpen,
  setIsOpen,
}) {
  const loadNotifications = () => {
    // Realiza la solicitud al servidor para obtener las notificaciones
    // Puedes usar axios o cualquier otra librería para hacer la solicitud HTTP
    axios
      .get(`http://localhost:3001/notifications/${idUser}`)
      .then((response) => {
        // Actualiza el estado con las notificaciones obtenidas del servidor
        //Reversed: para que las notificaciones más recientes aparezcan primero
        const reversed = response.data.reverse();
        setNotifications(reversed);
      })
      .catch((error) => {
        // Manejo de errores si la solicitud falla
        console.log(error);
      });
  };
  const handleNotificationsClick = () => {
    if (isOpen) {
      setIsOpen(!isOpen);
    } else {
      setIsOpen(!isOpen);
      loadNotifications();
    }
  };

  return (
    <button className="text-secondary-100 p-3 hover:text-gray-300">
      <FaBell className="w-6 h-6" onClick={handleNotificationsClick} />
    </button>
  );
}

export default NotificationsComponent;
