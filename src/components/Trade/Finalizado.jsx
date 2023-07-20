/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { getIdUser } from "../../services/Auth";

function Finalizado({ trade }) {
  const [qualification, setQualification] = useState(0);

  const handleCalificar = (rating) => {
    setQualification(rating);
    // Aquí podrías enviar la calificación al servidor o realizar otras acciones necesarias.
  };

  const handleClasificado = () => {
    if (qualification === 0) {
      alert("Por favor, califica tu experiencia.");
    } else {
      axios
        .put(`http://localhost:3001/users/trades/${trade._id}/${getIdUser()}`)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });

      alert("¡Gracias por calificar tu experiencia!");
    }
  };

  return (
    <div className="finalizado-component p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-2">
        ¡Has finalizado la compra con éxito! 
      </h2>
      <p className="mb-2">Por favor, califica tu experiencia para Finalizar el Trade:</p>
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((rating) => (
          <span
            key={rating}
            className={`text-2xl cursor-pointer ${
              rating <= qualification ? "text-yellow-500" : "text-gray-400"
            }`}
            onClick={() => handleCalificar(rating)}
          >
            ★
          </span>
        ))}
      </div>
      <button
        onClick={handleClasificado}
        className="bg-blue-500 text-white font-bold py-2 px-4 mt-4 rounded"
      >
        ¡Ya he calificado!
      </button>
    </div>
  );
}

export default Finalizado;
