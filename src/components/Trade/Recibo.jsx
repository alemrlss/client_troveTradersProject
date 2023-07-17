/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import { SocketContext } from "../../contexts/socketContext";
import axios from "axios";

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
  sellerData,
  seller,
  buyer,
}) {
  const socket = useContext(SocketContext);

  const [buyerConfirmed, setBuyerConfirmed] = useState(false);
  const [sellerConfirmed, setSellerConfirmed] = useState(false);

  const [receivedConfirmedBuyer, setReceivedConfirmedBuyer] = useState(false);
  const [receivedConfirmedSeller, setReceivedConfirmedSeller] = useState(false);

  useEffect(() => {
    // Escuchar evento de confirmación del comprador
    socket.on("buyerConfirmationReceived", () => {
      setBuyerConfirmed(true);
      setReceivedConfirmedBuyer(true);
    });

    // Escuchar evento de confirmación del vendedor
    socket.on("sellerConfirmationReceived", () => {
      setSellerConfirmed(true);
      setReceivedConfirmedSeller(true);
    });

    return () => {
      // Desuscribirse de los eventos al desmontar el componente
      socket.off("buyerConfirmationReceived");
      socket.off("sellerConfirmationReceived");
    };
  }, [socket]);

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
      setTimeout(() => {
        setCurrentState("finalizado");
      }, 4000);
    }
  }, [sellerConfirmed, buyerConfirmed, setCurrentState]);

  const handleBuyerConfirmed = () => {
    socket.emit("buyerConfirmationReceived");
    console.log("lol");
  };

  //evento que hara el vendedor
  const handleSellerConfirmed = () => {
    socket.emit("sellerConfirmationReceived");
  };
  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-center mb-6">
        <div className="w-1/2 ml-4">
          <h2 className="text-3xl text-gray-400">Eres el {role}</h2>
          <h2 className="text-3xl mb-4 text-right font-bold">
            Estado: {currentState}
          </h2>
          <hr className="" />
          <h2 className="text-3xl font-bold mb-4 pt-2 text-center mt-4">
            Aqui tiene que ir informacion acerca del recibo del producto(no
            funcional)
          </h2>
          -
          <h2 className="text-2xl mb-4 text-center">
            {buyer
              ? `Esperando que el Vendedor confirme que te ha enviado / entregado el Producto: ${post.title}`
              : "Confirmale al Comprador que le has enviado / entregado el Producto"}
          </h2>
          {receivedConfirmedSeller && (
            <p className="bg-blue-300 text-gray-900 font-bold px-4 py-2 rounded">
              ¡El vendedor <b>{trade.nameSeller}</b> ha realizado marcado el
              producto como Entregado!
            </p>
          )}
          {seller && sellerConfirmed && (
            <h2 className="text-xl font-bold mt-4">
              Le has confirmado al Comprador que le has entregado el Producto..
              Esperando respuesta de {trade.nameSeller}
            </h2>
          )}
          {buyer && sellerConfirmed && (
            <h2 className="text-xl font-bold mt-4">
              El comprador ha marcado el producto como entregado. Por favor
              verifica si el producto fue entregado y de ser asi marca el
              Producto como recibido!
            </h2>
          )}
          {receivedConfirmedBuyer && (
            <p className="bg-orange-300 text-gray-900 font-bold px-4 py-2 rounded mt-4">
              ¡El comprador ha recibido el Producto!!!
            </p>
          )}
          {buyerConfirmed && sellerConfirmed && (
            <h2 className="text-xl font-bold mt-4 text-white">
              La entrega del producto ha sido exitosa... Redireccionando al
              estado: Finalizado
            </h2>
          )}
          <div className="flex justify-center mt-4">
            {seller && !receivedConfirmedSeller && (
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-6 rounded mr-2 font-bold"
                onClick={() => {
                  handleSellerConfirmed();
                }}
              >
                Le he entregado el Producto al Comprador
              </button>
            )}

            {buyer && receivedConfirmedSeller && (
              <button
                onClick={() => {
                  handleBuyerConfirmed();
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-6 rounded mr-2 font-bold"
              >
                He recibido el Producto
              </button>
            )}
          </div>
        </div>

        {/* Columna del chat */}
        <div className="flex-1 max-h-96 ml-6">
          <h1 className="text-3xl font-bold mb-1 text-white text-center">
            Trade Chat
          </h1>
          <p className="text-center font-bold text-gray-400 text-xs pb-1">
            Ponte de acuerdo con la otra parte para la entrega del objeto...
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
        </div>
      </div>
    </div>
  );
}

export default Recibo;
