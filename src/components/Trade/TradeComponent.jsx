/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../contexts/socketContext";
import axios from "axios";
import Acuerdo from "./Acuerdo";
import Pago from "./Pago";
import Recibo from "./Recibo";
import Finalizado from "./Finalizado";
import uuid from "react-uuid";

function TradeComponent({
  trade,
  idUser,
  post,
  userData,
  sellerData,
  buyerData,
}) {
  const socket = useContext(SocketContext);

  const [username] = useState(userData.username);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [seller, setSeller] = useState(false);
  const [buyer, setBuyer] = useState(false);
  const [role, setRole] = useState();

  const [alerts, setAlerts] = useState([]);
  const [alertsReceived, setAlertsReceived] = useState([]);

  const [currentState, setCurrentState] = useState(post.currentState);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
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

    if (trade.alerts.length > 0) {
      setAlerts(trade.alerts);
    }
    if (trade.alerts.length > 0) {
      setAlertsReceived(trade.alerts);
    }
  }, [trade]);

  useEffect(() => {
    if (idUser === trade.sellerID) {
      setSeller(true);
      setRole("vendedor");
    } else if (idUser === trade.buyerID) {
      setBuyer(true);
      setRole("comprador");
    }
    socket.emit("joinTradeRoom", trade._id);

    socket.on(`alert_${trade._id}`, handleAlert);
    socket.on(`alertReceived_${trade._id}`, handleAlertReceived);
    // Manejar evento de recepción de mensajes
    socket.on("message", handleMessageReceived);

    return () => {
      // Desuscribirse del evento al desmontar el componente
      socket.off("message", handleMessageReceived);
      socket.off(`alert_${trade._id}`, handleAlert);
      socket.off(`alertReceived_${trade._id}`, handleAlertReceived);
    };
  }, [idUser, socket, trade]);

  const handleAlert = (payload) => {
    const newAlert = {
      id: uuid(), // Genera un identificador único para la alerta
      role: payload.role,
      message: payload.message,
    };

    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
  };
  const handleAlertReceived = (payload) => {
    const newAlert = {
      id: uuid(), // Genera un identificador único para la alerta
      role: payload.role,
      message: payload.message,
    };

    setAlertsReceived((prevAlerts) => [...prevAlerts, newAlert]);
  };

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

  const stateComponents = {
    acuerdo: (
      <Acuerdo
        post={post}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        currentState={currentState}
        role={role}
        setCurrentState={setCurrentState}
        trade={trade}
        sellerData={sellerData}
        buyerData={buyerData}
        seller={seller}
        buyer={buyer}
      />
    ),
    pago: (
      <Pago
        setAlerts={setAlerts}
        alerts={alerts}
        post={post}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        currentState={currentState}
        role={role}
        setCurrentState={setCurrentState}
        trade={trade}
        seller={seller}
        buyer={buyer}
        sellerData={sellerData}
        buyerData={buyerData}
      />
    ),
    recibo: (
      <Recibo
        setAlerts={setAlerts}
        alertsReceived={alertsReceived}
        post={post}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        currentState={currentState}
        role={role}
        setCurrentState={setCurrentState}
        trade={trade}
        seller={seller}
        buyer={buyer}
        sellerData={sellerData}
        buyerData={buyerData}
      />
    ),
    finalizado: (
      <Finalizado
        seller={seller}
        buyer={buyer}
        post={post}
        setCurrentState={setCurrentState}
        trade={trade}
        role={role}
      />
    ),
  };

  const component = stateComponents[currentState];

  return (
    <div className="">
      {seller && component}
      {buyer && component}
      {!seller && !buyer && (
        <div className="bg-red-300 rounded-lg shadow-md p-4">
          <h2 className="text-xl mb-2">No tienes roles para este Trade</h2>
          <p>No tienes los permisos necesarios para acceder a esta página.</p>
        </div>
      )}
    </div>
  );
}

export default TradeComponent;
