/* eslint-disable react/prop-types */

import axios from "axios";
import { FaExchangeAlt } from "react-icons/fa";
function TradesComponent({ openModal, setTrades, id }) {
  const getRequestsUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/${id}/trades`
      );
      const data = response.data;

      setTrades(data);
      openModal();
    } catch (error) {
      console.error("Error al obtener las solicitudes:", error);
    }
  };

  return (
    <button
      onClick={getRequestsUser}
      className="text-secondary-100 p-3 hover:text-gray-300"
    >
      <FaExchangeAlt className="h-6 w-6" />
    </button>
  );
}

export default TradesComponent;
