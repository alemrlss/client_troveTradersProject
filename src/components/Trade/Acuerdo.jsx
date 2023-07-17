import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/socketContext";
import axios from "axios";

/* eslint-disable react/prop-types */
function Acuerdo({
  post,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  currentState,
  role,
  setCurrentState,
  trade,
  sellerData,
  buyerData,
}) {
  const socket = useContext(SocketContext);

  const [agreementConfirmedSeller, setAgreementConfirmedSeller] = useState(
    localStorage.getItem(`sellerConfirmed:${trade._id}`) === "true"
  );
  const [agreementConfirmedBuyer, setAgreementConfirmedBuyer] = useState(
    localStorage.getItem(`buyerConfirmed:${trade._id}`) === "true"
  );

  const [sellerConfirmed, setSellerConfirmed] = useState(
    localStorage.getItem(`sellerConfirmed:${trade._id}`) === "true"
  );
  const [buyerConfirmed, setBuyerConfirmed] = useState(
    localStorage.getItem(`buyerConfirmed:${trade._id}`) === "true"
  );

  useEffect(() => {
    // ...
    // Escuchar evento de confirmación del vendedor
    socket.on("sellerConfirmed", () => {
      setSellerConfirmed(true);
      setAgreementConfirmedSeller(true);
      localStorage.setItem(`sellerConfirmed:${trade._id}`, "true");
    });

    // Escuchar evento de confirmación del comprador
    socket.on("buyerConfirmed", () => {
      setBuyerConfirmed(true);
      setAgreementConfirmedBuyer(true);
      localStorage.setItem(`buyerConfirmed:${trade._id}`, "true");
    });

    return () => {
      // Desuscribirse de los eventos
      socket.off("sellerConfirmed");
      socket.off("buyerConfirmed");
    };
  }, [socket, post]);
  useEffect(() => {
    // Verificar si ambos usuarios han confirmado el acuerdo
    if (sellerConfirmed && buyerConfirmed) {
      axios
        .put(`http://localhost:3001/posts/${post._id}`, {
          newState: "pago", // Cambiar al estado "pago"
        })
        .then((response) => {
          console.log(response.data);
          setCurrentState("pago");
          // Manejar la respuesta de la petición si es necesario
        })
        .catch((error) => {
          console.error("Error al actualizar el estado del post:", error);
        });

      setCurrentState("pago");
      localStorage.removeItem(`sellerConfirmed:${trade._id}`);
      localStorage.removeItem(`buyerConfirmed:${trade._id}`);
    }
  }, [sellerConfirmed, buyerConfirmed]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-center mb-6">
        <div className="w-1/2 ml-4">
          <h2 className="text-3xl text-gray-400">Eres el {role}</h2>
          <h2 className="text-3xl mb-4 text-right font-bold">
            Estado: {currentState}
          </h2>
          <hr className="" />
          <h2 className="text-2xl font-bold mb-4 pt-2 text-center">
            {post.title}
          </h2>
          <p className="text-lg mb-2 text-center">{post.description}</p>
          <p className="text-xl">
            <b>Precio:</b> {post.price}
          </p>
          {/* Agrega aquí la visualización de las fotos del producto */}
          <div className="flex space-x-2 mt-2 text-">
            {post.photos.map((photo, index) => (
              <img
                key={index}
                src={`http://localhost:3001/images/posts/${photo}`}
                alt={post.title}
                className="w-40 h-auto mt-4 rounded-md m-4"
              />
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                if (role === "vendedor") {
                  const message = "El vendedor está de acuerdo";
                  // Emitir evento de confirmación del vendedor
                  socket.emit("sellerConfirmed", {
                    tradeId: trade._id,
                    message,
                  });
                } else if (role === "comprador") {
                  const message = "El comprador está de acuerdo";
                  // Emitir evento de confirmación del comprador
                  socket.emit("buyerConfirmed", {
                    tradeId: trade._id,
                    message,
                  });
                }
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-6 rounded mr-2 font-bold"
            >
              Estoy de Acuerdo
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-6 rounded">
              Cancelar Trade
            </button>
          </div>
        </div>

        {/* Columna del chat */}
        <div className="flex-1 max-h-96 ml-6">
          <h1 className="text-3xl font-bold mb-1 text-white text-center">
            Trade Chat
          </h1>
          <p className="text-center font-bold text-gray-400 text-xs pb-1">
            Ponte de acuerdo con la otra parte para seguir con el tradeo...
          </p>
          <div className="border border-gray-800 p-4 mb-4 max-w-md h-full overflow-y-auto center bg-slate-400 w-2/3 rounded-md mx-auto">
            {messages.map((message, index) => (
              <div key={index} className="mb-2 text-black">
                <strong>{message.username}: </strong>
                {message.message}
              </div>
            ))}
          </div>

          {/* Campo de entrada y botón de enviar mensaje */}
          <div className="flex w-2/3 mx-auto">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 mr-2 px-4 py-2 border border-gray-300 rounded"
              placeholder="Escribe un mensaje..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
          {agreementConfirmedSeller && (
            <p className="bg-orange-500 text-white font-bold px-4 py-2 rounded">
              ¡El Vendedor<b> {trade.nameSeller}</b> esta de acuerdo para
              iniciar el Trade!
            </p>
          )}
          {agreementConfirmedBuyer && (
            <p className="bg-green-500 text-gray-900 font-bold px-4 py-2 rounded">
              ¡El Comprador <b>{trade.nameBuyer}</b> esta de acuerdo para
              iniciar el Trade!
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex w-1/2 flex-col items-center  shadow-md rounded-lg bg-pink-300 ml-6 mr-6 mt-4 p-12">
          <h2 className="text-2xl mb-5"> Vendedor</h2>
          <img
            src={`http://localhost:3001/image/profile/${sellerData.imageProfile}`}
            alt="Foto del vendedor"
            className="w-20 h-20 rounded-full mb-4"
          />
          <h2 className="text-xl font-bold">
            {sellerData.name} {sellerData.lastName}
          </h2>
          <div className="flex items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-yellow-500 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18.56 7.81a1 1 0 0 1 .24 1.09l-1.5 4.61a1 1 0 0 1-.96.68H13v5.1a1 1 0 0 1-.67.94l-4.56 1.52a1 1 0 0 1-1.18-1.3L7 18.35V13H3.5a1 1 0 0 1-.96-.68l-1.5-4.61a1 1 0 0 1 .24-1.09l4.56-4.19a1 1 0 0 1 1.37.17L10 4.35l3.79-2.76a1 1 0 0 1 1.37-.17l4.56 4.19zm-2.76 2.3a1 1 0 0 1-.28.34L10 15.65l-5.52-3.2a1 1 0 0 1-.3-.33L5.29 5h5.42l2.53 5.1a1 1 0 0 1-.29.31zm-9.45 1.48l1.26 3.87 1.28-3.87h-2.54zM10 11a1 1 0 0 1 .68.28l2.52 2.31-1.26-3.87L10 11zm-7-7.5A1.5 1.5 0 0 1 4.5 3h11a1.5 1.5 0 0 1 1.5 1.5V5h-14V3.5zM3.5 7h13v6.69l-2.98-1.22a1 1 0 0 0-1.27.55L10 17l-1.25-3.98a1 1 0 0 0-1.27-.55L3.5 13.69V7z"
              />
            </svg>
            <span className="text-yellow-500 text-2xl">4.8</span>
          </div>
          <p className="text-gray-600 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            eget ligula non tellus laoreet pretium. Nulla aliquet justo nec
            purus scelerisque, vitae fringilla ex congue.
          </p>
          {/* Otra información relevante del vendedor */}
        </div>
        <div className="flex w-1/2 flex-col items-center  shadow-md rounded-lg bg-gray-300 ml-6 mr-6 mt-4 p-12">
          <h2 className="text-2xl mb-5"> Comprador</h2>
          <img
            src={`http://localhost:3001/image/profile/${buyerData.imageProfile}`}
            alt="Foto del vendedor"
            className="w-20 h-20 rounded-full mb-4"
          />
          <h2 className="text-xl font-bold">
            {buyerData.name} {buyerData.lastName}
          </h2>
          <div className="flex items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-yellow-500 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18.56 7.81a1 1 0 0 1 .24 1.09l-1.5 4.61a1 1 0 0 1-.96.68H13v5.1a1 1 0 0 1-.67.94l-4.56 1.52a1 1 0 0 1-1.18-1.3L7 18.35V13H3.5a1 1 0 0 1-.96-.68l-1.5-4.61a1 1 0 0 1 .24-1.09l4.56-4.19a1 1 0 0 1 1.37.17L10 4.35l3.79-2.76a1 1 0 0 1 1.37-.17l4.56 4.19zm-2.76 2.3a1 1 0 0 1-.28.34L10 15.65l-5.52-3.2a1 1 0 0 1-.3-.33L5.29 5h5.42l2.53 5.1a1 1 0 0 1-.29.31zm-9.45 1.48l1.26 3.87 1.28-3.87h-2.54zM10 11a1 1 0 0 1 .68.28l2.52 2.31-1.26-3.87L10 11zm-7-7.5A1.5 1.5 0 0 1 4.5 3h11a1.5 1.5 0 0 1 1.5 1.5V5h-14V3.5zM3.5 7h13v6.69l-2.98-1.22a1 1 0 0 0-1.27.55L10 17l-1.25-3.98a1 1 0 0 0-1.27-.55L3.5 13.69V7z"
              />
            </svg>
            <span className="text-yellow-500">2.3</span>
          </div>
          <p className="text-gray-600 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            eget ligula non tellus laoreet pretium. Nulla aliquet justo nec
            purus scelerisque, vitae fringilla ex congue.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Acuerdo;
