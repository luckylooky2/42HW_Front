import { SocketContext } from "@contexts/SocketProvider";
import { API_URL } from "@utils/constant";
import { useContext } from "react";
import { io } from "socket.io-client";

export function useSocket() {
  const { socket, setSocket } = useContext(SocketContext);

  const connectSocket = () => {
    if (socket === null) {
      const sock = io(`${API_URL}`);
      setSocket(sock);
    }
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
    }
    setSocket(null);
  };

  return { socket, connectSocket, disconnectSocket };
}
