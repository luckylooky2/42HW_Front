import { FC } from "react";
import { CallType } from "@typings/front";
import VoteStatusBoard from "./VoteStatusBoard";

interface Props {
  callType: CallType;
}

const WaitToast: FC<Props> = ({ callType }) => {
  return (
    <div>
      <div className="my-1">투표 중입니다.</div>
      <VoteStatusBoard totalNum={callType.TOTAL_NUM} />
    </div>
  );
};

export default WaitToast;
