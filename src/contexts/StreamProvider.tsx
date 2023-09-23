import React, { createContext, FC, useMemo, useReducer } from "react";
import { OpponentInfo } from "@typings/Call";

interface Props {
  children: React.ReactNode;
}

interface Stream {
  stream: MediaStream | null;
  roomName: string | null;
  roomType: string | null;
  opponent: OpponentInfo[] | null;
}

export const StreamActionType = {
  SET_STREAM: "SET_STREAM",
  SET_MATCHING: "SET_MATCHING",
  SET_ROOMTYPE: "SET_ROOMTYPE",
  DEL_ALL: "DEL_ALL",
};

const initialStreamState: Stream = {
  stream: null,
  roomName: null,
  roomType: null,
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
        roomName: action.payload.roomName,
        opponent: action.payload.opponent,
      };
    case StreamActionType.DEL_ALL:
      return {
        stream: null,
        roomName: null,
        roomType: null,
        opponent: null,
      };
    case StreamActionType.SET_ROOMTYPE:
      return {
        ...state,
        roomType: action.payload,
      };
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
