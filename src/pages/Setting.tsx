import MicrophoneSelector from "@components/Setting/MicrophoneSelector";
import { CallContext, CallActionType } from "@contexts/CallProvider";
import { useAudio } from "@hooks/useAudio";
import { useMyInfo } from "@hooks/useMyInfo";
import { useRoomType } from "@hooks/useRoomType";
import { useSocket } from "@hooks/useSocket";
import { useStream } from "@hooks/useStream";
import { OpponentInfo } from "@typings/front";
import Header from "@utils/Header";
import Loading from "@utils/Loading";
import MicrophoneSoundChecker from "@utils/MicrophoneSoundChecker";
import TextButton from "@utils/TextButton";
import {
  PAGE,
  TRANSLATION,
  COUNT,
  MILLISECOND,
  MATCHSTATUS,
} from "@utils/constant";
import { useCallback, useEffect, useContext, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { PulseLoader } from "react-spinners";
import { toast, Id } from "react-toastify";

const Setting = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(TRANSLATION);
  const { myInfo, isLoading, navigateIfDirectAccess } = useMyInfo();
  const { socket } = useSocket();
  const { dispatch } = useContext(CallContext);
  const [matchStatus, setMatchStatus] = useState(MATCHSTATUS.WAITING);
  const [roomType] = useRoomType();
  const { stream, connectStream, disconnectStream } = useStream();
  const { getAudioInputs } = useAudio();
  const matchToastId = useRef<Id>(-1);

  useEffect(() => {
    navigateIfDirectAccess();

    return () => {
      matchingStop();
    };
  }, []);

  useEffect(() => {
    if (!roomType) {
      navigate("/main");
    }
  }, [roomType]);

  useEffect(() => {
    const init = async () => {
      disconnectStream();
      await connectStream();
      // enumerateDevices는 getUserMedia를 호출한 뒤에만 사용할 수 있음
      await getAudioInputs();
    };

    init();
  }, []);

  useEffect(() => {
    socket?.on(
      "matching",
      (data: { opponent: OpponentInfo[]; roomName: string }) => {
        console.log("matching");
        const myIndex =
          data.opponent
            .map(({ peerIndex }) => peerIndex)
            .reduce((acc, curr) => acc + curr, 0) /
          ((data.opponent.length + 1) / 2);
        const opponent = new Array(data.opponent.length + 1).fill(null);

        for (let i = 0, j = 0; i < opponent.length; i++) {
          if (i === myIndex) {
            continue;
          }
          opponent[i] = data.opponent[j++];
        }

        setMatchStatus(MATCHSTATUS.COMPLETED);
        dispatch({
          type: CallActionType.SET_MATCHING,
          payload: {
            opponent: opponent,
            roomName: data.roomName,
            myIndex: myIndex,
          },
        });
        setTimeout(() => {
          toast.success("매칭이 완료되었습니다.");
          toast.done(matchToastId.current);
          matchToastId.current = -1;
        }, COUNT.DEFAULT * MILLISECOND);
        setTimeout(() => {
          navigate("/call");
        }, COUNT.MATCH * MILLISECOND);
      }
    );

    return () => {
      socket?.off("matching");
    };
  }, [socket, matchToastId]);

  const goToMain = useCallback(() => {
    navigate("/main");
  }, []);

  const matchingStart = useCallback(() => {
    if (!(stream && stream.active)) {
      toast.error("마이크가 연결되지 않았습니다.");
      return;
    }

    socket?.emit("register", {
      nickname: myInfo?.nickname,
      type: roomType,
    });
    setMatchStatus(MATCHSTATUS.MATCHING);
    const id = toast(
      <PulseLoader
        color="gray"
        size={10}
        aria-label="Loading Spinner"
        data-testid="loader"
        className="pt-5 w-[45px] mx-auto"
      />,
      { autoClose: false }
    );
    matchToastId.current = id;
  }, [stream]);

  const matchingStop = () => {
    socket?.emit("unregister", {
      nickname: myInfo?.nickname,
    });
    setMatchStatus(MATCHSTATUS.WAITING);
    toast.done(matchToastId.current);
    matchToastId.current = -1;
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
              <MicrophoneSoundChecker stream={stream!} icon={true} />
            </div>
            <div className="flex w-[90%] justify-center gap-3">
              <MicrophoneSelector />
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
          <TextButton
            onClick={matchStatus > 0 ? matchingStop : matchingStart}
            text={
              matchStatus > 0 ? "매칭 취소" : t(`${PAGE.SETTING}.button.start`)
            }
            disabled={matchStatus === MATCHSTATUS.COMPLETED}
          />
        </div>
      </div>
    </Header>
  );
};

export default Setting;
