import React, {
  createContext,
  FC,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import Peer from "simple-peer";

interface Props {
  children: React.ReactNode;
}

interface Stream {
  stream: MediaStream | null;
  initiator: boolean;
  opponent: string | null;
}

export const StreamActionType = {
  SET_STREAM: "SET_STREAM",
  SET_MATCHING: "SET_MATCHING",
  DEL_ALL: "DEL_ALL",
};

const initialStreamState: Stream = {
  stream: null,
  initiator: false,
  opponent: null,
};

export const StreamContext = createContext<{
  streamInfo: Stream;
  dispatch: React.Dispatch<{
    type: string;
    payload?: any;
  }>;
}>({
  streamInfo: initialStreamState,
  dispatch: () => {},
});

const streamReducer = (
  state: Stream,
  action: { type: string; payload?: any }
): Stream => {
  switch (action.type) {
    case StreamActionType.SET_STREAM:
      return { ...state, stream: action.payload };
    case StreamActionType.SET_MATCHING:
      return {
        ...state,
        initiator: action.payload.initiator,
        opponent: action.payload.opponent,
      };
    case StreamActionType.DEL_ALL:
      return { stream: null, initiator: false, opponent: null };
    default:
      return state;
  }
};

const StreamProvider: FC<Props> = ({ children }) => {
  const [streamInfo, dispatch] = useReducer(streamReducer, initialStreamState);
  const value = useMemo(() => ({ streamInfo, dispatch }), [streamInfo]);

  return (
    <StreamContext.Provider value={value}>{children}</StreamContext.Provider>
  );
};

export default StreamProvider;