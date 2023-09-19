import { useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import Loading from "@utils/Loading";
import BasicButton from "@utils/BasicButton";
import { SocketContext } from "@contexts/SocketProvider";
import { AuthContext } from "@contexts/AuthProvider";
import { StreamContext, StreamActionType } from "@contexts/StreamProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { COUNT, MILLISECOND } from "@utils/constant";

const Waiting = () => {
  const navigate = useNavigate();
  const { myInfo } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const { streamInfo, dispatch } = useContext(StreamContext);

  useEffect(() => {
    if (myInfo === null) {
      stopMicrophone();
      navigate("/main");
    }
  }, []);
  console.log(streamInfo.stream);

  useEffect(() => {
    if (socket) {
      socket.on(
        "matching",
        (data: {
          initiator: boolean;
          opponentNickname: string;
          roomName: string;
        }) => {
          console.log("matching");
          console.log(data);
          dispatch({
            type: StreamActionType.SET_MATCHING,
            payload: {
              initiator: data.initiator,
              opponentNickname: data.opponentNickname,
              roomName: data.roomName,
            },
          });
          toast.info("매칭이 완료되었습니다.");
          setTimeout(() => {
            navigate("/call");
          }, COUNT.MATCH * MILLISECOND);
        }
      );
    }

    return () => {
      socket?.off("matching");
    };
  }, [socket, streamInfo]);

  useEffect(() => {
    if (socket) socket.emit("registerSingle", { nickname: myInfo?.nickname });
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", preventClose);

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);

  const cancelWaiting = useCallback(() => {
    dispatch({ type: StreamActionType.DEL_ALL });
    stopMicrophone();
    navigate("/main");
  }, [streamInfo]);

  const stopMicrophone = useCallback(() => {
    const tracks = streamInfo.stream?.getAudioTracks();
    if (tracks) tracks[0].stop();
  }, [streamInfo]);

  const preventClose = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = true;
  }, []);

  return (
    <Loading text={"상대방을 찾는 중입니다."}>
      <div className="my-auto">
        <BasicButton onClick={cancelWaiting} text="매칭 취소하기" />
      </div>
    </Loading>
  );
};

export default Waiting;
