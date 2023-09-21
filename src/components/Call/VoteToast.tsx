import {
  FC,
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from "react";
import { SocketContext } from "@contexts/SocketProvider";
import { StreamContext } from "@contexts/StreamProvider";
import { VOTE_SELECT } from "@utils/constant";
import { CallInfo } from "@typings/Call";

interface Props {
  contentsName: string;
  requester: string;
  callType: CallInfo;
}

const VoteToast: FC<Props> = ({ contentsName, requester, callType }) => {
  const { socket } = useContext(SocketContext);
  const { streamInfo } = useContext(StreamContext);
  // TODO : custom hook
  const [voteStatus, setVoteStatus] = useState<string[]>(
    [VOTE_SELECT.YES].concat(
      new Array(callType.OPPONENT_NUM).fill(VOTE_SELECT.ONGOING)
    )
  );
  const indexRef = useRef<number>(1);
  const [isVoted, setIsVoted] = useState<boolean | null>(null);

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

  const voteAccept = useCallback(() => {
    socket?.emit("voteAccept", {
      roomName: streamInfo.roomName,
      contents: contentsName,
    });
    setIsVoted(true);
  }, [isVoted]);

  const voteReject = useCallback(() => {
    socket?.emit("voteReject", {
      roomName: streamInfo.roomName,
      contents: contentsName,
    });
    setIsVoted(false);
  }, [isVoted]);

  useEffect(() => {
    socket?.on("someoneAccept", onSomeoneAccept);
    socket?.on("someoneReject", onSomeoneReject);
    return () => {
      socket?.off("someoneAccept", onSomeoneAccept);
      socket?.off("someoneReject", onSomeoneReject);
    };
  }, []);

  return (
    <div className="flex flex-col justify-evenly">
      <div className="my-1">{`[${requester}] TOPIC-${contentsName} 요청`}</div>
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
      <div className="flex justify-evenly my-1">
        {isVoted === null && (
          <>
            <button
              className="w-[40%] h-[30px] rounded-md bg-blue-600"
              onClick={voteAccept}
            >
              찬성
            </button>
            <button
              className="w-[40%] h-[30px] rounded-md bg-gray-400"
              onClick={voteReject}
            >
              반대
            </button>
          </>
        )}
        {isVoted === true && <div>찬성하셨습니다.</div>}
        {isVoted === false && <div>반대하셨습니다.</div>}
      </div>
    </div>
  );
};

export default VoteToast;
