/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import Acuerdo from "./Acuerdo";
import { SocketContext } from "../../contexts/socketContext";
import axios from "axios";
import { getDataUser } from "../../services/Auth";

function TradeComponent({ trade, idUser, post, userData }) {
  console.log(getDataUser());
  const socket = useContext(SocketContext);

  const [username] = useState(userData.username);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [seller, setSeller] = useState(false);
  const [buyer, setBuyer] = useState(false);

  const [currentState, setCurrentState] = useState(post.currentState);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log(trade._id);
        const response = await axios.get(
          "http://localhost:3001/messages/" + trade._id
        );
        const oldMessages = response.data;
        setMessages(oldMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [trade]);

  useEffect(() => {
    if (idUser === trade.sellerID) {
      setSeller(true);
    } else if (idUser === trade.buyerID) {
      setBuyer(true);
    }

    socket.emit("joinTradeRoom", trade._id);

    // Manejar evento de recepción de mensajes
    socket.on("message", handleMessageReceived);

    return () => {
      // Desuscribirse del evento al desmontar el componente
      socket.off("message", handleMessageReceived);
    };
  }, [idUser, trade]);

  const handleMessageReceived = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };
  const handleSendMessage = () => {
    if (!socket || !newMessage) return;

    // Enviar mensaje al servidor
    socket.emit("sendMessage", {
      tradeId: trade._id,
      message: newMessage,
      username: username,
    });

    setNewMessage("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Trade Chat</h1>

        <div className="border border-gray-300 p-4 mb-4 max-w-md">
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              <strong>{message.username}: </strong>
              {message.message}
            </div>
          ))}
        </div>

        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r"
          >
            Send
          </button>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4">Detalles del Trade</h1>
      {seller && (
        <div className="bg-orange-200 rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-xl mb-2">Esta es la ventana del vendedor</h2>
          <p>
            Aquí tendrás acceso a todas las funcionalidades relacionadas con el
            trade como la negociación, el pago y el envío.
          </p>
        </div>
      )}
      {buyer && (
        <div className="bg-gray-600 rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-xl mb-2">Esta es la ventana del comprador</h2>
          <p>
            Aquí podrás realizar la compra del artículo y coordinar los detalles
            con el vendedor.
          </p>
        </div>
      )}
      {!seller && !buyer && (
        <div className="bg-red-100 rounded-lg shadow-md p-4">
          <h2 className="text-xl mb-2">No tienes roles para este Trade</h2>
          <p>No tienes los permisos necesarios para acceder a esta página.</p>
        </div>
      )}
      {(seller || buyer) && currentState === "acuerdo" && (
        <Acuerdo
          trade={trade}
          post={post}
          seller={seller}
          buyer={buyer}
          setCurrentState={setCurrentState}
        />
      )}
    </div>
  );
}

export default TradeComponent;
