import { FC, useCallback, useContext, useState } from "react";
import { AuthContext } from "@utils/AuthProvider";
import CloseButton from "@utils/CloseButton";

interface Props {
  isOpen: boolean | null;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const ProfileModal: FC<Props> = ({ isOpen, setIsOpen }) => {
  const { myInfo, setMyInfo } = useContext(AuthContext);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <div
        className="absolute w-full h-full bg-[rgba(0,0,0,0.2)] z-0"
        style={{
          display: isOpen === null ? "none" : "block",
          animation: `${isOpen ? "slide-up" : "slide-down"} 0.5s ease forwards`,
        }}
        onClick={closeModal}
      />
      <div
        className="absolute w-[80%] h-[85%] bg-white rounded-xl z-2"
        style={{
          display: isOpen === null ? "none" : "block",
          animation: `${isOpen ? "slide-up" : "slide-down"} 0.5s ease forwards`,
        }}
      >
        <div className="h-full w-full p-6 overflow-auto">
          <button
            className="w-40 h-8 block m-auto rounded-md bg-orange-100 hover:bg-orange-200 "
            onClick={closeModal}
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
};
export default ProfileModal;
