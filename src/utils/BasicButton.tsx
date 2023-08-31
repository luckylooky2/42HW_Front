import { FC } from "react";

interface Props {
  onClick: () => void;
  text: string;
}

const BasicButton: FC<Props> = ({ onClick, text }) => {
  return (
    <button
      className="w-40 h-8 block rounded-md bg-orange-100 hover:bg-orange-200 "
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default BasicButton;
