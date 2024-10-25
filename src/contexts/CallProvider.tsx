import { CallInfo } from "@typings/front";
import React, { createContext, FC, useMemo, useReducer } from "react";

interface Props {
  children: React.ReactNode;
}

export const CallActionType = {
  SET_MATCHING: "SET_MATCHING",
  SET_ROOMTYPE: "SET_ROOMTYPE",
  SET_CURRNUM: "SET_CURRNUM",
  DEL_ALL: "DEL_ALL",
};

const initialCallState: CallInfo = {
  roomName: null,
  roomType: null,
  opponent: null,
  currNum: null,
  myIndex: null,
};

export const CallContext = createContext<{
  callInfo: CallInfo;
  dispatch: React.Dispatch<{
    type: string;
    payload?: any;
  }>;
}>({
  callInfo: initialCallState,
  dispatch: () => {},
});

const callReducer = (
  state: CallInfo,
  action: { type: string; payload?: any }
): CallInfo => {
  switch (action.type) {
    case CallActionType.SET_MATCHING:
      return {
        ...state,
        roomName: action.payload.roomName,
        opponent: action.payload.opponent,
        myIndex: action.payload.myIndex,
      };
    case CallActionType.DEL_ALL:
      return {
        roomName: null,
        roomType: null,
        opponent: null,
        currNum: null,
        myIndex: null,
      };
    case CallActionType.SET_ROOMTYPE:
      return {
        ...state,
        roomType: action.payload,
      };
    case CallActionType.SET_CURRNUM:
      return {
        ...state,
        currNum: action.payload,
      };
    default:
      return state;
  }
};

const CallProvider: FC<Props> = ({ children }) => {
  const [callInfo, dispatch] = useReducer(callReducer, initialCallState);
  const value = useMemo(() => ({ callInfo, dispatch }), [callInfo]);

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export default CallProvider;
