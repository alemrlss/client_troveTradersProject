/* eslint-disable react/prop-types */
import "../Modal.css";
function ModalTrades({ isOpen, closeModal, trades }) {
  const handleCloseModal = () => {
    closeModal();
  };

  return (
    <article className={`modal ${isOpen && "is-open"}`}>
      <div className="modal-container">
        <h1 className="text-4xl  mb-4">Trades</h1><h2>
          {trades.length > 0 ? (
            <p>{trades[0].description}</p>
          ) : (
            <p>No hay solicitudes disponibles.</p>

          )}
        </h2>
        <div className="modal-navbar flex">
          <h1>Contenido del modal</h1>
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
