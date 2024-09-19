import { useAudio } from "@hooks/useAudio";
import { useStream } from "@hooks/useStream";
import { ClipLoader } from "react-spinners";

const MicrophoneSelector = () => {
  const { audioList, isAudioLoading, deviceId, getAudioInputs } = useAudio();
  const { connectStream, disconnectStream } = useStream();

  const handleInput = async ({
    target,
  }: React.ChangeEvent<HTMLSelectElement>) => {
    const targetDeviceId = target.value;
    disconnectStream();
    await connectStream(targetDeviceId);
  };

  return isAudioLoading ? (
    <ClipLoader size="25px" />
  ) : (
    <>
      <div>
        <label>Mic: </label>
        <select
          className="w-[200px] rounded-md"
          onInput={handleInput}
          value={deviceId ? deviceId : "default"}
        >
          {audioList.length === 0 && <option>마이크를 연결해주세요.</option>}
          {audioList.map((audio) => (
            <option key={audio.label} value={audio.deviceId}>
              {audio.label}
            </option>
          ))}
        </select>
      </div>
      <button onClick={getAudioInputs}>
        <img width="15" height="15" src="refresh.png" alt="reList" />
      </button>
    </>
  );
};

export default MicrophoneSelector;
