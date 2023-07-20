import io from "socket.io-client";
import { useEffect, useState } from "react";
function ComponentWebSockets() {
  const [connectionsCount, setConnectionsCount] = useState(0);

  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [userName, setUserName] = useState("");
  const [test, setTest] = useState();

  useEffect(() => {
    const socket = io("http://localhost:81");
    socket.on("connect", () => {
      //   console.log(`Alguien se conecto`);
      //  socket.emit(
      //  "mensajeCliente",
      //"¡Hola soy REACT y quiero entrar en el Backend!!!"
      // );
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // socket.on("mensajeServidor", (mensaje) => {
    // console.log("Mensaje recibido desde el servidor:", mensaje);
    //});

    socket.on("connections", (count) => {
      //     console.log(count);
      setConnectionsCount(count);
    });

    socket.on("userJoined", (userId) => {
      console.log("User joined", userId);
      setTest("El usuario con el id:" + userId + " se ha conectado");
    });

    socket.on("userLeft", (userId) => {
      console.log("User left", userId);
    });

    socket.on("newMessage", (message) => {
      console.log("New message", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("msg", (msg) => {
      console.log("new message:", msg);
    });

    socket.on("testing", (msg) => {
      console.log(msg);
    });
    setSocket(socket);

    return () => {
      socket.disconnect(); // Desconectar cuando se desmonte el componente
    };
  }, []);

  const handleJoinRoom = () => {
    if (room.trim() !== "") {
      socket.emit("joinRoom", { room, userName });
    }
  };

  const handleLeaveRoom = () => {
    // if (room.trim() !== "") {
    // socket.emit("leaveRoom", room);
    //}

    socket.emit

    socket.emit("testing", "");
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      socket.emit("sendMessage", { room, message: inputValue, userName });
      setInputValue("");
    }
  };
  return (
    <div>
      <h1 className="text-center text-6xl pt-10">
        HAS ENTRADO A LA APP. {connectionsCount} Usuarios conectados
      </h1>
      <div className="p-16 flex justify-center bg-green-300">
        <input
          className="m-1"
          placeholder="Nombre room"
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <input
          className="m-1"
          placeholder="Nombre de usuario"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button onClick={handleJoinRoom} className="bg-green-400 p-2 mr-1">
          Join Room
        </button>
        <button onClick={handleLeaveRoom} className="bg-red-600 p-2 ml-1">
          Leave Room
        </button>
      </div>
      <div className="flex justify-center bg-yellow-300">
        <h2>{test ? test : "No se ha conectado nadie"}</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              <strong>{message.user}: </strong>
              {message.message}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center bg-green-600">
        <input
          placeholder="send message..."
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="m-1 p-1"
        />
        <button onClick={handleSendMessage} className="bg-yellow-500 p-1 m-1">
          Send Message
        </button>
      </div>
    </div>
  );
}

export default ComponentWebSockets;
