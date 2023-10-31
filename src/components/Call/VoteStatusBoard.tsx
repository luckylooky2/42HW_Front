import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useContext,
  FC,
} from "react";
import { VOTE_SELECT } from "@utils/constant";
import { SocketContext } from "@contexts/SocketProvider";

interface Props {
  totalNum: number | null;
}

const VoteStatusBoard: FC<Props> = ({ totalNum }) => {
  const { socket } = useContext(SocketContext);
  const [voteStatus, setVoteStatus] = useState<string[]>(
    [VOTE_SELECT.YES].concat(new Array(totalNum! - 1).fill(VOTE_SELECT.ONGOING))
  );
  const indexRef = useRef<number>(1);
  const totalNumRef = useRef<number>(totalNum);

  const onSomeoneAccept = useCallback(() => {
    setVoteStatus((prev) => {
      const copy = prev.map((v) => v);
      copy[indexRef.current++] = VOTE_SELECT.YES;
      return copy;
    });
  }, [voteStatus]);

  const onSomeoneReject = useCallback(() => {
    setVoteStatus((prev) => {
      const copy = prev.map((v) => v);
      copy[indexRef.current++] = VOTE_SELECT.NO;
      return copy;
    });
  }, [voteStatus]);

  useEffect(() => {
    socket?.on("someoneAccept", onSomeoneAccept);
    socket?.on("someoneReject", onSomeoneReject);
    return () => {
      socket?.off("someoneAccept", onSomeoneAccept);
      socket?.off("someoneReject", onSomeoneReject);
    };
  }, []);

  const deterGridCols = (num: Number | null) => {
    switch (num) {
      case null:
        return "";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-4";
    }
  };

  const deterColor = (color: string) => {
    switch (color) {
      case VOTE_SELECT.ONGOING:
        return "bg-gray-500";
      case VOTE_SELECT.YES:
        return "bg-green-500";
      case VOTE_SELECT.NO:
        return "bg-red-500";
    }
  };

  console.log();

  return (
    <div
      className={`grid ${deterGridCols(
        totalNumRef.current
      )} w-full my-1 mx-auto`}
    >
      {voteStatus.map((v, i) => (
        <div key={`voteBlock-${v}-${i}`} className="p-[2px]">
          <div
            className={`h-[20px]  ${deterColor(v)}`}
            key={`voteToast + ${v} + ${i}`}
          />
        </div>
      ))}
    </div>
  );
};

export default VoteStatusBoard;
