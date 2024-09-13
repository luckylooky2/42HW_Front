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
import { ClipLoader, PulseLoader } from "react-spinners";
import { toast, Id } from "react-toastify";

const Setting = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(TRANSLATION);
  const { myInfo, isLoading, navigateIfDirectAccess } = useMyInfo();
  const { socket } = useSocket();
  const { dispatch } = useContext(CallContext);
  const [matchStatus, setMatchStatus] = useState(MATCHSTATUS.WAITING);
  const [roomType] = useRoomType();
  const { deviceId, stream, connectStream, disconnectStream } = useStream();
  const {
    audioList,
    isAudioLoading,
    selectedDeviceId,
    setSelectedDeviceId,
    refresh,
    findDeviceIdIndex,
  } = useAudio();
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
    if (audioList.length) {
      const index = findDeviceIdIndex(deviceId);
      getMicrophone(audioList[index].deviceId);
    }
  }, [audioList]);

  const getMicrophone = async (deviceId: string) => {
    if (isLoading) {
      return;
    }

    disconnectStream();
    await connectStream(deviceId);
    setSelectedDeviceId(deviceId);
  };

  useEffect(() => {
    socket?.on(
      "matching",
      (data: { opponent: OpponentInfo[]; roomName: string }) => {
        console.log("matching");
        setMatchStatus(MATCHSTATUS.COMPLETED);
        dispatch({
          type: CallActionType.SET_MATCHING,
          payload: {
            opponent: data.opponent,
            roomName: data.roomName,
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
              <MicrophoneSoundChecker icon={true} />
            </div>
            <div className="flex w-[90%] justify-center gap-3">
              {isAudioLoading ? (
                <ClipLoader size="25px" />
              ) : (
                <>
                  <div>
                    <label>Mic: </label>
                    <select
                      className="w-[200px] rounded-md"
                      onInput={handleInput}
                      value={selectedDeviceId}
                    >
                      {audioList.length === 0 && (
                        <option>마이크를 연결해주세요.</option>
                      )}
                      {audioList.map((audio) => (
                        <option key={audio.label} value={audio.deviceId}>
                          {audio.label}
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
                    />
                  </button>
                </>
              )}
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
