import { FC, useState, useCallback, useEffect, useContext } from "react";
import { SocketContext } from "@contexts/SocketProvider";
import { StreamContext } from "@contexts/StreamProvider";

interface Props {
  contentsName: string;
  requester: string;
}

const VoteToast: FC<Props> = ({ contentsName, requester }) => {
  const { socket } = useContext(SocketContext);
  const { streamInfo } = useContext(StreamContext);
  const [voteStatus, setVoteStatus] = useState<string[]>(["✅", "➖"]);
  const [isVoted, setIsVoted] = useState(false);

  const onSomeoneAccept = useCallback(() => {
    const copy = voteStatus.map((v) => v);
    copy.pop();
    copy.push("✅");
    setVoteStatus(copy);
  }, [voteStatus]);

  const onSomeoneReject = useCallback(() => {
    const copy = voteStatus.map((v) => v);
    copy.pop();
    copy.push("❌");
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
    setIsVoted(true);
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
    <div>
      <div>
        <div>{`${requester} 님이 ${contentsName}을 요청하셨습니다. 수락하시겠습니까?`}</div>
        <div>
          {voteStatus.map((v, i) => (
            <span key={`voteToast + ${v} + ${i}`}>{v}</span>
          ))}
        </div>
      </div>
      {!isVoted ? (
        <>
          <button onClick={voteAccept}>✅</button>
          <button onClick={voteReject}>❌</button>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default VoteToast;
