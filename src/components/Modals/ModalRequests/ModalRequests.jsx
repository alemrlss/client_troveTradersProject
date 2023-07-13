/* eslint-disable react/prop-types */
import "../Modal.css";
import axios from "axios";

function ModalRequests({
  isOpen,
  closeModal,
  requests,
  setRequests,
  idUser,
  sendNotification,
}) {
  const handleCloseModal = () => {
    closeModal();
  };

  //Funcion para dar formato a la hora
  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString(undefined, options);

    return formattedDate;
  }

  const handleAccept = () => {
    console.log("Has aceptado");
  };

  const handleReject = async (request) => {
    console.log(request);
    try {
      await axios.delete(
        `http://localhost:3001/users/${idUser}/requests/${request._id}`
      );
      const updatedRequests = requests.filter((r) => r._id !== request._id);
      setRequests(updatedRequests);

      await axios.post("http://localhost:3001/notifications", {
        sellerId: request.buyerID, 
        message:`El vendedor ${request.nameSeller} ha rechazado tu solicitud por la compra del articulo: ${request.titlePost}}}`,
      });
      sendNotification(
        request.buyerID,
        `El vendedor ${request.nameSeller} ha rechazado tu solicitud por la compra del articulo: ${request.titlePost}}`,
        "bg-pink-400"
      );
      closeModal();
    } catch (error) {
      console.error("Error al eliminar la solicitud:", error);
    }
  };

  return (
    <article className={`modal ${isOpen && "is-open"}`}>
      <div className="modal-container">
        <h2 className="text-4xl  mb-4">Solicitudes</h2>
        <h2>
          {requests.length === 0 ? (
            <div className="p-4 mb-4 border rounded bg-gray-100">
              <p className="text-gray-500">No hay solicitudes disponibles.</p>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request._id}
                className="p-4 mb-4 border rounded flex items-center"
              >
                <div className="mr-4">
                  <p className="mb-2"> {request.message}</p>
                  <p className="mb-2">
                    Fecha de creación: {formatDate(request.createdAt)}
                  </p>
                </div>
                <div>
                  <button
                    className="px-4 py-2 mr-2 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                    onClick={handleAccept}
                  >
                    Aceptar
                  </button>
                  <button
                    className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                    onClick={() => {
                      handleReject(request);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </h2>
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

export default ModalRequests;
