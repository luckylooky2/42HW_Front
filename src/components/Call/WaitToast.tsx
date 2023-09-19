import { useState, useCallback, useEffect, useContext } from "react";
import { SocketContext } from "@contexts/SocketProvider";

const WaitToast = () => {
  const { socket } = useContext(SocketContext);
  const [voteStatus, setVoteStatus] = useState<string[]>(["✅", "➖"]);

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
      투표 중입니다.
      {voteStatus.map((v, i) => (
        <span key={`waitToast + ${v} + ${i}`}>{v}</span>
      ))}
    </div>
  );
};

export default WaitToast;
