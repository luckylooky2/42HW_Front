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
import { MIC_STATUS, PAGE, SINGLE_CALL, TRANSLATION } from "@utils/constant";
import Loading from "@utils/Loading";
import { useTranslation } from "react-i18next";

const Setting = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(TRANSLATION);
  const [isDone, setIsDone] = useState(false);
  const [micStatus, setMicStatus] = useState(MIC_STATUS.DENIED);
  const { myInfo } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const { callInfo, dispatch } = useContext(CallContext);
  const streamRef = useRef<MediaStream>(new MediaStream());
  const prevStatus = useRef<string>(MIC_STATUS.PROMPT);
  const [audioInputList, setAudioInputList] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputList, setAudioOutputList] = useState<MediaDeviceInfo[]>([]);
  const [currInputDeviceId, setCurrInputDeviceId] =
    useState("마이크를 선택해 주세요.");
  const [currOutputDeviceId, setCurrOutputDeviceId] =
    useState("스피커를 선택해 주세요.");

  console.log(callInfo.deviceId, currInputDeviceId);

  useEffect(() => {
    // 잘못된 접근했을 때
    if (myInfo === null || socket === null) {
      // stopAllStreams();
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
  }, [micStatus, socket]);

  useEffect(() => {
    if (audioInputList.length) {
      const targetIndex = findTargetIndex(audioInputList, callInfo.deviceId);
      setCurrInputDeviceId(audioInputList[targetIndex].deviceId);
      getUserMedia(audioInputList[targetIndex].deviceId);
    }

    if (audioOutputList.length) {
      setCurrOutputDeviceId(audioOutputList[0].deviceId);
    }
  }, [audioInputList]);

  // useEffect(() => {
  //   const id = setInterval(() => {
  //     pollMicAvailable();
  //   }, 300);

  //   return () => {
  //     clearInterval(id);
  //   };
  // }, []);

  // denied/granted와 allow/not allow는 다른 상태
  // safari는 2단계를 거침, chrome은 granted => allow, denied => not allow 같음
  const pollMicAvailable = async () => {
    const permissionName = "microphone" as PermissionName;
    const result = await navigator.permissions.query({ name: permissionName });
    // console.log(result, isDone);
    if (prevStatus.current !== result.state) {
      if (result.state === MIC_STATUS.DENIED)
        toast.error("마이크 권한을 허용해 주세요!");
      setMicStatus(result.state);
    }
    const agent = window.navigator.userAgent.toLowerCase();
    if (agent.indexOf("chrome") === -1) {
      if (
        prevStatus.current === MIC_STATUS.DENIED &&
        (result.state === MIC_STATUS.GRANTED ||
          result.state === MIC_STATUS.PROMPT)
      )
        toast.warning("새로고침이 필요합니다!");
    }
    prevStatus.current = result.state;
  };

  // const stopAllStreams = useCallback(() => {
  //   streamArray.current.forEach((stream) => {
  //     stream.getTracks().forEach((track) => {
  //       track.stop();
  //     });
  //   });
  //   dispatch({ type: CallActionType.DEL_ALL });
  // }, [callInfo]);

  // const stopPrevStreams = useCallback(() => {
  //   streamArray.current
  //     .filter((v, i) => i !== streamArray.current.length - 1)
  //     .forEach((stream) => {
  //       stream.getTracks().forEach((track) => {
  //         track.stop();
  //       });
  //     });
  // }, [callInfo]);

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
        // pollMicAvailable();
        // streamArray.current = [...streamArray.current, newStream];
        // console.log(streamRef.current);
      } catch (e) {
        // granted 인데 DOMException: Permission denied by system(Arc), NotAllowedError: The request is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.(Safari)이 뜨는 경우도 있음
        console.log("getUserMedia", e);
        // 크롬에서는 괜찮은데, 사파리에서는 granted라도 prompt 창이 떠야 연결이 됨
        // granted 가지고만 판단하면 안 됨
        // sarafi에서는 몇 번 하면, 세션에 저장되어 프롬프트가 뜨지 않음
        // INFO : 설정을 변경한 후 꼭 새로고침을 해주세요
        // INFO : safari에서 계속해서 마이크가 켜지지 않는 경우에는 창을 껐다 켜주세요
        dispatch({ type: CallActionType.SET_STREAM, payload: null });
        setIsDone(false);
      }
    },
    [isDone, micStatus, audioInputList]
  );

  const getDeviceList = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const filteredValid = devices.filter(
        (v) => v.deviceId !== "" && v.deviceId !== "default"
      );
      console.log(filteredValid);
      const inputs = filteredValid.filter((v) => v.kind === "audioinput");
      const outputs = filteredValid.filter((v) => v.kind === "audiooutput");

      setAudioInputList(inputs);
      setAudioOutputList(outputs);
    } catch (e) {
      console.log("enumerateDevices", e);
    }
  }, [audioInputList]);

  const goToMain = useCallback(() => {
    // stopAllStreams();
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
    // stopPrevStreams();

    if (!streamRef.current.active) {
      toast.error("마이크가 연결되지 않았습니다.");
      return;
    }
    navigate("/waiting");
  }, []);

  return socket === null ? (
    <Loading />
  ) : (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div>
        {t(
          `${PAGE.MAIN}.` +
            (callInfo.roomType === SINGLE_CALL.TYPE
              ? "singleCall"
              : "groupCall")
        )}
      </div>
      <div>{t(`${PAGE.SETTING}.info.permission`)}</div>
      <div className="h-[50%] flex flex-col justify-center items-center gap-2">
        <MicrophoneSoundChecker
          isDone={isDone}
          outputDeviceId={currOutputDeviceId}
        />
        <div>
          <label>마이크: </label>
          <select
            onInput={({ target }) => {
              const deviceId = target.value;
              const targetIndex = findTargetIndex(audioInputList, deviceId);
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
        <div>
          <label>스피커: </label>
          <select
            onInput={({ target }) => {
              const deviceId = target.value;
              const targetIndex = findTargetIndex(audioOutputList, deviceId);
              console.log(targetIndex);
              setCurrOutputDeviceId(audioOutputList[targetIndex].deviceId);
              console.log(audioOutputList[targetIndex].deviceId);
              // getUserMedia(deviceId);
            }}
            value={currOutputDeviceId}
          >
            {audioInputList.length === 0 && (
              <option>스피커를 연결해주세요</option>
            )}
            {audioOutputList.map((audio) => (
              <option key={audio.label} value={audio.deviceId}>
                {audio.label}
              </option>
            ))}
          </select>
        </div>
        <BasicButton
          onClick={() => callInfo.deviceId && getUserMedia(callInfo.deviceId)}
          text="재연결"
        />
        <BasicButton onClick={getDeviceList} text="마이크 리스트 불러오기" />
      </div>
      <div className="h-[10%]">
        <BasicButton
          onClick={goToWaiting}
          text={t(`${PAGE.SETTING}.button.start`)}
          // disabled={micStatus !== MIC_STATUS.GRANTED || !isDone}
        />
        <BasicButton
          onClick={goToMain}
          text={t(`${PAGE.SETTING}.button.back`)}
        />
      </div>
    </div>
  );
};

export default Setting;
