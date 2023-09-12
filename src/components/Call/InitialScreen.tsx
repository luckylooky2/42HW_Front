import React, { FC } from "react";

interface Props {
  opponentStatus: boolean;
}

const InitialScreen: FC<Props> = ({ opponentStatus }) => {
  return (
    <div className="flex justify-center">
      <div>{!opponentStatus && <div>상대방이 연결을 종료하였습니다.</div>}</div>
    </div>
  );
};

export default InitialScreen;
