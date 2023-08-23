/* eslint-disable react/prop-types */
import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/socketContext";
import axios from "axios";
import { FaStar } from "react-icons/fa";

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

  const [sellerConfirmed, setSellerConfirmed] = useState(
    trade.agreementConfirmationSeller ? true : false
  );
  const [buyerConfirmed, setBuyerConfirmed] = useState(
    trade.agreementConfirmationBuyer ? true : false
  );

  //?Escuchar los eventos de confirmacion de ambas partes
  useEffect(() => {
    socket.on(`sellerConfirmed_${trade._id}`, () => {
      setSellerConfirmed(true);
      console.log("aqui");
    });

    socket.on(`buyerConfirmed_${trade._id}`, () => {
      setBuyerConfirmed(true);
      console.log("aqui");
    });

    return () => {
      socket.off(`sellerConfirmed_${trade._id}`);
      socket.off(`buyerConfirmed_${trade._id}`);
    };
  }, [socket, post, trade._id]);

  //?Cambiar el estado del post a "pago" cuando ambas partes esten de acuerdo
  useEffect(() => {
    if (sellerConfirmed && buyerConfirmed) {
      axios
        .put(`http://localhost:3001/posts/${post._id}`, {
          newState: "pago",
        })
        .then((response) => {
          console.log(response.data);
          setCurrentState("pago");
        })
        .catch((error) => {
          console.error("Error updating post state:", error);
        });
    }
  }, [sellerConfirmed, buyerConfirmed, trade._id, post._id, setCurrentState]);

  //?Confirmacion cuando el vendedor esta de acuerdo
  const handleConfirmAgreementSeller = () => {
    axios
      .post(
        `http://localhost:3001/users/trades/${trade._id}/${trade.sellerID}/${trade.buyerID}/confirmationAgreementSeller`
      )
      .then((response) => {
        console.log(response.data);
        const message = "El vendedor está de acuerdo";
        socket.emit("sellerConfirmed", {
          tradeId: trade._id,
          message,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //?Confirmacion cuando el comprador esta de acuerdo
  const handleConfirmAgreementBuyer = () => {
    axios
      .post(
        `http://localhost:3001/users/trades/${trade._id}/${trade.sellerID}/${trade.buyerID}/confirmationAgreementBuyer`
      )
      .then((response) => {
        console.log(response.data);
        const message = "El comprador está de acuerdo";
        socket.emit("buyerConfirmed", {
          tradeId: trade._id,
          message,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col p-4 md:p-8 lg:p-12">
      <div className="flex flex-col md:flex-row justify-center mb-6">
        <div className="w-full md:w-3/4 px-4 mb-4 md:mb-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-gray-400 mb-2 text-lg">Eres el {role}</h2>

            {(trade.agreementConfirmationSeller || sellerConfirmed) && (
              <p className=" bg-teal-200 text-black font-semibold px-4 py-2 rounded mt-4 m-2 mx-auto animate-fade-right animate-duration-[500ms] animate-delay-0">
                ¡El Vendedor <b>{trade.nameSeller}</b> está de acuerdo para
                iniciar el Trade!
              </p>
            )}
            {(trade.agreementConfirmationBuyer || buyerConfirmed) && (
              <p className=" bg-green-300 text-gray-900 font-semibold px-4 py-2 rounded mt-4 m-2 mx-auto animate-fade-right animate-duration-[500ms] animate-delay-0">
                ¡El Comprador <b>{trade.nameBuyer}</b> está de acuerdo para
                iniciar el Trade!
              </p>
            )}

            <h2 className="text-xl mb-4 text-right font-bold text-gray-600">
              Estado del Trade: {currentState}
            </h2>
            <hr className="border-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-4">{post.title}</h2>
            <p className="text-gray-600 text-sm mb-4">{post.description}</p>

            <p className="text-xl mb-4">
              <b>Precio:</b> {post.price}
            </p>
            <p className="text-gray-600 text-sm mb-4">
              <b>Categoría:</b> Deportes
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-between mt-4">
              {post.photos.map((photo, index) => (
                <img
                  key={index}
                  src={`http://localhost:3001/images/posts/${photo}`}
                  alt={post.title}
                  className="w-1/4 h-60 rounded-md mb-2"
                />
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => {
                  if (role === "vendedor") {
                    handleConfirmAgreementSeller();
                  } else if (role === "comprador") {
                    handleConfirmAgreementBuyer();
                  }

                  console.log("MANEJAR AQUI QUITAR LOS BOTONES Y PONER OTRA COSA.. MIENTRAS EL OTRO CONFIRMA..")
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-2 md:px-4 py-1 md:py-2 rounded mr-2 font-semibold"
              >
                Estoy de Acuerdo
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white px-2 md:px-4 py-1 md:py-2 rounded font-semibold">
                Cancelar Trade
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/4 px-4 relative">
          <div className="bg-slate-100 rounded-lg p-4 mb-4">
            <h1 className="text-3xl font-bold mb-1 text-gray-900 text-center">
              Trade Chat
            </h1>
            <p className="text-center font-semibold text-gray-600 text-sm">
              Ponte de acuerdo con la otra parte para seguir con el tradeo...
            </p>
          </div>

          <div className="border border-gray-300 p-4 mb-4 max-w-md h-96 overflow-y-auto bg-white rounded-lg shadow-md mx-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  message.username === role ? "text-right" : "text-left"
                }`}
              >
                <strong className="text-gray-700">{message.username}:</strong>{" "}
                {message.message}
              </div>
            ))}
          </div>

          <form
            onClick={(e) => {
              e.preventDefault();
            }}
            className="flex w-full mx-auto"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 mr-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Escribe un mensaje..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center mb-6">
        <div className="w-full md:w-1/2 px-4 mb-4 md:mb-0">
          <div className="flex items-start bg-white rounded-lg shadow-lg p-6">
            <div className="w-1/4">
              <img
                src={`http://localhost:3001/image/profile/${sellerData.imageProfile}`}
                alt="Foto del vendedor"
                className="w-20 h-20 rounded-full mb-4 border-4 border-white"
              />
              <div className="flex items-center">
                <FaStar className="h-6 w-6 text-yellow-500 mr-1" />
                <span className="text-yellow-500 font-bold text-lg">
                  {sellerData.rating}/5
                </span>
              </div>
            </div>
            <div className="w-3/4 pl-6">
              <h2 className="text-2xl font-bold mb-2">
                {sellerData.name} {sellerData.lastName}
              </h2>
              <p className="text-gray-600 text-sm mb-4">Vendedor</p>
              <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold">
                Ver perfil
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 px-4 mb-4 md:mb-0">
          <div className="flex items-start bg-white rounded-lg shadow-lg p-6">
            <div className="w-1/4">
              <img
                src={`http://localhost:3001/image/profile/${buyerData.imageProfile}`}
                alt="Foto del vendedor"
                className="w-20 h-20 rounded-full mb-4 border-4 border-white"
              />
              <div className="flex items-center">
                <FaStar className="h-6 w-6 text-yellow-500 mr-1" />
                <span className="text-yellow-500 font-bold text-lg">
                  {buyerData.rating}/5
                </span>
              </div>
            </div>
            <div className="w-3/4 pl-6">
              <h2 className="text-2xl font-bold mb-2">
                {buyerData.name} {buyerData.lastName}
              </h2>
              <p className="text-gray-600 text-sm mb-4">Comprador</p>
              <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold">
                Ver perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Acuerdo;
