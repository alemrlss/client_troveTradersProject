/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import { SocketContext } from "../../contexts/socketContext";
import axios from "axios";
import {
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineWarning,
} from "react-icons/ai";
import { FaExclamationTriangle } from "react-icons/fa";

function Recibo({
  post,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  currentState,
  role,
  setCurrentState,
  trade,
  seller,
  buyer,
  alertsReceived,
}) {
  const socket = useContext(SocketContext);

  const [buyerConfirmed, setBuyerConfirmed] = useState(
    trade.receivedConfirmationBuyer ? true : false
  );
  const [sellerConfirmed, setSellerConfirmed] = useState(
    trade.receivedConfirmationSeller ? true : false
  );

  const [tradeInDispute, setTradeInDispute] = useState(
    trade.inDispute ? true : false
  );

  const [selectedFiles, setSelectedFiles] = useState({});
  const [errorProof, setErrorProof] = useState("");
  const [successProof, setSuccesProof] = useState("");

  const [tradeContinue, setTradeContinue] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    if (!trade.deliverDate) {
      // Si deliveryDate no existe, puedes manejar este caso según tus necesidades.
      setTimeRemaining(null);
      return;
    }

    const now = new Date(); // Fecha actual en la zona horaria local
    const deliveryDateUTC = new Date(trade.deliverDate); // Convertir deliveryDate a formato Date en UTC
    const interval = setInterval(() => {
      const timeDiff = deliveryDateUTC - now;

      if (timeDiff <= 0) {
        clearInterval(interval);
        //AQUI SE MANEJA CUANDO EL TRADE SE CANCELE Y SE TERMINE. SE DEBE NOTIFICAR EN LA DISPUTA.
        //Y DEBE SALIR UNA PESTAÑA A CADA INTEGRANTE EN EL TRADE. AL COMPRADOR PARA HACERLE EL REEMBOLSO
        // Y AL VENDEDOR PARA DECIRLE QUE SU CUENTA SERA BLOQUEADA Y SERA DENUNCIADO..
        alert(
          "El trade se ha cancelado. Le escribiremos por correo al comprador para solucionar el problema."
        );
      } else {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, trade.deliverDate]);

  const [deliverTime, setDeliverTime] = useState(false);
  useEffect(() => {
    // Escuchar evento de confirmación del comprador
    socket.on("buyerConfirmationReceived", () => {
      setBuyerConfirmed(true);
    });

    // Escuchar evento de confirmación del vendedor
    socket.on("sellerConfirmationReceived", () => {
      setSellerConfirmed(true);
    });
    socket.on(`buyerDisputeReceived_${trade._id}`, () => {
      setTradeInDispute(true);
    });
    socket.on(`adminContinue_${trade._id}`, () => {
      setTradeInDispute(false);
      setTradeContinue(true);
    });
    socket.on(`deliverTime_${trade._id}`, () => {
      setDeliverTime(true);
    });
    return () => {
      // Desuscribirse de los eventos al desmontar el componente
      socket.off("buyerConfirmationReceived");
      socket.off("sellerConfirmationReceived");
      socket.off(`buyerDisputeReceived_${trade._id}`);
      socket.off(`adminContinue_${trade._id}`);
      socket.off(`deliverTime_${trade._id}`);
    };
  }, [socket, trade._id]);

  useEffect(() => {
    // Verificar si ambos usuarios han confirmado el acuerdo
    if (sellerConfirmed && buyerConfirmed) {
      axios
        .put(`http://localhost:3001/posts/${post._id}`, {
          newState: "finalizado", // Cambiar al estado "finalizado"
        })
        .then((response) => {
          console.log(response.data);
          setCurrentState("finalizado");
          // Manejar la respuesta de la petición si es necesario
        })
        .catch((error) => {
          console.error("Error al actualizar el estado del post:", error);
        });
    }
  }, [sellerConfirmed, buyerConfirmed, setCurrentState, post._id]);

  const handleBuyerConfirmed = () => {
    axios
      .post(
        `http://localhost:3001/users/trades/${trade._id}/${trade.sellerID}/${trade.buyerID}/confirmationReceivedBuyer`
      )
      .then((response) => {
        console.log(response.data);
        const message = "El Comprador ha recibido el Producto";
        // Emitir evento de confirmación del vendedor
        socket.emit("buyerConfirmationReceived", {
          tradeId: trade._id,
          message,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFileChange = (e, disputeId) => {
    const file = e.target.files[0]; // Solo tomamos el primer archivo seleccionado
    setSelectedFiles({
      ...selectedFiles,
      [disputeId]: file, // Asociamos el archivo con el ID de la disputa
    });
  };
  //evento que hara el vendedor
  const handleSellerConfirmed = () => {
    axios
      .post(
        `http://localhost:3001/users/trades/${trade._id}/${trade.sellerID}/${trade.buyerID}/confirmationReceivedSeller`
      )
      .then((response) => {
        console.log(response.data);
        const message = "El Vendedor ha enviado el Producto";
        // Emitir evento de confirmación del vendedor
        socket.emit("sellerConfirmationReceived", {
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
        `http://localhost:3001/users/trades/${trade._id}/${trade.sellerID}/${trade.buyerID}/dispute/received`
      )
      .then(() => {
        const message = "El comprador no ha recibido el pago";
        socket.emit("buyerDisputeReceived", {
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
  return (
    <div className="flex flex-col h-screen mt-4">
      {seller && tradeInDispute && (
        <div className="bg-orange-300 p-3 rounded shadow-md text-lg mb-4 animate-fade-down animate-duration-[800ms] animate-delay-0">
          <div className="text-gray-900 font-semibold text-xl flex items-center justify-center mb-2">
            <FaExclamationTriangle className="mr-2 text-red-600" />
            <p> ¡DISPUTA EN CURSO!</p>
          </div>
          <p className="text-gray-700 text-sm mb-0">
            Estimado vendedor, Nos encontramos en una fase de disputa en este
            proceso de intercambio. En esta etapa, un Administrador revisará
            cuidadosamente la situación para garantizar un resultado justo y
            equitativo. Durante esta disputa, se pueden solicitar pruebas
            adicionales y se realizarán evaluaciones detalladas para tomar una
            decisión informada. Tanto usted como su contraparte serán
            notificados a través del chat y recibirán alertas importantes en
            esta plataforma. Responda a las solicitudes del Administrador de
            manera oportuna para facilitar una resolución eficiente de la
            disputa. Atentamente, <strong>El equipo de TroveTraders</strong>
          </p>
          {alertsReceived.map((alert) => (
            <div
              key={alert._id}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md my-2"
            >
              {alert.message}
              {alert.role === "vendedor" && (
                <div>
                  <label className="block font-semibold text-sm mt-2">
                    Adjuntar archivo:
                  </label>
                  <input
                    type="file"
                    accept="image/*" // Puedes restringir el tipo de archivo aquí
                    // Resto de atributos para el input del comprador
                    className="border border-gray-300 rounded px-2 py-1 mt-1"
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
          {timeRemaining && (
            <div>
              <p className="text-red-500 font-bold text-2xl">
                Tiempo restante: {timeRemaining}
              </p>
              <p className="text-orange-800 text-lg">
                Cuando el contador finalice, y el vendedor no ha confirmado como
                entregado el producto. automaticamente se cancelara y nos
                contactaremos por correo con el comprador
              </p>
            </div>
          )}
          {deliverTime && (
            <p className="text-red-500 font-bold text-2xl">
              Se ha establecido un tiempo de entrega para el vendedor entregue
              el producto. Por favor recargue la pagina para visualizarlo
            </p>
          )}
        </div>
      )}
      {buyer && tradeInDispute && (
        <div className="bg-orange-300 p-3 rounded shadow-md text-lg mb-4 animate-fade-down animate-duration-[800ms] animate-delay-0">
          <div className="text-gray-900 font-semibold text-xl flex items-center justify-center mb-2">
            <FaExclamationTriangle className="mr-2 text-red-600" />
            <p> ¡DISPUTA EN CURSO!</p>
          </div>
          <p className="text-gray-700 text-sm mb-0">
            Estimado comprador, Nos encontramos en una fase de disputa en este
            proceso de intercambio. En esta etapa, un Administrador revisará
            cuidadosamente la situación para garantizar un resultado justo y
            equitativo. Durante esta disputa, se pueden solicitar pruebas
            adicionales y se realizarán evaluaciones detalladas para tomar una
            decisión informada. Tanto usted como su contraparte serán
            notificados a través del chat y recibirán alertas importantes en
            esta plataforma. Responda a las solicitudes del Administrador de
            manera oportuna para facilitar una resolución eficiente de la
            disputa. Atentamente, <strong>El equipo de TroveTraders</strong>
          </p>
          {alertsReceived.map((alert) => (
            <div
              key={alert._id}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md my-2"
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
          {timeRemaining && (
            <p className="text-red-500 font-bold text-2xl">
              Tiempo restante: {timeRemaining}
            </p>
          )}
          {deliverTime && (
            <p className="text-red-500 font-bold text-2xl">
              Se ha establecido un tiempo de entrega para el vendedor entregue
              el producto. Por favor recargue la pagina para visualizarlo
            </p>
          )}
        </div>
      )}
      {tradeContinue && (
        <div className="mb-4 bg-green-200 p-3 rounded shadow-md z-10 text-lg animate-fade-down animate-duration-[800ms] animate-delay-0">
          <p className="text-gray-900 font-semibold text-xl">
            El administrador ha autorizado para seguir con el Trade.
          </p>
        </div>
      )}
      <div className="flex justify-center mb-6">
        <div className="w-1/2 ml-4">
          <h2 className="text-gray-400 mb-2 text-lg">Eres el {role}</h2>
          <h2 className="text-xl mb-4 text-right font-bold text-gray-600">
            Estado del Trade: {currentState}
          </h2>
          <hr className="mb-2" />
          <h2 className="text-3xl mt-2 font-bold">{post.title}</h2>
          <h2 className="text-xl text-gray-800 ml-4 mb-3 mt-1">
            Precio: <strong className="text-green-500">{post.price}$</strong>
          </h2>
          <div>
            {buyer ? (
              <div className="bg-green-100 p-4 rounded-lg flex items-center">
                <p className="text-sm text-center">
                  El artículo está actualmente en proceso de envío o entrega por
                  parte del vendedor. Le solicitamos con cortesía que espere a
                  recibir la confirmación del vendedor sobre el envío o entrega
                  del artículo con el título: {post.title}. Además, le animamos
                  a utilizar el chat para comunicarse amablemente con el
                  vendedor si necesita alguna información adicional o tiene
                  alguna pregunta sobre el estado de la entrega.
                </p>
                <AiOutlineClockCircle className="text-gray-800 text-9xl m-4" />
              </div>
            ) : (
              <div className="bg-blue-100 p-4 rounded-lg flex items-center">
                <div className="flex-1">
                  <p className=" text-sm">
                    Por favor, continúe con el proceso de envío o entrega del
                    artículo al comprador. Después de realizarlo, le pedimos
                    gentilmente que confirme el envío utilizando el botón
                    ubicado más abajo. Además, es importante destacar que si no
                    confirma la entrega dentro de un plazo de 3 días, el
                    comprador tendrá la opción de apelar la situación, lo que
                    podría resultar en una denuncia ante las autoridades
                    pertinentes.
                  </p>
                  <p className="text-red-600 text-xs mt-2 text-center">
                    <AiOutlineWarning className="inline mr-2" />
                    Importante: Le recordamos que debe confirmar únicamente
                    cuando el producto haya sido enviado o entregado al
                    Comprador. Confirmar sin haber realizado el envío puede
                    tener consecuencias graves.
                  </p>
                </div>
                <AiOutlineCheckCircle className="text-green-500 text-8xl m-4" />
              </div>
            )}
          </div>

          {sellerConfirmed && (
            <p className="bg-green-200 text-gray-900 font-bold px-4 py-2 rounded-r-3xl mt-2 animate-fade-right animate-duration-500 animate-delay-0">
              ¡El vendedor <b>{trade.nameSeller}</b> ha marcado el producto como
              Entregado!
            </p>
          )}
          {seller && sellerConfirmed && (
            <div className="bg-green-400 p-4 rounded-lg mt-4">
              <p className="text-lg">
                Le has confirmado al comprador que has enviado el producto.
                Espera que el comprador confirme que ha recibido el producto.
              </p>
              <p className="text-sm font-semibold">
                Esperando respuesta de {trade.nameSeller}..
              </p>
            </div>
          )}
          {buyer && sellerConfirmed && (
            <div className="bg-blue-200 p-4 rounded-lg mt-4">
              <p className="text-lg ">
                El vendedor ha registrado la entrega del producto. Te pedimos
                que verifiques si has recibido el artículo y, en caso
                afirmativo, lo marques como Recibido.
              </p>
            </div>
          )}
          {buyerConfirmed && (
            <p className="bg-red-200 text-gray-900 font-bold px-4 py-2 rounded mt-4">
              ¡El comprador ha marcado el producto como recibido!
            </p>
          )}
          <div className="flex justify-center mt-4">
            {seller && !sellerConfirmed && (
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-2xl  font-bold "
                onClick={() => {
                  handleSellerConfirmed();
                }}
              >
                He enviado el producto
              </button>
            )}

            {buyer && sellerConfirmed && (
              <div className="space-x-2">
                <button
                  onClick={() => {
                    handleBuyerConfirmed();
                  }}
                  className="bg-green-500 hover:bg-green-600 py-2 px-2 text-white rounded-2xl font-bold"
                >
                  He recibido el producto
                </button>

                <button
                  onClick={() => {
                    handleDispute();
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-2 rounded-2xl  font-bold"
                >
                  No he recibido el producto del vendedor
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Columna del chat */}
        <div className="w-full md:w-1/4 px-4">
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
                className="bg-secondary-100 hover:opacity-90 text-white px-4 py-2 rounded"
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

export default Recibo;
