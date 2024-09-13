import { FC } from "react";

interface Props {
  onClick: () => void;
  text: string;
  disabled?: boolean;
}

const TextButton: FC<Props> = ({ onClick, text, disabled }) => {
  return (
    <button
      className={`w-40 h-8 my-2 block rounded-md ${
        disabled
          ? "bg-gray-100"
          : "bg-orange-100 hover:bg-orange-200 transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-200"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default TextButton;

TextButton.defaultProps = {
  disabled: false,
};
