import { useAudioInput } from "@hooks/useAudioInput";
import { useMyInfo } from "@hooks/useMyInfo";
import { useRoomType } from "@hooks/useRoomType";
import { useStream } from "@hooks/useStream";
import BasicButton from "@utils/BasicButton";
import Header from "@utils/Header";
import Loading from "@utils/Loading";
import MicrophoneSoundChecker from "@utils/MicrophoneSoundChecker";
import { PAGE, TRANSLATION } from "@utils/constant";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Setting = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(TRANSLATION);
  const { isLoading, navigateIfDirectAccess } = useMyInfo();
  const [roomType] = useRoomType();
  const { deviceId, stream, connectStream, disconnectStream } = useStream();
  const { audioInputs, selected, setSelected, refresh, findDeviceIdIndex } =
    useAudioInput();

  useEffect(() => {
    navigateIfDirectAccess();
  }, []);

  // 이전 선택 그대로 유지
  useEffect(() => {
    if (audioInputs.length) {
      const index = findDeviceIdIndex(deviceId);
      getMicrophone(audioInputs[index].deviceId);
    }
  }, [audioInputs]);

  const getMicrophone = async (deviceId: string) => {
    if (isLoading) {
      return;
    }

    disconnectStream();
    await connectStream(deviceId);
    setSelected(deviceId);
  };

  const goToMain = useCallback(() => {
    navigate("/main");
  }, []);

  const goToWaiting = useCallback(() => {
    if (!(stream && stream.active)) {
      toast.error("마이크가 연결되지 않았습니다.");
      return;
    }
    navigate("/waiting");
  }, [stream]);

  const handleInput = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    const targetDeviceId = target.value;
    getMicrophone(targetDeviceId);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Header
      onClick={goToMain}
      title={`Mic Setting: ${t(`${PAGE.MAIN}.${roomType}Call`)}`}
    >
      <div className="flex flex-col w-full h-full justify-around items-center">
        <section className="flex flex-col justify-center items-center gap-10">
          <div className="w-[350px] h-[300px] flex flex-col justify-around items-center gap-2 rounded-lg bg-gray-100">
            <div className="flex justify-around items-center gap-5 h-[200px]">
              <MicrophoneSoundChecker stream={!!stream} icon={true} />
            </div>
            <div className="flex w-[90%] justify-center gap-3">
              <div>
                <label>Mic: </label>
                <select
                  className="w-[200px] rounded-md"
                  onInput={handleInput}
                  value={selected}
                >
                  {audioInputs.length === 0 && (
                    <option>마이크를 연결해주세요.</option>
                  )}
                  {audioInputs.map((audio) => (
                    <option key={audio.label} value={audio.deviceId}>
                      {audio.label ? audio.label : "Built-in Microphone"}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={refresh}>
                <img
                  width="15"
                  height="15"
                  src="refresh.png"
                  alt="reList"
                  className="transition-transform duration-500 transform hover:rotate-180"
                />
              </button>
            </div>
          </div>
          <div>
            <div>* {t(`${PAGE.SETTING}.info.permission`)}</div>
            <div>
              * Please configure the speaker output using the system settings.
            </div>
          </div>
        </section>

        <div>
          <BasicButton
            onClick={goToWaiting}
            text={t(`${PAGE.SETTING}.button.start`)}
          />
        </div>
      </div>
    </Header>
  );
};

export default Setting;
