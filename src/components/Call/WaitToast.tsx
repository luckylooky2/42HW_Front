import { FC } from "react";
import { CallInfo } from "@typings/Call";
import VoteStatusBoard from "./VoteStatusBoard";

interface Props {
  callType: CallInfo;
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
