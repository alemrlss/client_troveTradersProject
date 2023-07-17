/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import { SocketContext } from "../../contexts/socketContext";
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
}) {
  const socket = useContext(SocketContext);

  const [buyerConfirmed, setBuyerConfirmed] = useState(false);
  const [sellerConfirmed, setSellerConfirmed] = useState(false);

  const [payConfirmedBuyer, setPayConfirmedBuyer] = useState(false);
  const [payConfirmedSeller, setPayConfirmedSeller] = useState(false);

  useEffect(() => {
    // Escuchar evento de confirmación del comprador
    socket.on("buyerConfirmationPay", () => {
      setBuyerConfirmed(true);
      setPayConfirmedBuyer(true);
    });

    // Escuchar evento de confirmación del vendedor
    socket.on("sellerConfirmationPay", () => {
      setSellerConfirmed(true);
      setPayConfirmedSeller(true);
    });

    return () => {
      // Desuscribirse de los eventos al desmontar el componente
      socket.off("buyerConfirmationPay");
      socket.off("sellerConfirmationPay");
    };
  }, [socket]);

  useEffect(() => {
    // Verificar si ambos usuarios han confirmado el acuerdo
    if (sellerConfirmed && buyerConfirmed) {
      /*  axios
        .put(`http://localhost:3001/posts/${post._id}`, {
          newState: "recibo", // Cambiar al estado "recibo"
        })
        .then((response) => {
          console.log(response.data);
          setCurrentState("recibo");
          // Manejar la respuesta de la petición si es necesario
        })
        .catch((error) => {
          console.error("Error al actualizar el estado del post:", error);
        });*/
      setTimeout(() => {
        setCurrentState("recibo");
      }, 4000);
    }
  }, [sellerConfirmed, buyerConfirmed, setCurrentState]);

  //evento que hara el comprador
  const handleBuyerConfirmed = () => {
    socket.emit("buyerConfirmationPay");
  };

  //evento que hara el vendedor
  const handleSellerConfirmed = () => {
    socket.emit("sellerConfirmationPay");
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
            Precio: {post.price}
          </h2>

          <h2 className="text-2xl mb-4 text-center">
            {buyer
              ? `Realizale el Pago al Vendedor: ${sellerData.name} y luego confirma en el Boton de Abajo`
              : "Esperando que el Comprador confirme que ha realizado el pago... Puedes enviarle un mensaje en el chat para recordarle que confirme. Luego que confirme se te activara el boton para que tu confirmes que lo has recibido..."}
          </h2>

          {payConfirmedBuyer && (
            <p className="bg-blue-300 text-gray-900 font-bold px-4 py-2 rounded">
              ¡El Comprador <b>{trade.nameBuyer}</b> ha realizado el Pago!
            </p>
          )}

          {seller && payConfirmedBuyer && (
            <p className=" text-gray-900 font-bold px-4 py-2 rounded text-xl">
              Revisa que has recibido el pago, y confirma el Pago como Recibido!
            </p>
          )}
          <div className="flex justify-center mt-4">
            {seller && buyerConfirmed && !sellerConfirmed && (
              <button
                onClick={() => {
                  handleSellerConfirmed();
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-6 rounded mr-2 font-bold"
              >
                He recibido el Pago
              </button>
            )}

            {buyer && !buyerConfirmed && (
              <button
                onClick={() => {
                  handleBuyerConfirmed();
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-6 rounded mr-2 font-bold"
              >
                He realizado el Pago
              </button>
            )}

            {buyer && buyerConfirmed && (
              <h2 className="text-xl font-bold">
                Le has confirmado al vendedor que has realizado el Pago.
                Esperando su confirmacion de Recibo...
              </h2>
            )}
          </div>
          {payConfirmedSeller && (
            <p className="bg-orange-500 text-gray-900 font-bold px-4 py-2 rounded mt-4 mb-2">
              ¡El Vendedor <b>{trade.nameSeller}</b> ha recibido el Pago
              Realizado!
            </p>
          )}
          {seller && sellerConfirmed && (
            <h2 className="text-2xl">
              Le has confirmado al comprador que has recibido el Pago.
            </h2>
          )}
          {payConfirmedSeller && payConfirmedBuyer && (
            <p className=" text-white font-bold px-4 py-2 mt-8">
              Se ha confirmado el Pago de el Trade con exito.. Pasando a la
              siguiente seccion: Recibo
            </p>
          )}
        </div>

        {/* Columna del chat */}
        <div className="flex-1 max-h-96 ml-6">
          <h1 className="text-3xl font-bold mb-1 text-white text-center">
            Trade Chat
          </h1>
          <p className="text-center font-bold text-gray-400 text-xs pb-1">
            Ponte de acuerdo con la otra parte para realizar el pago....
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

export default Pago;
