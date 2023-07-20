/* eslint-disable react/prop-types */
import axios from "axios";
import { IoMdNotifications } from "react-icons/io";
import { IconContext } from "react-icons";
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
    <IconContext.Provider value={{ size: "2em" }}>
      <li className="bg-gray-300 cursor-pointer p-1">
        <IoMdNotifications onClick={handleNotificationsClick} />
      </li>
    </IconContext.Provider>
  );
}

export default NotificationsComponent;
