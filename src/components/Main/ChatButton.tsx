import { FC } from "react";

interface Props {
  value: string;
  onClick: () => void;
  css?: string;
}

const ChatButton: FC<Props> = ({ value, onClick, css }) => {
  return (
    <button
      onClick={onClick}
      className={`h-1/2 w-full flex justify-center items-center + ${css}`}
    >
      <div className="w-32 h-10 border-gray-500 border-[1.5px] rounded-3xl flex justify-center items-center">
        <div>{value}</div>
      </div>
    </button>
  );
};

export default ChatButton;

ChatButton.defaultProps = {
  css: "",
};
