/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import "../Modal.css";
function ModalTrades({ isOpen, closeModal, trades }) {
  const handleCloseModal = () => {
    closeModal();
  };

  return (
    <article className={`modal ${isOpen && "is-open"}`}>
      <div className="modal-container">
        <h1 className="text-4xl  mb-4">Trades en ejecucion</h1>{" "}
        {trades.length === 0 ? (
          <div className="p-4 mb-4 border rounded bg-gray-100">
            <p className="text-gray-500">No hay trades en ejecucion.</p>
          </div>
        ) : (
          trades.map((trade) => (
            <div key={trade._id} className="mb-4">
              <p className="font-bold">{trade.titlePost}</p>
              <p className="text-gray-500">Precio: ${trade.price}</p>
              <p className="text-gray-500">Vendedor: {trade.nameSeller}</p>
              <p className="text-gray-500">Comprador: {trade.nameBuyer}</p>
              <Link to={`/trade/${trade._id}`}>
                <button
                  onClick={() => {
                    closeModal();
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
                >
                  Ver Trade
                </button>
              </Link>
            </div>
          ))
        )}
        <div className="modal-navbar flex">
          <button className="bg-red-400" onClick={handleCloseModal}>
            Cerrar MODAL
          </button>
        </div>
        <div></div>
      </div>
    </article>
  );
}

export default ModalTrades;
