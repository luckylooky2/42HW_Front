import TopicButton from "./TopicButton";

const TopicSelect = () => {
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
  return (
    <div className="h-[90%] max-w-[300px] grid grid-cols-3 mx-auto">
      {topicList.map((v, i) => (
        <TopicButton
          key={`topic-button-${v}`}
          text={v}
          img="game.svg"
          onClick={() => {
            console.log(123);
          }}
        />
      ))}
    </div>
  );
};

export default TopicSelect;
