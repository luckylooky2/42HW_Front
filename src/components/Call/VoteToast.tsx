import { FC, useState, useCallback, useContext } from "react";
import { SocketContext } from "@contexts/SocketProvider";
import { StreamContext } from "@contexts/StreamProvider";
import { CallInfo } from "@typings/Call";
import VoteStatus from "@components/Call/VoteStatusBoard";

interface Props {
  contentsName: string;
  requester: string;
  callType: CallInfo;
}

const VoteToast: FC<Props> = ({ contentsName, requester, callType }) => {
  const { socket } = useContext(SocketContext);
  const { streamInfo } = useContext(StreamContext);
  const [isVoted, setIsVoted] = useState<boolean | null>(null);

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

  return (
    <div className="flex flex-col justify-evenly">
      <div className="my-1">{`[${requester}] TOPIC-${contentsName} 요청`}</div>
      <VoteStatus totalNum={callType.TOTAL_NUM} />
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
