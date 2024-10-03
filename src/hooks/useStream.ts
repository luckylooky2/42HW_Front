import { AudioActionType, AudioContext } from "@contexts/AudioProvider";
import { useContext } from "react";

export function useStream() {
  const { audio, dispatch } = useContext(AudioContext);

  const disconnectStream = () => {
    if (audio.stream) {
      audio.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  // safari에서는 default라는 deviceId가 존재하지 않음
  const connectStream = async (deviceId?: string) => {
    let stream = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
      });
      dispatch({
        type: AudioActionType.SET_STREAM,
        payload: { stream: stream, deviceId: deviceId },
      });
      // 내부에서 disconnectStream를 호출하면 클로저 때문에 바뀌기 전 callInfo가 참조
      // callInfo가 최신으로 리렌더링되는 Setting.tsx에서 처리
    } catch (e) {
      console.log("getUserMedia", e);
    }

    return stream;
  };

  return {
    stream: audio.stream,
    deviceId: audio.deviceId,
    connectStream,
    disconnectStream,
  };
}
