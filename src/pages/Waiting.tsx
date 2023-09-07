import { useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import Loading from "@utils/Loading";
import BasicButton from "@utils/BasicButton";
import { SocketContext } from "@contexts/SocketProvider";
import { AuthContext } from "@contexts/AuthProvider";
import { StreamContext, StreamActionType } from "@contexts/StreamProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { READY_COUNT } from "@utils/constant";

const Waiting = () => {
  const navigate = useNavigate();
  const { myInfo } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const { streamInfo, dispatch } = useContext(StreamContext);

  const cancelWaiting = useCallback(() => {
    dispatch({ type: StreamActionType.DEL_ALL });
    navigate("/main");
  }, []);

  const getUserMedia = useCallback(async () => {
    let newStream;
    try {
      newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      dispatch({ type: StreamActionType.SET_STREAM, payload: newStream });
      console.log("get audio");
    } catch (e) {
      toast.error("마이크 권한 설정을 허용해 주세요!");
      // navigate("/");
    }
  }, []);

  useEffect(() => {
    getUserMedia();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on(
        "matching",
        (data: { initiator: boolean; opponent: string }) => {
          console.log("matching");
          dispatch({
            type: StreamActionType.SET_MATCHING,
            payload: { initiator: data.initiator, opponent: data.opponent },
          });
          toast.info(`매칭이 완료되었습니다. 통화를 시작합니다.`);
          setTimeout(() => {
            navigate("/call");
          }, READY_COUNT * 1000);
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

  return (
    <Loading text={"상대방을 찾는 중입니다."}>
      <div className="my-auto">
        <BasicButton onClick={cancelWaiting} text="매칭 취소하기" />
        <ToastContainer
          position="top-center"
          theme="colored"
          autoClose={(READY_COUNT - 1.5) * 1000}
        />
      </div>
    </Loading>
  );
};

export default Waiting;
