import { StreamContext } from "@contexts/StreamProvider";
import { useState, useEffect, useContext, FC } from "react";

interface Props {
  isDone?: boolean;
}

const MicrophoneSoundChecker: FC<Props> = ({ isDone }) => {
  const { streamInfo } = useContext(StreamContext);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone =
      streamInfo.stream &&
      audioContext.createMediaStreamSource(streamInfo.stream);

    microphone && microphone.connect(analyser);
    // destination 기본 값은 스피커. 스피커에 현재 audio context를 연결
    if (isDone) analyser.connect(audioContext.destination);

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
      // 마이크 입력 중지
      if (microphone) {
        microphone.mediaStream.getTracks().forEach((track) => {
          track.stop();
        }); // 마이크 트랙 가져오기
      }
    };
  }, [isDone]);

  return <div>{value}</div>;
};

export default MicrophoneSoundChecker;

MicrophoneSoundChecker.defaultProps = {
  isDone: false,
};
