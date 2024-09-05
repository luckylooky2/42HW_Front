import { CallContext } from "@contexts/CallProvider";
import { useState, useEffect, useContext, FC, useRef } from "react";

interface Props {
  stream?: boolean;
  icon?: boolean;
  isSmallSize?: boolean;
  bgColor?: string;
}

const MicrophoneSoundChecker: FC<Props> = ({
  stream,
  icon = false,
  isSmallSize = false,
  bgColor = "white",
}) => {
  const { callInfo } = useContext(CallContext);
  const [value, setValue] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone =
      callInfo.stream && audioContext.createMediaStreamSource(callInfo.stream);

    microphone && microphone.connect(analyser);
    // destination 기본 값은 스피커. 스피커에 현재 audio context를 연결
    // 자신의 목소리가 잘 들리는지 확인하는 용도
    if (stream) {
      analyser.connect(audioContext.destination);
    }

    analyser.fftSize = 256; // FFT 크기 설정
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // 실시간으로 크기(음량) 모니터링
    function updateMicrophoneLevel() {
      analyser.getByteFrequencyData(dataArray);
      setValue(Math.floor(dataArray.reduce((a, b) => a + b) / 100));

      // dataArray에는 실시간으로 마이크 입력의 크기 정보가 들어있습니다.
      // dataArray를 이용하여 원하는 작업을 수행할 수 있습니다.
      requestAnimationFrame(updateMicrophoneLevel);
    }

    // 크기(음량) 모니터링 시작
    updateMicrophoneLevel();

    return () => {
      // 이후 통화에서는 자신의 목소리가 들리면 안되기 떄문에 스피커 연결 해제
      analyser.disconnect();
    };
  }, [stream, callInfo]);

  useEffect(() => {
    if (divRef && divRef.current)
      divRef.current.style.width = `${Math.min(100, value)}%`;
  }, [value]);

  return (
    <div className="flex justify-center gap-2 h-[20px]">
      {icon && (
        <img width="20" height="20" src="mute-off.svg" alt="mic-check" />
      )}
      <div className="flex gap-0.5">
        {Array.from({ length: 10 })
          .fill(null)
          .map((v, i) => {
            const offset = i + 1;
            const first = Math.floor(value / 10);
            return (
              <div
                key={i}
                className={`${
                  isSmallSize ? "w-[3px] h-[15px]" : "w-[10px]"
                } rounded-md`}
                style={{
                  background: `${offset < first ? "lightgreen" : bgColor}`,
                  // opacity: `${offset < first ? Math.max(5, offset) * 0.1 : 1}`,
                }}
              />
            );
          })}
      </div>
    </div>
  );
};

export default MicrophoneSoundChecker;

MicrophoneSoundChecker.defaultProps = {
  stream: false,
};
