import { AuthContext } from "@contexts/AuthProvider";
import { CallContext, CallActionType } from "@contexts/CallProvider";
import { SocketContext } from "@contexts/SocketProvider";
import { useRoomType } from "@hooks/useRoomType";
import { OpponentInfo } from "@typings/front";
import BasicButton from "@utils/BasicButton";
import Header from "@utils/Header";
import Loading from "@utils/Loading";
import { COUNT, MILLISECOND, PAGE, TRANSLATION } from "@utils/constant";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Waiting = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(TRANSLATION);
  const [matched, setMatched] = useState(false);
  const { myInfo } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const { callInfo, dispatch } = useContext(CallContext);
  const [roomType] = useRoomType();

  useEffect(() => {
    // 잘못된 접근했을 때
    if (myInfo === null || socket === null) {
      navigate("/main");
    }
  }, [myInfo, socket]);

  useEffect(() => {
    if (socket) {
      socket.on(
        "matching",
        (data: { opponent: OpponentInfo[]; roomName: string }) => {
          console.log("matching");
          setMatched(true);
          dispatch({
            type: CallActionType.SET_MATCHING,
            payload: {
              opponent: data.opponent,
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
  }, [socket, callInfo]);

  useEffect(() => {
    if (socket)
      socket.emit("register", {
        nickname: myInfo?.nickname,
        type: roomType,
      });
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", preventClose);

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);

  const backToWaiting = useCallback(() => {
    // dispatch({ type: CallActionType.DEL_ALL });
    socket?.emit("unregister", {
      nickname: myInfo?.nickname,
    });
    navigate(-1);
  }, [callInfo]);

  const preventClose = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = true;
  }, []);

  return socket === null ? (
    <Loading />
  ) : (
    <Header
      onClick={backToWaiting}
      title={`Matching: ${t(`${PAGE.MAIN}.${roomType}Call`)}`}
    >
      <Loading text={t(`${PAGE.WAITING}.info`)}>
        <div className="my-auto">
          <BasicButton
            onClick={backToWaiting}
            text={t(`${PAGE.WAITING}.back`)}
            disabled={matched}
          />
        </div>
      </Loading>
    </Header>
  );
};

export default Waiting;
