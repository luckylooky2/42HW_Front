import { useContext } from "react";
import { CallActionType, CallContext } from "@contexts/CallProvider";

export function useStream() {
  const { callInfo, dispatch } = useContext(CallContext);

  const disconnectStream = () => {
    if (callInfo.stream) {
      callInfo.stream.getTracks().forEach((track) => {
        track.stop();
      });
      // dispatch({ type: CallActionType.DEL_ALL });
    }
  };

  const connectStream = async (deviceId: string) => {
    let stream = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: { deviceId: { exact: deviceId } },
      });
      dispatch({
        type: CallActionType.SET_STREAM,
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
    stream: callInfo.stream,
    deviceId: callInfo.deviceId,
    connectStream,
    disconnectStream,
  };
}
