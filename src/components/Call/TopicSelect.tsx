import { SetStateAction, useEffect, FC } from "react";
import TopicButton from "./TopicButton";
import { Id } from "react-toastify";
import { TOPIC_LIST } from "@utils/constant";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  setVoteId: React.Dispatch<SetStateAction<Id>>;
}

const TopicSelect: FC<Props> = ({ isOpen, setIsOpen, setVoteId }) => {
  const topicList: string[] = TOPIC_LIST;

  useEffect(() => {
    const id = setTimeout(() => {
      setIsOpen(true);
    }, 50);

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
          key={`topic-button-${v}-${i}`}
          text={v}
          img="game.svg"
          setVoteId={setVoteId}
        />
      ))}
    </div>
  );
};

export default TopicSelect;
