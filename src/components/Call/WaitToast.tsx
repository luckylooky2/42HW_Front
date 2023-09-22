import {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
  FC,
} from "react";
import { SocketContext } from "@contexts/SocketProvider";
import { VOTE_SELECT } from "@utils/constant";
import { CallInfo } from "@typings/Call";

interface Props {
  callType: CallInfo;
}

const WaitToast: FC<Props> = ({ callType }) => {
  const { socket } = useContext(SocketContext);
  const [voteStatus, setVoteStatus] = useState<string[]>(
    [VOTE_SELECT.YES].concat(
      new Array(callType.OPPONENT_NUM).fill(VOTE_SELECT.ONGOING)
    )
  );
  const indexRef = useRef<number>(1);

  const onSomeoneAccept = useCallback(() => {
    const copy = voteStatus.map((v) => v);
    copy[indexRef.current] = VOTE_SELECT.YES;
    indexRef.current++;
    setVoteStatus(copy);
  }, [voteStatus]);

  const onSomeoneReject = useCallback(() => {
    const copy = voteStatus.map((v) => v);
    copy[indexRef.current] = VOTE_SELECT.NO;
    indexRef.current++;
    setVoteStatus(copy);
  }, [voteStatus]);

  useEffect(() => {
    socket?.on("someoneAccept", onSomeoneAccept);
    socket?.on("someoneReject", onSomeoneReject);
    return () => {
      socket?.off("someoneAccept", onSomeoneAccept);
      socket?.off("someoneReject", onSomeoneReject);
    };
  }, []);

  return (
    <div>
      <div className="my-1">투표 중입니다.</div>
      <div
        className={`grid grid-cols-${callType.TOTAL_NUM} w-full my-1 mx-auto`}
      >
        {voteStatus.map((v, i) => (
          <div className="p-[2px]">
            <div
              className={`h-[20px] bg-${
                v === VOTE_SELECT.ONGOING
                  ? "gray"
                  : v === VOTE_SELECT.YES
                  ? "green"
                  : "red"
              }-500`}
              key={`voteToast + ${v} + ${i}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaitToast;