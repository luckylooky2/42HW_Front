import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { SocketContext } from "@contexts/SocketProvider";
import { AuthContext } from "@contexts/AuthProvider";
import { StreamContext, StreamActionType } from "@contexts/StreamProvider";
import { toast } from "react-toastify";
import BasicButton from "@utils/BasicButton";
import MicrophoneSoundChecker from "@utils/MicrophoneSoundChecker";
import { MIC_STATUS } from "@utils/constant";

const Setting = () => {
  const navigate = useNavigate();
  const [isDone, setIsDone] = useState(false);
  const [micStatus, setMicStatus] = useState(MIC_STATUS.DENIED);
  const { myInfo } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const { streamInfo, dispatch } = useContext(StreamContext);
  const streamArray = useRef<MediaStream[]>([]);

  useEffect(() => {
    if (myInfo === null) {
      stopAllStreams();
      navigate("/main");
    }
    getUserMedia();
  }, [micStatus]);

  useEffect(() => {
    const id = setInterval(() => {
      pollMicAvailable();
    }, 300);

    return () => {
      clearInterval(id);
    };
  }, []);

  const pollMicAvailable = async () => {
    const permissionName = "microphone" as PermissionName;
    const result = await navigator.permissions.query({ name: permissionName });
    setMicStatus(result.state);
  };

  const stopAllStreams = useCallback(() => {
    streamArray.current.forEach((stream) => {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    });
    dispatch({ type: StreamActionType.DEL_ALL });
  }, [streamInfo]);

  const stopPrevStreams = useCallback(() => {
    streamArray.current
      .filter((v, i) => i !== streamArray.current.length - 1)
      .forEach((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      });
  }, [streamInfo]);

  const getUserMedia = useCallback(async () => {
    if (myInfo == null || socket === null) return;

    let newStream;
    try {
      newStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      console.log(newStream);
      dispatch({ type: StreamActionType.SET_STREAM, payload: newStream });
      setIsDone(true);
      streamArray.current = [...streamArray.current, newStream];
    } catch (e) {
      toast.error("마이크 권한을 허용해 주세요!");
      dispatch({ type: StreamActionType.DEL_ALL });
      setIsDone(false);
    }
  }, []);

  const goToMain = useCallback(() => {
    stopAllStreams();
    navigate("/main");
  }, []);

  const goToWaiting = useCallback(() => {
    stopPrevStreams();
    navigate("/waiting");
  }, []);

  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div className="h-[50%]">
        <MicrophoneSoundChecker isDone={isDone} />
      </div>
      <div className="h-[10%]">
        <BasicButton
          onClick={goToWaiting}
          text="매칭 시작하기"
          disabled={micStatus !== MIC_STATUS.GRANTED}
        />
        <BasicButton onClick={goToMain} text="뒤로 가기" />
      </div>
    </div>
  );
};

export default Setting;
