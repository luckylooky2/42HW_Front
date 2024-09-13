import { CallContext, CallActionType } from "@contexts/CallProvider";
import { SocketContext } from "@contexts/SocketProvider";
import { useMyInfo } from "@hooks/useMyInfo";
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
  const { myInfo, isLoading, navigateIfDirectAccess } = useMyInfo();
  const { socket } = useContext(SocketContext);
  const { callInfo, dispatch } = useContext(CallContext);
  const [roomType] = useRoomType();

  useEffect(() => {
    navigateIfDirectAccess();
  }, []);

  // 뒤로 가기의 문제
  // 1) 통화 종료 알림이 뜨지 않음
  // 2) 다시 register 됨
  useEffect(() => {
    if (!roomType) {
      navigate("/main");
    }
  }, [roomType]);

  useEffect(() => {
    socket?.on(
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

    return () => {
      socket?.off("matching");
    };
  }, [socket]);

  useEffect(() => {
    // 이전 페이지에서 callInfo를 dispatch한 것이 렌더링 되기 전에 반영이 되지 않음
    // callInfo가 이 페이지가 렌더링된 다음 변경되어 페이지가 리렌더링됨
    socket?.emit("register", {
      nickname: myInfo?.nickname,
      type: roomType,
    });
  }, [socket]);

  const backToWaiting = useCallback(() => {
    // dispatch({ type: CallActionType.DEL_ALL });
    socket?.emit("unregister", {
      nickname: myInfo?.nickname,
    });
    navigate(-1);
  }, [callInfo]);

  if (isLoading) {
    return <Loading />;
  }

  return (
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
