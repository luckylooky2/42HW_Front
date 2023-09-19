import { useCallback, useContext, FC, SetStateAction } from "react";
import { toast, Id } from "react-toastify";
import WaitToast from "@components/Call/WaitToast";

import { SocketContext } from "@contexts/SocketProvider";
import { StreamContext } from "@contexts/StreamProvider";
import { AuthContext } from "@contexts/AuthProvider";
import { COUNT, MILLISECOND } from "@utils/constant";

interface Props {
  text: string;
  img: string;
  setVoteId: React.Dispatch<SetStateAction<Id>>;
}

const TopicButton: FC<Props> = ({ text, img, setVoteId }) => {
  const { socket } = useContext(SocketContext);
  const { streamInfo } = useContext(StreamContext);
  const { myInfo } = useContext(AuthContext);

  const chooseContents = useCallback(() => {
    socket?.emit("chooseContents", {
      contents: text,
      roomName: streamInfo.roomName,
      requester: myInfo?.nickname,
    });
    const id = toast.info(<WaitToast />, {
      autoClose: COUNT.VOTE * MILLISECOND,
    });
    setVoteId(id);
  }, []);

  return (
    <div className="mx-auto flex items-center">
      <div className="">
        <button
          className="w-16 h-16 rounded-full flex justify-center items-center bg-orange-100 hover:bg-orange-300"
          onClick={chooseContents}
        >
          <img className="w-8 h-8" src={img} alt="hang-up" />
        </button>
        {text && <div className="text-center">{text}</div>}
      </div>
    </div>
  );
};

export default TopicButton;
