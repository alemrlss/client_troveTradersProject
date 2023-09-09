import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { getIdUser } from "../services/Auth";

const SocketContext = createContext();

// eslint-disable-next-line react/prop-types
const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  //~ Cuando el contexto inciia se hace la conexion y mediante el query se le especifica al backend cada userId que entra en el server..
  useEffect(() => {
    const newSocket = io("http://localhost:81", {
      query: {
        userId: getIdUser(),
      },
    });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
