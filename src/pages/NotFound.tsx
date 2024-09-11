import BasicButton from "@utils/BasicButton";
import { FC, useCallback } from "react";
import { useNavigate } from "react-router";

const NotFound: FC = () => {
  const navigate = useNavigate();
  const onBackToMain = useCallback(() => {
    navigate("/main");
  }, []);

  return (
    <div className="w-full h-full">
      <div>Page Not Found!</div>
      <BasicButton text="메인으로 돌아가기" onClick={onBackToMain} />
    </div>
  );
};

export default NotFound;
