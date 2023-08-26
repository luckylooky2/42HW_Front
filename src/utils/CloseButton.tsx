import { FC, useState } from "react";

interface Props {
  onClick: () => void;
}

const CloseButton: FC<Props> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-8 h-8 block ml-auto rounded-md bg-orange-100 hover:bg-orange-200"
      onClick={onClick}
    >
      <div
        style={{
          transition: "transform 0.5s ease",
          transform: isHovered ? "rotate(90deg)" : "rotate(0deg)",
        }}
      >
        ✕
      </div>
    </button>
  );
};

export default CloseButton;
