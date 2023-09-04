import React, { createContext, FC, useEffect, useMemo, useState } from "react";
import Peer from "simple-peer";

interface Props {
  children: React.ReactNode;
}

export interface CustomPeer extends Peer.Instance {
  initiator?: boolean;
}

export const StreamContext = createContext<{
  stream: any;
  setStream: React.Dispatch<React.SetStateAction<any>>;
  peer: CustomPeer | null;
  setPeer: React.Dispatch<React.SetStateAction<CustomPeer | null>>;
}>({
  stream: null,
  setStream: () => {},
  peer: null,
  setPeer: () => {},
});

const StreamProvider: FC<Props> = ({ children }) => {
  // useState를 사용하면, context를 자식 컴포넌트에서도 업데이트할 수 있음
  const [stream, setStream] = useState<any>(null);
  const [peer, setPeer] = useState<CustomPeer | null>(null);
  const value = useMemo(
    () => ({ stream, setStream, peer, setPeer }),
    [stream, setStream, peer, setPeer]
  );

  return (
    <StreamContext.Provider value={value}>{children}</StreamContext.Provider>
  );
};

export default StreamProvider;
