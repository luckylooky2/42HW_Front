import { FC, useCallback } from "react";
import ProfileCard from "@components/Main/ProfileModal/ProfileCard";
import LangSelect from "@components/Main/ProfileModal/LangSelect";
import CallHistoryList from "@components/Main/ProfileModal/CallHistoryList";
import BasicButton from "@utils/BasicButton";

interface Props {
  isOpen: boolean | null;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const ProfileModal: FC<Props> = ({ isOpen, setIsOpen }) => {
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <div
        className="absolute w-full h-full z-0"
        style={{
          display: isOpen === null ? "none" : "block",
          animation: `${isOpen ? "slide-up" : "slide-down"} 0.5s ease forwards`,
        }}
        onClick={closeModal}
      />
      <div
        className="absolute w-[90%] h-[80%] bg-gray-100 rounded-xl z-2"
        style={{
          display: isOpen === null ? "none" : "block",
          animation: `${isOpen ? "slide-up" : "slide-down"} 0.5s ease forwards`,
        }}
      >
        <div className="h-full w-full p-4">
          <div className="h-[100%] w-full flex flex-col justify-around">
            <ProfileCard isOpen={isOpen} />
            <div className="h-[70%] flex flex-col justify-evenly">
              <LangSelect />
              <CallHistoryList />
            </div>
            <div className="h-[10%] flex items-center justify-center">
              <BasicButton onClick={closeModal} text="닫기" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfileModal;
