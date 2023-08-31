import { useCallback } from "react";
import { useNavigate } from "react-router";
import Loading from "@utils/Loading";
import BasicButton from "@utils/BasicButton";

const Waiting = () => {
  const navigate = useNavigate();
  const cancelWaiting = useCallback(() => {
    navigate("/main");
  }, []);

  return (
    <Loading text="상대방을 찾는 중입니다.">
      <div className="my-auto">
        <BasicButton onClick={cancelWaiting} text="매칭 취소하기" />
      </div>
    </Loading>
  );
};

export default Waiting;
