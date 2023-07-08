import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../contexts/socketContext";

const ChatComponent = () => {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (socket) {
      socket.on("message", (data) => {
        // Recibir mensajes del servidor

        console.log(data)
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    }
  }, [socket]);

  const sendMessage = () => {
    if (socket && inputValue.trim() !== "") {
      socket.emit("message", inputValue); // Enviar mensaje al servidor
      setInputValue("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default ChatComponent;
