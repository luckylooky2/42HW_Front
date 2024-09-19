import { AudioActionType, AudioContext } from "@contexts/AudioProvider";
import { useState, useContext } from "react";

export function useAudio() {
  const { audio, dispatch } = useContext(AudioContext);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const getAudioInputs = async () => {
    setIsAudioLoading(true);
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices
        .filter((v) => v.deviceId !== "" && v.kind === "audioinput")
        .sort((a, b) => {
          if (a.label.includes("Default")) return -1;
          if (b.label.includes("Default")) return 1;
          return 0;
        });

      dispatch({ type: AudioActionType.SET_AUDIOLIST, payload: audioInputs });
      setTimeout(() => {
        setIsAudioLoading(false);
      }, 100);
    } catch (e) {
      console.log("enumerateDevices", e);
    }
  };

  const findDeviceIdIndex = (target: string | null): number => {
    let deviceIdIndex = 0;

    for (let i = 0; i < audio.audioList.length; i++) {
      const { deviceId } = audio.audioList[i];
      if (target === deviceId) {
        deviceIdIndex = i;
      }
    }
    return deviceIdIndex;
  };

  return {
    stream: audio.stream,
    deviceId: audio.deviceId,
    audioList: audio.audioList,
    isAudioLoading,
    getAudioInputs,
  };
}
