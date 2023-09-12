import { useContext, useEffect, useState } from "react";
import TopicButton from "./TopicButton";
import { SocketContext } from "@contexts/SocketProvider";

const TopicSelect = () => {
  const { socket } = useContext(SocketContext);
  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(false);
      clearTimeout(id);
    };
  }, []);

  return (
    <div
      className="h-[90%] max-w-[300px] grid grid-cols-3 mx-auto"
      style={{ transform: `scale(${isOpen ? 1 : 0})`, transition: ".5s" }}
    >
      {topicList.map((v, i) => (
        <TopicButton
          key={`topic-button-${v}`}
          text={v}
          img="game.svg"
          onClick={() => {
            socket?.emit("chooseTopic", {});
          }}
        />
      ))}
    </div>
  );
};

export default TopicSelect;
