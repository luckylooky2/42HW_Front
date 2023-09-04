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
  initiator: boolean;
  setInitiator: React.Dispatch<React.SetStateAction<boolean>>;
  opponent: string | null;
  setOpponent: React.Dispatch<React.SetStateAction<string | null>>;
}>({
  stream: null,
  setStream: () => {},
  initiator: false,
  setInitiator: () => {},
  opponent: null,
  setOpponent: () => {},
});

const StreamProvider: FC<Props> = ({ children }) => {
  // useState를 사용하면, context를 자식 컴포넌트에서도 업데이트할 수 있음
  // useReducer ?
  const [stream, setStream] = useState<any>(null);
  const [initiator, setInitiator] = useState<boolean>(false);
  const [opponent, setOpponent] = useState<string | null>(null);
  const value = useMemo(
    () => ({
      stream,
      setStream,
      initiator,
      setInitiator,
      opponent,
      setOpponent,
    }),
    [stream, setStream, initiator, setInitiator, opponent, setOpponent]
  );

  return (
    <StreamContext.Provider value={value}>{children}</StreamContext.Provider>
  );
};

export default StreamProvider;
