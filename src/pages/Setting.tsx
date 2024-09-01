import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  MutableRefObject,
} from "react";
import { useNavigate } from "react-router";
import { SocketContext } from "@contexts/SocketProvider";
import { AuthContext } from "@contexts/AuthProvider";
import { CallContext, CallActionType } from "@contexts/CallProvider";
import { toast } from "react-toastify";
import BasicButton from "@utils/BasicButton";
import MicrophoneSoundChecker from "@utils/MicrophoneSoundChecker";
import { PAGE, SINGLE_CALL, TRANSLATION } from "@utils/constant";
import Loading from "@utils/Loading";
import { useTranslation } from "react-i18next";
import Header from "@utils/Header";

const Setting = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(TRANSLATION);
  const [isDone, setIsDone] = useState(false);
  const { myInfo } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const { callInfo, dispatch } = useContext(CallContext);
  const streamRef = useRef<MediaStream>(new MediaStream());
  const [audioInputList, setAudioInputList] = useState<MediaDeviceInfo[]>([]);
  const [currInputDeviceId, setCurrInputDeviceId] =
    useState("마이크를 선택해 주세요.");

  console.log(callInfo.deviceId, currInputDeviceId);

  useEffect(() => {
    // 잘못된 접근했을 때
    if (myInfo === null || socket === null) {
      navigate("/main");
    }
  }, []);

  const findTargetIndex = (
    arr: MediaDeviceInfo[],
    target: string | null
  ): number => {
    let targetIndex = 0;

    for (let i = 0; i < arr.length; i++) {
      const { deviceId } = arr[i];
      if (target === deviceId) {
        targetIndex = i;
      }
    }
    return targetIndex;
  };

  // 크롬에서는 원래 거부되었을 경우 : denied
  // 사파리에서는 : denied -> prompt로 바뀜
  useEffect(() => {
    getDeviceList();
  }, [socket]);

  useEffect(() => {
    if (audioInputList.length) {
      const targetIndex = findTargetIndex(audioInputList, callInfo.deviceId);
      setCurrInputDeviceId(audioInputList[targetIndex].deviceId);
      getUserMedia(audioInputList[targetIndex].deviceId);
    }
  }, [audioInputList]);

  const getUserMedia = useCallback(
    async (deviceId: string | undefined = undefined) => {
      if (myInfo == null || socket === null) return;

      let newStream;
      try {
        newStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: { deviceId: { exact: deviceId } },
        });

        dispatch({
          type: CallActionType.SET_STREAM,
          payload: { stream: newStream, deviceId: deviceId },
        });
        setIsDone(true);

        streamRef.current.getAudioTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = newStream;
      } catch (e) {
        // granted 인데 DOMException: Permission denied by system(Arc), NotAllowedError: The request is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.(Safari)이 뜨는 경우도 있음
        console.log("getUserMedia", e);
        // 크롬에서는 괜찮은데, 사파리에서는 granted라도 prompt 창이 떠야 연결이 됨
        // granted 가지고만 판단하면 안 됨
        // sarafi에서는 몇 번 하면, 세션에 저장되어 프롬프트가 뜨지 않음
        // INFO : 설정을 변경한 후 꼭 새로고침을 해주세요
        // INFO : safari에서 계속해서 마이크가 켜지지 않는 경우에는 창을 껐다 켜주세요
      }
    },
    [isDone, audioInputList]
  );

  const getDeviceList = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const excludeDefault = devices.filter((v) => v.deviceId !== "default");
      const inputs = excludeDefault.filter((v) => v.kind === "audioinput");

      setAudioInputList(inputs);
    } catch (e) {
      console.log("enumerateDevices", e);
    }
  }, [audioInputList]);

  const goToMain = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
    dispatch({
      type: CallActionType.DEL_ALL,
    });

    navigate("/main");
  }, []);

  const goToWaiting = useCallback(() => {
    if (!streamRef.current.active) {
      toast.error("마이크가 연결되지 않았습니다.");
      return;
    }
    navigate("/waiting");
  }, []);

  return socket === null ? (
    <Loading />
  ) : (
    <Header
      onClick={goToMain}
      title={`Microphone Setting: ${t(
        `${PAGE.MAIN}.` +
          (callInfo.roomType === SINGLE_CALL.TYPE ? "singleCall" : "groupCall")
      )}`}
    >
      <div className="flex flex-col w-full h-full justify-around items-center">
        <section className="flex flex-col justify-center items-center gap-10">
          <div className="w-[350px] h-[300px] flex flex-col justify-around items-center gap-2 rounded-lg bg-gray-100">
            <div className="flex justify-around items-center gap-5 h-[200px]">
              <MicrophoneSoundChecker isDone={isDone} icon={true} />
            </div>
            <div className="flex w-[90%] justify-center gap-3">
              <div>
                <label>Mic: </label>
                <select
                  className="w-[200px] rounded-md"
                  onInput={({ target }) => {
                    const deviceId = target.value;
                    const targetIndex = findTargetIndex(
                      audioInputList,
                      deviceId
                    );
                    console.log(targetIndex);
                    setCurrInputDeviceId(audioInputList[targetIndex].deviceId);
                    getUserMedia(deviceId);
                  }}
                  value={currInputDeviceId}
                >
                  {audioInputList.length === 0 && (
                    <option>마이크를 연결해주세요</option>
                  )}
                  {audioInputList.map((audio) => (
                    <option key={audio.label} value={audio.deviceId}>
                      {audio.label}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={getDeviceList}>
                <img
                  width="15"
                  height="15"
                  src="public/refresh.png"
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
