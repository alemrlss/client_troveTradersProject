/* eslint-disable react/prop-types */

import axios from "axios";
function TradesComponent({ openModal, setTrades }) {
  const getRequestsUser = async () => {
    try {
      const response = await axios.get("http://localhost:3001/posts");
      const data = response.data;

      console.log(data)
      setTrades(data);
      openModal();
    } catch (error) {
      console.error("Error al obtener las solicitudes:", error);
    }
  };
  
  return (
    <li>
      <button
        onClick={getRequestsUser}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Trades
      </button>
    </li>
  );
}

export default TradesComponent;
