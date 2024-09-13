import { AudioInfo } from "@typings/front";
import React, { createContext, FC, useMemo, useReducer } from "react";

interface Props {
  children: React.ReactNode;
}

export const AudioActionType = {
  SET_STREAM: "SET_STREAM",
  SET_AUDIOLIST: "SET_AUDIOLIST",
  DEL_ALL: "DEL_ALL",
};

const initialAudioState: AudioInfo = {
  stream: null,
  deviceId: null,
  audioList: [],
};

export const AudioContext = createContext<{
  audio: AudioInfo;
  dispatch: React.Dispatch<{
    type: string;
    payload?: any;
  }>;
}>({
  audio: initialAudioState,
  dispatch: () => {},
});

const callReducer = (
  state: AudioInfo,
  action: { type: string; payload?: any }
): AudioInfo => {
  switch (action.type) {
    case AudioActionType.SET_STREAM:
      return {
        ...state,
        stream: action.payload.stream,
        deviceId: action.payload.deviceId,
      };
    case AudioActionType.SET_AUDIOLIST:
      return {
        ...state,
        audioList: action.payload,
      };
    case AudioActionType.DEL_ALL:
      return {
        stream: null,
        deviceId: null,
        audioList: [],
      };
    default:
      return state;
  }
};

const AudioProvider: FC<Props> = ({ children }) => {
  const [audio, dispatch] = useReducer(callReducer, initialAudioState);
  const value = useMemo(() => ({ audio, dispatch }), [audio]);

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

export default AudioProvider;
