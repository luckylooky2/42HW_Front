import { FC } from "react";

interface Props {
  onClick: () => void;
  text: string;
  img: string;
}

const TopicButton: FC<Props> = ({ onClick, text, img }) => {
  return (
    <div className="mx-auto flex items-center">
      <div className="">
        <button
          className="w-16 h-16 rounded-full flex justify-center items-center bg-orange-100 hover:bg-orange-300"
          onClick={onClick}
        >
          <img className="w-8 h-8" src={img} alt="hang-up" />
        </button>
        {text && <div className="text-center">{text}</div>}
      </div>
    </div>
  );
};

export default TopicButton;
