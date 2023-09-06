import { FC } from "react";

interface Props {
  onClick: () => void;
  text: string;
  disabled?: boolean;
}

const BasicButton: FC<Props> = ({ onClick, text, disabled }) => {
  return (
    <button
      className={`w-40 h-8 block rounded-md ${
        disabled ? "bg-gray-100" : "bg-orange-100 hover:bg-orange-200"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default BasicButton;

BasicButton.defaultProps = {
  disabled: false,
};
