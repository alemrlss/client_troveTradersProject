/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/socketContext";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RiCheckLine, RiErrorWarningLine } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";

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
  seller,
  buyer,
}) {
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const [sellerConfirmed, setSellerConfirmed] = useState(
    trade.agreementConfirmationSeller ? true : false
  );
  const [buyerConfirmed, setBuyerConfirmed] = useState(
    trade.agreementConfirmationBuyer ? true : false
  );
  const [agreement, setAgreement] = useState(false);
  const [cancelTrade, setCancelTrade] = useState(trade.isCancel ? true : false);

  const [tradeCancelled, setTradeCancelled] = useState(
    trade.isCancel ? true : false
  );
  const [buttonsDisabled, setButtonsDisabled] = useState(
    trade.isCancel ? true : false
  );
  const [whoCancelled, setWhoCancelled] = useState(trade.whoCanceled);

  //?Escuchar los eventos de confirmacion de ambas partes
  useEffect(() => {
    socket.on(`sellerConfirmed_${trade._id}`, () => {
      setSellerConfirmed(true);
    });

    socket.on(`buyerConfirmed_${trade._id}`, () => {
      setBuyerConfirmed(true);
    });

    socket.on(`sellerCancel_${trade._id}`, () => {
      cancelTradeRole("seller");
    });

    socket.on(`buyerCancel_${trade._id}`, () => {
      cancelTradeRole("buyer");
    });

    return () => {
      socket.off(`sellerConfirmed_${trade._id}`);
      socket.off(`buyerConfirmed_${trade._id}`);
      socket.off(`sellerCancel_${trade._id}`);
      socket.off(`buyerCancel_${trade._id}`);
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
    //! Cuando el primero cancele el trade se activara el codigo dentro del if!
    if (cancelTrade) {
      axios
        .post(
          `http://localhost:3001/users/trades/${trade._id}/${trade.sellerID}/${trade.buyerID}/cancel/${whoCancelled}`
        )
        .then(() => {
          setTradeCancelled(true);
          setButtonsDisabled(true);
        })
        .catch((error) => {
          console.error("Error al cancelar el trade:", error);

          // Aquí puedes manejar el error y mostrar un mensaje al usuario si es necesario
        });
    }
  }, [
    sellerConfirmed,
    buyerConfirmed,
    trade._id,
    post._id,
    setCurrentState,
    cancelTrade,
    trade.sellerID,
    trade.buyerID,
    whoCancelled,
  ]);

  const cancelTradeRole = (role) => {
    if (role === "seller") {
      setWhoCancelled("Vendedor");
    }
    if (role === "buyer") {
      setWhoCancelled("Comprador");
    }

    setCancelTrade(true);
  };
  //?Confirmacion cuando el vendedor esta de acuerdo
  const handleConfirmAgreementSeller = () => {
    axios
      .post(
        `http://localhost:3001/users/trades/${trade._id}/${trade.sellerID}/${trade.buyerID}/confirmationAgreementSeller`
      )
      .then(() => {
        const message = "El vendedor está de acuerdo";
        setAgreement(true);
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
        setAgreement(true);
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

  const handleCancelTradeBuyer = () => {
    const message = "El comprador no esta de acuerdo para realizar el Trade";
    socket.emit("buyerCancel", {
      tradeId: trade._id,
      message,
    });
  };
  const handleCancelTradeSeller = () => {
    const message = "El vendedor no esta de acuerdo para realizar el Trade";
    socket.emit("sellerCancel", {
      tradeId: trade._id,
      message,
    });
  };
  return (
    <div className="flex flex-col p-4 md:p-8 lg:p-12">
      {seller && tradeCancelled && (
        <div className="bg-red-200  border-red-500 border-2 p-3 rounded shadow-md text-lg mb-4 animate-fade-down animate-duration-[800ms] animate-delay-0">
          <p className="text-gray-900 font-semibold text-center md:text-left text-base">
            El trade ha sido cancelado por el {whoCancelled}
          </p>
          <p className="text-gray-700 text-sm mb-0">
            El trade ya no tiene validez alguna y no se seguirá comercializando.
          </p>
          <p className="text-gray-700 text-sm mb-1 mt-0 italic">
            Debes volver a publicar el objeto nuevamente si quieres
            comercializarlo.
          </p>
          <div className="flex justify-center md:justify-normal">
            <button
              onClick={async () => {
                await axios.post(
                  `http://localhost:3001/users/trades/${trade._id}/${trade.sellerID}/cancel`
                );
                await axios.delete(
                  `http://localhost:3001/posts/delete/${post._id}`
                );
                navigate("/");
              }}
              className="bg-green-500 hover:bg-green-600 text-white text-sm px-2 md:px-4 py-1 md:py-2 rounded  flex "
            >
              Finalizar / Ir al Home
            </button>
          </div>
          <p className="text-gray-600 text-xs mt-2 flex items-center">
            <RiErrorWarningLine className="mr-1 h-5 w-5 text-red-500" />{" "}
            Advertencia: Si no das clic en el botón, el trade no se finalizará
            ni se eliminará de tus trades en ejecución.
          </p>
        </div>
      )}
      {buyer && tradeCancelled && (
        <div className="mb-4 bg-red-200 p-3 border-red-500 border-2 rounded shadow-md z-10 text-lg animate-fade-down animate-duration-[800ms] animate-delay-0">
          <p className="text-gray-900 font-semibold text-center md:text-left text-base">
            El trade ha sido cancelado por el {whoCancelled}
          </p>
          <p className="text-gray-700 text-sm mb-0">
            El trade ya no tiene validez alguna y no se seguirá comercializando.
          </p>
          <p className="text-gray-700 text-sm mb-1 mt-0 italic">
            Puedes seguir buscando objetos dentro de nuestra plataforma
          </p>
          <div className="flex justify-center md:justify-normal">
            <button
              onClick={async () => {
                await axios.post(
                  `http://localhost:3001/users/trades/${trade._id}/${trade.buyerID}/cancel`
                );
                await axios.delete(
                  `http://localhost:3001/posts/delete/${post._id}`
                );
                navigate("/");
              }}
              className="bg-green-500 hover:bg-green-600 text-white text-sm px-2 md:px-4 py-1 md:py-2 rounded  flex "
            >
              Finalizar / Ir al Home
            </button>
          </div>
          <p className="text-gray-600 text-xs mt-2 flex items-center">
            <RiErrorWarningLine className="mr-1 h-5 w-5 text-red-500" />{" "}
            Advertencia: Si no das clic en el botón, el trade no se finalizará
            ni se eliminará de tus trades en ejecución.
          </p>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-center mb-6">
        <div className="w-full md:w-3/4 px-4 mb-4 md:mb-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-gray-400 mb-2 text-lg">Eres el {role}</h2>

            {(trade.agreementConfirmationSeller || sellerConfirmed) && (
              <p className=" bg-green-200 text-black font-semibold px-4 py-2 rounded-r-3xl mt-4 m-2 mx-auto animate-fade-right animate-duration-[500ms] animate-delay-0">
                ¡El Vendedor <b>{trade.nameSeller}</b> está de acuerdo para
                iniciar el trade!
              </p>
            )}
            {(trade.agreementConfirmationBuyer || buyerConfirmed) && (
              <p className=" bg-red-200 text-gray-900 font-semibold px-4 py-2 rounded-r-3xl mt-4 m-2 mx-auto animate-fade-right animate-duration-[500ms] animate-delay-0">
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
              {buyer &&
                (buyerConfirmed || agreement ? (
                  <p className="flex items-center  font-sans  text-2xl animate-fade animate-duration-[500ms] animate-delay-0">
                    <FaCheckCircle className="mr-2 h-10 w-10 text-green-500" />
                    Estas de acuerdo con el Trade
                  </p>
                ) : (
                  <div>
                    {!trade.isDispute ? (
                      <div className="flex">
                        {" "}
                        <button
                          disabled={buttonsDisabled}
                          onClick={() => {
                            handleConfirmAgreementBuyer();
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 md:px-4 py-1 md:py-2 rounded mr-2 font-semibold"
                        >
                          Estoy de Acuerdo
                        </button>
                        <button
                          disabled={buttonsDisabled}
                          onClick={handleCancelTradeBuyer}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 md:px-4 py-1 md:py-2 rounded font-semibold"
                        >
                          Cancelar Trade
                        </button>
                      </div>
                    ) : (
                      <p className="flex items-center text-2xl  rounded-sm">
                        <RiErrorWarningLine className="mr-1 h-10 w-10 text-red-500" />
                        El trade ha sido cancelado!
                      </p>
                    )}
                  </div>
                ))}
              {seller &&
                (sellerConfirmed || agreement ? (
                  <p className="flex items-center  font-sans  text-2xl animate-fade animate-duration-[500ms] animate-delay-0">
                    <FaCheckCircle className="mr-2 h-10 w-10 text-green-500" />
                    Estas de acuerdo con el Trade
                  </p>
                ) : (
                  <div>
                    {!cancelTrade ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          disabled={buttonsDisabled}
                          onClick={() => {
                            handleConfirmAgreementSeller();
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-3xl font-semibold"
                        >
                          Estoy de Acuerdo
                        </button>
                        <button
                          disabled={buttonsDisabled}
                          onClick={handleCancelTradeSeller}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-3xl font-semibold"
                        >
                          Cancelar Trade
                        </button>
                      </div>
                    ) : (
                      <p className="flex items-center text-2xl  rounded-sm">
                        <RiErrorWarningLine className="mr-1 h-10 w-10 text-red-500" />
                        El trade ha sido cancelado!
                      </p>
                    )}
                  </div>
                ))}
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
              className="flex-1 mr-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-secondary-100"
              placeholder="Escribe un mensaje..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-secondary-100 500 hover:bg-secondary-100 text-white font-bold px-4 py-2 rounded"
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
              <p className="text-gray-600 font-bold  text-sm mb-4">Vendedor</p>

              <button className="mt-4 bg-secondary-100 hover:opacity-90 text-white px-4 py-2 rounded font-semibold">
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
              <p className="text-gray-500 font-bold text-sm mb-4">Comprador</p>
              <button className="mt-4 bg-secondary-100 hover:opacity-90 text-white px-4 py-2 rounded font-semibold">
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
