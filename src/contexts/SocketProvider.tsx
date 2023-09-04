import React, { FC, useState, createContext, useMemo } from "react";
import { Socket } from "socket.io-client";

interface Props {
  children: React.ReactNode;
}

export const SocketContext = createContext<{
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}>({
  socket: null,
  setSocket: () => {},
});

const SocketProvider: FC<Props> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const value = useMemo(() => ({ socket, setSocket }), [socket, setSocket]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
