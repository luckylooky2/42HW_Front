import { useEffect, useState, useContext } from "react";
import { SocketContext } from "@contexts/SocketProvider";

export function useAudioInput() {
  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);
  const [selected, setSelected] = useState("마이크를 선택해 주세요.");
  const { socket } = useContext(SocketContext);

  const getAudioInputs = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const excludeDefault = devices
        .reverse()
        .filter((v) => v.deviceId !== "default");
      const inputs = excludeDefault.filter((v) => v.kind === "audioinput");

      setAudioInputs(inputs);
    } catch (e) {
      console.log("enumerateDevices", e);
    }
  };

  const findDeviceIdIndex = (target: string | null): number => {
    let deviceIdIndex = 0;

    for (let i = 0; i < audioInputs.length; i++) {
      const { deviceId } = audioInputs[i];
      if (target === deviceId) {
        deviceIdIndex = i;
      }
    }
    setSelected(audioInputs[deviceIdIndex].deviceId);
    return deviceIdIndex;
  };

  useEffect(() => {
    getAudioInputs();
  }, [socket]);

  return {
    audioInputs,
    selected,
    setSelected,
    refresh: getAudioInputs,
    findDeviceIdIndex,
  };
}
