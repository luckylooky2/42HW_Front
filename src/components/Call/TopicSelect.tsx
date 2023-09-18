import { SetStateAction, useContext, useEffect, useState, FC } from "react";
import TopicButton from "./TopicButton";
import { SocketContext } from "@contexts/SocketProvider";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}

const TopicSelect: FC<Props> = ({ isOpen, setIsOpen }) => {
  const { socket } = useContext(SocketContext);
  const topicList: string[] = [
    "shopping",
    "business",
    "travel",
    "sports",
    "home",
    "music",
    "food",
    "hobbies",
    "42",
  ];

  useEffect(() => {
    const id = setTimeout(() => {
      setIsOpen(true);
    }, 100);

    return () => {
      clearTimeout(id);
    };
  }, []);

  return (
    <div
      className="h-[90%] max-w-[300px] grid grid-cols-3 mx-auto"
      style={{ transform: `scale(${isOpen ? 1 : 0})`, transition: ".3s" }}
    >
      {topicList.map((v, i) => (
        <TopicButton
          key={`topic-button-${v}`}
          text={v}
          img="game.svg"
          onClick={() => {
            socket?.emit("chooseTopic", {
              topic: v,
            });
          }}
        />
      ))}
    </div>
  );
};

export default TopicSelect;
