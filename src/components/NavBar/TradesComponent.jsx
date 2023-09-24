/* eslint-disable react/prop-types */

import axios from "axios";
import { AiOutlineTeam } from "react-icons/ai";
function TradesComponent({
  openModal,
  setTrades,
  id,
  isOpenTrade,
  setIsOpenTrade,
  isOpen,
  setIsOpen,
  isOpenRequest,
  setIsOpenRequest,
}) {
  const getRequestsUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/${id}/trades`
      );
      const data = response.data;

      setTrades(data);
      setIsOpenTrade(!isOpenTrade);

      if (isOpen) setIsOpen(false);
      if (isOpenRequest) setIsOpenRequest(false);
    } catch (error) {
      console.error("Error al obtener las solicitudes:", error);
    }
  };

  return (
    <button
      data-tooltip-id="my-tooltip-trades"
      onClick={getRequestsUser}
      className="text-secondary-100 p-3 "
    >
      <AiOutlineTeam className="h-6 w-6" />
    </button>
  );
}

export default TradesComponent;
