import { AudioActionType, AudioContext } from "@contexts/AudioProvider";
import { SocketContext } from "@contexts/SocketProvider";
import { useEffect, useState, useContext } from "react";

export function useAudio() {
  const [selectedDeviceId, setSelectedDeviceId] =
    useState("마이크를 선택해 주세요.");
  const { socket } = useContext(SocketContext);
  const { audio, dispatch } = useContext(AudioContext);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const getAudioInputs = async () => {
    setIsAudioLoading(true);
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const excludeDefault = devices.filter(
        (v) => v.deviceId !== "default" && v.deviceId !== ""
      );
      const inputs = excludeDefault.filter((v) => v.kind === "audioinput");

      dispatch({ type: AudioActionType.SET_AUDIOLIST, payload: inputs });
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
    setSelectedDeviceId(audio.audioList[deviceIdIndex].deviceId);
    return deviceIdIndex;
  };

  useEffect(() => {
    // useAudio가 호출될때마다 dispatch 로직이 실행되어서 발생한 오류
    if (!audio.audioList.length) {
      getAudioInputs();
    }
  }, [socket]);

  return {
    stream: audio.stream,
    deviceId: audio.deviceId,
    audioList: audio.audioList,
    isAudioLoading,
    selectedDeviceId,
    setSelectedDeviceId,
    refresh: getAudioInputs,
    findDeviceIdIndex,
  };
}
