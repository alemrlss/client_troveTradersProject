/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import axios from "axios";
import { getIdUser } from "../../services/Auth";
import { FaStar } from "react-icons/fa";
import { AiOutlineWarning } from "react-icons/ai";
import { MdCheckCircle } from "react-icons/md"; // Import the check circle icon
import { RiHome2Line } from "react-icons/ri"; // Import the home icon

function Finalizado({ trade, role, seller, buyer }) {
  const [qualification, setQualification] = useState(0);
  const [comment, setComment] = useState("");
  const [presetComments] = useState([
    "Buen Trade",
    "Seguro y confiable",
    "Rápido en Contestar",
  ]);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleCalificar = (rating) => {
    setQualification(rating);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handlePresetCommentClick = (presetComment) => {
    setComment(presetComment);
  };

  const handleClasificadoBuyer = async () => {
    if (qualification === 0) {
      setError("Por favor, califica tu experiencia antes de finalizar.");
      return; // Stop execution
    }

    if (comment.trim() === "") {
      setError("Por favor, agrega un comentario antes de finalizar.");
      return; // Stop execution
    }
    setError("");

    try {
      const ratingData = {
        newRating: qualification,
        comment: comment,
      };
      await axios.post(
        `http://localhost:3001/users/rateUser/${trade.sellerID}`,
        ratingData
      );
      await axios.put(
        `http://localhost:3001/users/trades/${trade._id}/${getIdUser()}`
      );

      setIsSuccess(true);
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } catch (error) {
      console.error(
        "Error al finalizar el trade o enviar calificación:",
        error
      );
    }
  };

  const handleClasificadoSeller = async () => {
    if (qualification === 0) {
      setError("Por favor, califica tu experiencia antes de finalizar.");
      return;
    }

    if (comment.trim() === "") {
      setError("Por favor, agrega un comentario antes de finalizar.");
      return;
    }
    setError("");

    try {
      const ratingData = {
        newRating: qualification,
        comment: comment,
      };
      await axios.post(
        `http://localhost:3001/users/rateUser/${trade.buyerID}`,
        ratingData
      );
      await axios.put(
        `http://localhost:3001/users/trades/${trade._id}/${getIdUser()}`
      );

      setIsSuccess(true);
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } catch (error) {
      console.error(
        "Error al finalizar el trade o enviar calificación:",
        error
      );
    }
  };

  return (
    <div className="flex flex-col h-screen mt-10">
      <div className="flex justify-center mb-6">
        <div className="w-1/2 ml-4">
          <h2 className="text-gray-400 mb-2 text-lg">Eres el {role}</h2>
          <hr className="" />
          <p className="mb-4 text-center text-gray-800 mt-3 text-lg">
            Para finalizar el trade exitosamente, es necesario calificar a la
            contraparte. La calificación mínima es de 1 estrella y la máxima es
            de 5 estrellas. Puede dejar un comentario opcional o utilizar el
            autocompletado proporcionado.{" "}
          </p>

          <div className="flex items-center bg-yellow-300 rounded-sm p-2">
            <AiOutlineWarning className="h-10 w-10 text-yellow-2 font-bold" />
            <p className="text-black text-xs font-semibold text-center items-center">
              Recuerda que si no calificas a la contraparte, el trade no
              avanzará de estado, manteniéndose como un trade en ejecución.
            </p>
          </div>
          <div className="finalizado-component p-4 bg-gray-100 rounded-xl mt-4">
            <h2 className="text-xl font-bold mb-4">
              ¡Trade finalizado con éxito!
            </h2>
            <p className="mb-2">
              ¡Has completado exitosamente el trade! Por favor, califica tu
              experiencia.
            </p>
            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <span
                  key={rating}
                  className={`text-3xl cursor-pointer ${
                    rating <= qualification
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                  onClick={() => handleCalificar(rating)}
                >
                  <FaStar />
                </span>
              ))}
              <span className="text-xl ml-2">{qualification}/5</span>
            </div>
            <div className="mb-4">
              <textarea
                className="w-full p-2 border rounded resize-none"
                placeholder="Deja un comentario...(Maximo 50 Caracteres)"
                value={comment}
                onChange={handleCommentChange}
                maxLength={50}
              />
              <div className="flex flex-wrap mt-2">
                {presetComments.map((presetComment) => (
                  <button
                    key={presetComment}
                    className="bg-blue-200 text-blue-700 px-2 py-1 m-1 rounded cursor-pointer"
                    onClick={() => handlePresetCommentClick(presetComment)}
                  >
                    {presetComment}
                  </button>
                ))}
              </div>
            </div>
            {buyer && (
              <button
                onClick={handleClasificadoBuyer}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Finalizar del buyer
              </button>
            )}
            {seller && (
              <button
                onClick={handleClasificadoSeller}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Finalizar del seller
              </button>
            )}
            {error && <div className="text-red-600 mt-2">{error}</div>}
            {isSuccess && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-80"></div>
                <div className="bg-white p-6 rounded shadow-md z-10 text-center">
                  <MdCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">
                    Calificación exitosa
                  </p>
                  <p>Serás redirigido al Home en unos segundos...</p>
                  <div className="mt-4">
                    <RiHome2Line className="text-blue-500 text-xl inline-block mr-2 cursor-pointer" />
                    <span
                      className="text-sm text-blue-500 cursor-pointer"
                      onClick={() => {
                        navigate("/home");
                      }}
                    >
                      Ir al Home ahora
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Finalizado;
