import { FC } from "react";

interface Props {
  onClick: () => void;
  text?: string;
  type?: string;
  disabled?: boolean;
  clicked?: boolean;
  img: string;
}

const CallButton: FC<Props> = ({
  onClick,
  text,
  type,
  disabled,
  clicked,
  img,
}) => {
  return (
    <div className="mx-auto">
      <button
        className={`w-16 h-16 rounded-full flex justify-center items-center
	  ${type === "hang-up" ? "bg-red-500" : ""}
	  ${clicked ? "bg-orange-300" : ""}
	  ${
      disabled
        ? "bg-gray-100"
        : `bg-orange-100 hover:${
            type === "hang-up" ? "bg-red-700" : "bg-orange-300"
          }`
    }`}
        onClick={onClick}
        disabled={disabled}
      >
        <img
          className={type === "hang-up" ? "w-16 h-16" : "w-8 h-8"}
          src={img}
          alt="hang-up"
        />
      </button>
      {text && <div className="text-center">{text}</div>}
    </div>
  );
};

export default CallButton;

CallButton.defaultProps = {
  disabled: false,
  clicked: false,
  type: "normal",
  text: "",
};
