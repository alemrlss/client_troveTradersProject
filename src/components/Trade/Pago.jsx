/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import { SocketContext } from "../../contexts/socketContext";
import { FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import { AiOutlineWarning, AiOutlineEllipsis } from "react-icons/ai";
import { FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RiErrorWarningLine } from "react-icons/ri";

import axios from "axios";

function Pago({
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
  seller,
  buyer,
  alerts,
}) {
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const [buyerConfirmed, setBuyerConfirmed] = useState(
    trade.payConfirmationBuyer ? true : false
  );
  const [sellerConfirmed, setSellerConfirmed] = useState(
    trade.payConfirmationSeller ? true : false
  );
  const [tradeInDispute, setTradeInDispute] = useState(
    trade.inDispute ? true : false
  );
  const [selectedFiles, setSelectedFiles] = useState({});
  const [errorProof, setErrorProof] = useState("");
  const [successProof, setSuccesProof] = useState("");
  console.log(trade);
  useEffect(() => {
    // Escuchar evento de confirmación del comprador
    socket.on(`buyerConfirmationPay_${trade._id}`, () => {
      setBuyerConfirmed(true);
    });

    // Escuchar evento de confirmación del vendedor
    socket.on(`sellerConfirmationPay_${trade._id}`, () => {
      setSellerConfirmed(true);
    });

    socket.on(`sellerDisputePay_${trade._id}`, () => {
      setTradeInDispute(true);
    });

    socket.on(`adminCancel_${trade._id}`, () => {
      setTradeCancelled(true);
      setTradeInDispute(false);
    });

    socket.on(`adminContinue_${trade._id}`, () => {
      setTradeInDispute(false);
      setTradeContinue(true);
    });
    return () => {
      // Desuscribirse de los eventos al desmontar el componente
      socket.off(`buyeerConfirmationPay_${trade._id}`);
      socket.off(`sellerConfirmationPay_${trade._id}`);
      socket.off(`sellerDisputePay_${trade._id}`);
      socket.off(`adminCancel_${trade._id}`);
      socket.off(`adminContinue_${trade._id}`);
    };
  }, [socket, trade._id]);

  const [tradeCancelled, setTradeCancelled] = useState(
    trade.isCancel ? true : false
  );
  const [tradeContinue, setTradeContinue] = useState(false);

  useEffect(() => {
    // Verificar si ambos usuarios han confirmado el acuerdo
    if (sellerConfirmed && buyerConfirmed) {
      axios
        .put(`http://localhost:3001/posts/${post._id}`, {
          newState: "recibo", // Cambiar al estado "recibo"
        })
        .then(() => {
          setCurrentState("recibo");
          // Manejar la respuesta de la petición si es necesario
        })
        .catch((error) => {
          console.error("Error al actualizar el estado del post:", error);
        });
    }

    if (tradeInDispute) {
      setTradeInDispute(true);
    }
  }, [
    sellerConfirmed,
    buyerConfirmed,
    setCurrentState,
    post._id,
    tradeInDispute,
    trade._id,
    trade.sellerID,
    trade.buyerID,
  ]);

  //evento que hara el comprador
  const handleBuyerConfirmed = () => {
    axios
      .post(
        `http://localhost:3001/users/trades/${trade._id}/${trade.sellerID}/${trade.buyerID}/confirmationPayBuyer`
      )
      .then(() => {
        const message = "El Comprador ha realizado el Pago";
        // Emitir evento de confirmación del vendedor
        socket.emit("buyerConfirmationPay", {
          tradeId: trade._id,
          message,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //evento que hara el vendedor
  const handleSellerConfirmed = () => {
    axios
      .post(
        `http://localhost:3001/users/trades/${trade._id}/${trade.sellerID}/${trade.buyerID}/confirmationPaySeller`
      )
      .then(() => {
        const message = "El vendedor ha confirmado el pago";
        socket.emit("sellerConfirmationPay", {
          tradeId: trade._id,
          message,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleDispute = () => {
    axios
      .post(
        `http://localhost:3001/users/trades/${trade._id}/${trade.sellerID}/${trade.buyerID}/dispute/pay`
      )
      .then(() => {
        const message = "El vendedor no esta de acuerdo para realizar el trade";
        socket.emit("sellerDisputePay", {
          tradeId: trade._id,
          message,
        });
      })
      .catch((error) => {
        console.error("Error a ir a disputas el trade:", error);
        // Aquí puedes manejar el error y mostrar un mensaje al usuario si es necesario
      });
  };

  const handleEnviarPrueba = (disputeId, role) => {
    // Crea un objeto FormData para enviar la prueba
    const formData = new FormData();
    formData.append("proof", selectedFiles[disputeId]); // Asegúrate de que "proof" coincida con el nombre en el backend

    // Realiza la petición al backend
    axios
      .post(
        `http://localhost:3001/disputes/${disputeId}/uploadProof/${role}`,
        formData
      )
      .then((response) => {
        // Realiza cualquier otra acción necesaria después de enviar la prueba
        console.log(`Prueba enviada para la disputa ${disputeId}.`);
        console.log(response.data);
        setErrorProof("");
        setSuccesProof(
          "Se ha enviado la prueba con exito. Espera que el administrador la analice y de una respuesta"
        );
      })
      .catch((error) => {
        console.error("Error al enviar la prueba:", error);
        // Maneja el error y muestra un mensaje si es necesario
        if (error.response && error.response.status === 400) {
          setErrorProof(
            "Ya enviaste la prueba anteriormente. Espera que el Administrador analice y de una respuesta"
          );
        }
      });
  };

  const handleFileChange = (e, disputeId) => {
    const file = e.target.files[0]; // Solo tomamos el primer archivo seleccionado
    setSelectedFiles({
      ...selectedFiles,
      [disputeId]: file, // Asociamos el archivo con el ID de la disputa
    });
  };

  return (
    <div className="flex flex-col p-4 md:p-8 lg:p-12">
      {seller && tradeCancelled && (
        <div className="bg-red-200 border-red-500 border-2 p-3 rounded shadow-md text-lg mb-4 animate-fade-down animate-duration-[800ms] animate-delay-0">
          <p className="text-gray-900 text-center text-xl mb-1">
            El Trade ha sido cancelado por el [
            <strong>Equipo de TroveTraders</strong>]
          </p>
          <p className="text-gray-700 text-base mb-0">
            El trade ya no tiene validez alguna y no se seguirá comercializando.
          </p>
          <p className="text-gray-700 text-base mb-1 mt-0 ">
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
        <div className="mb-4 bg-red-200  border-red-500 border-2 p-3 rounded shadow-md z-10 text-lg animate-fade-down animate-duration-[800ms] animate-delay-0">
          <p className="text-gray-900  text-xl text-center mb-1">
            El Trade ha sido cancelado por el [
            <strong>Equipo de TroveTraders</strong>]
          </p>
          <p className="text-gray-700 text-base mb-0">
            El trade ya no tiene validez alguna y no se seguirá comercializando.
          </p>
          <p className="text-gray-700 text-base mb-1 mt-0">
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
      {seller && tradeInDispute && (
        <div className="bg-orange-300 p-4 rounded shadow-md text-lg mb-4 animate-fade-down animate-duration-[800ms] animate-delay-0">
          <div className="text-gray-900 font-semibold text-2xl flex items-center justify-center mb-4">
            <FaExclamationTriangle className="mr-2 text-red-600 text-3xl" />
            <p className="text-red-600"> ¡DISPUTA EN CURSO!</p>
          </div>
          <p className="text-gray-700 text-base mb-4">
            Estimado vendedor, nos encontramos en una fase de disputa en este
            proceso de intercambio. En esta etapa, un Administrador revisará
            cuidadosamente la situación para garantizar un resultado justo y
            equitativo. Durante esta disputa, se pueden solicitar pruebas
            adicionales y se realizarán evaluaciones detalladas para tomar una
            decisión informada. Tanto usted como su contraparte serán
            notificados a través del chat y recibirán alertas importantes en
            esta plataforma. Responda a las solicitudes del Administrador de
            manera oportuna para facilitar una resolución eficiente de la
            disputa. Atentamente,
            <strong className="text-gray-800">
              {" "}
              El equipo de TroveTraders
            </strong>
          </p>

          {alerts.map((alert) => (
            <div
              key={alert._id}
              className="bg-orange-400 border border-orange-200 text-black px-4 py-3 rounded-md my-4"
            >
              {alert.message}
              {alert.role === "vendedor" && (
                <div>
                  <label className="block font-semibold text-sm mt-4">
                    Adjuntar archivo:
                  </label>
                  <input
                    type="file"
                    accept="image/*" // Puedes restringir el tipo de archivo aquí
                    // Resto de atributos para el input del comprador
                    className="border border-gray-300 rounded px-2 py-2 mt-2"
                    onChange={(e) => {
                      handleFileChange(e, alert.disputeId);
                    }}
                    onClick={() => {
                      setErrorProof("");
                      setSuccesProof("");
                    }}
                  />
                  <button
                    onClick={() =>
                      handleEnviarPrueba(alert.disputeId, "seller")
                    } // Así puedes pasar el ID de la disputa al botón
                    className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold ml-2 py-2 px-4 rounded-md text-sm mt-2 ${
                      selectedFiles[alert.disputeId]
                        ? ""
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!selectedFiles[alert.disputeId]}
                  >
                    Enviar Prueba
                  </button>
                  {errorProof && (
                    <p className="text-red-600 text-sm mt-2">{errorProof}</p>
                  )}
                  {successProof && (
                    <p className="text-green-500 text-sm mt-2">
                      {successProof}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {buyer && tradeInDispute && (
        <div className="bg-orange-300 p-3 rounded shadow-md text-lg mb-4 animate-fade-down animate-duration-[800ms] animate-delay-0">
          <div className="text-gray-900 font-semibold text-xl flex items-center justify-center mb-2">
            <FaExclamationTriangle className="mr-2 text-red-600" />
            <p> ¡DISPUTA EN CURSO!</p>
          </div>
          <p className="text-gray-700 text-base mb-4">
            Estimado vendedor, nos encontramos en una fase de disputa en este
            proceso de intercambio. En esta etapa, un Administrador revisará
            cuidadosamente la situación para garantizar un resultado justo y
            equitativo. Durante esta disputa, se pueden solicitar pruebas
            adicionales y se realizarán evaluaciones detalladas para tomar una
            decisión informada. Tanto usted como su contraparte serán
            notificados a través del chat y recibirán alertas importantes en
            esta plataforma. Responda a las solicitudes del Administrador de
            manera oportuna para facilitar una resolución eficiente de la
            disputa. Atentamente,
            <strong className="text-gray-800">
              {" "}
              El equipo de TroveTraders
            </strong>
          </p>

          {alerts.map((alert) => (
            <div
              key={alert._id}
              className="bg-orange-400 border border-orange-200 text-black px-4 py-2 rounded-md my-2"
            >
              {alert.message}

              {alert.role === "comprador" && (
                <div>
                  <label className="block font-semibold text-sm mt-2">
                    Adjuntar archivo:
                  </label>
                  <input
                    type="file"
                    accept="image/*" // Puedes restringir el tipo de archivo aquí
                    // Resto de atributos para el input del comprador
                    className="border border-gray-300 rounded px-2 py-1 mt-1"
                    onChange={(e) => handleFileChange(e, alert.disputeId)}
                    onClick={() => {
                      setErrorProof("");
                      setSuccesProof("");
                    }}
                  />
                  <button
                    onClick={() => handleEnviarPrueba(alert.disputeId, "buyer")} // Así puedes pasar el ID de la disputa al botón
                    className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold ml-1 py-2 px-4 rounded-md text-sm mt-2 ${
                      selectedFiles[alert.disputeId]
                        ? ""
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!selectedFiles[alert.disputeId]}
                  >
                    Enviar Prueba
                  </button>
                  {errorProof && (
                    <p className="text-gray-600 text-sm">{errorProof}</p>
                  )}
                  {successProof && (
                    <p className="text-green-500 text-sm">{successProof}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {tradeContinue && (
        <div className="mb-4 bg-green-200 p-3 rounded shadow-md z-10 text-lg animate-fade-down animate-duration-[800ms] animate-delay-0">
          <p className="text-gray-900 font-semibold text-xl">
            El administrador ha autorizado para seguir con el Trade. Vendedor,
            por favor confirma que has recibido el pago con exito
          </p>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-center mb-6 ">
        <div className="w-full md:w-1/2 ml-4">
          <h2 className="text-gray-400 mb-2 text-lg">Eres el {role}</h2>
          <h2 className="text-xl mb-4 text-right font-bold text-gray-600">
            Estado del Trade: {currentState}
          </h2>
          <hr className="" />
          <h2 className="text-3xl mt-2 font-bold">{post.title}</h2>
          <h2 className="text-xl text-gray-800 ml-4 mb-3 mt-1">
            Precio: <strong className="text-green-500">{post.price}$</strong>
          </h2>
          <div className="text-center">
            {buyer ? (
              <div className="bg-red-100 p-4 rounded-lg flex items-center">
                <div className="mr-4">
                  <FaInfoCircle className="text-gray-500 text-3xl" />
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    Realiza el pago al vendedor
                  </p>
                  <p className="text-xl font-bold">
                    {sellerData.name} {sellerData.lastName}
                  </p>
                  <p className="text-lg">Luego confirma en el botón de abajo</p>
                  <p className="text-sm mt-1">
                    Asegúrate de seguir las instrucciones del vendedor para
                    completar el pago de manera exitosa. Una vez realizado el
                    pago, presiona el botón "He realizado el pago".
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-green-200 p-4 rounded-lg flex items-center">
                <div className="mr-4">
                  {!buyerConfirmed ? (
                    <AiOutlineEllipsis className="text-green-700 text-6xl" />
                  ) : (
                    <FaCheckCircle className="text-green-500 text-3xl animate-fade animate-duration-500 animate-delay-[800ms]" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold mb-1">
                    Esperando confirmación de pago del comprador...
                  </p>
                  <p className="text-sm">
                    Puedes enviarle un mensaje en el chat para recordarle que
                    confirme. Una vez confirmado, podrás activar el botón para
                    confirmar que has recibido el pago.
                  </p>
                  <p className="text-sm mt-1">
                    Recuerda mantener una comunicación fluida con el comprador
                    para garantizar una transacción exitosa.
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* Mensajes de confirmación */}
          {buyerConfirmed && (
            <p className="bg-red-200 text-gray-900 font-bold px-4 py-2 rounded-r-3xl mt-4 mb-2 animate-fade-right animate-duration-500 animate-delay-0">
              ¡El comprador ha marcado el pago como realizado!
            </p>
          )}
          <div className="flex justify-center mt-4">
            {seller && buyerConfirmed && !sellerConfirmed && (
              <div className="text-center bg-red-100 p-4 rounded-lg animate-fade animate-duration-500 animate-delay-[200ms]">
                <p className="text-xl font-bold mb-1">
                  El comprador ha marcado el producto como pagado.
                </p>
                <p className="mb-1">
                  Puedes revisar y corroborar que el pago fue realizado
                  exitosamente.
                </p>
                <p className="text-sm text-red-500">
                  <AiOutlineWarning className="inline mr-1" />
                  Importante: Si confirmas que recibiste el pago sin haberlo
                  recibido, puede traer consecuencias.
                </p>
                <p className="text-sm text-red-500 mb-2">
                  Asegúrate de verificar antes de confirmar.
                </p>
                {!tradeInDispute && !tradeCancelled && (
                  <div>
                    <button
                      onClick={handleSellerConfirmed}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2 font-bold"
                    >
                      He recibido el Pago
                    </button>
                    <button
                      onClick={handleDispute}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-2 font-bold"
                    >
                      Aun no he recibido el Pago del comprador
                    </button>
                  </div>
                )}
              </div>
            )}

            {buyer && !buyerConfirmed && (
              <button
                onClick={handleBuyerConfirmed}
                className="bg-green-500 hover:bg-green-600 rounded-2xl text-white px-4 py-2 font-bold mb-2"
              >
                He realizado el Pago
              </button>
            )}

            {buyer && buyerConfirmed && (
              <div className="text-center bg-green-100 p-4 rounded-lg">
                <div className="flex justify-center items-center">
                  <AiOutlineEllipsis className="text-6xl m-2 text-slate-400" />
                  <div>
                    <p className="text-xl font-bold mb-1">
                      Has confirmado al vendedor que has realizado el pago
                    </p>
                    <p className="mb-1">
                      Esperando su confirmación de recibo...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>{" "}
          {sellerConfirmed && (
            <p className="bg-green-300 font-bold px-4 py-2 rounded-r-3xl mt-4 mb-2 animate-fade-right animate-duration-500 animate-delay-0">
              ¡El vendedor ha confirmado el recibo del pago!
            </p>
          )}
        </div>
        {/* Columna del chat */}
        <div className="w-full md:w-1/4 px-4  md:block">
          <div className="bg-slate-100 rounded-lg p-4 mb-4">
            <h1 className="text-3xl font-bold mb-1 text-gray-900 text-center">
              Trade Chat
            </h1>
            <p className="text-center font-semibold text-gray-600 text-sm">
              Ponte de acuerdo con la otra parte para seguir con el tradeo...
            </p>
          </div>

          <div className="border border-gray-300 p-4 mb-4 max-w-md h-96 overflow-y-auto bg-white rounded-lg shadow-md mx-auto ">
            {messages.map((message, index) => (
              <div key={index} className="mb-2">
                <strong className="text-gray-700">{message.username}:</strong>{" "}
                {message.message}
              </div>
            ))}
          </div>

          <div className="flex w-full mx-auto">
            <form
              onClick={(e) => {
                e.preventDefault();
              }}
              className="flex"
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
      </div>
    </div>
  );
}

export default Pago;
