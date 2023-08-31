import { FC, useContext } from "react";
import { AuthContext } from "@utils/AuthProvider";

interface Props {
  isOpen: boolean | null;
}

const ProfileCard: FC<Props> = ({ isOpen }) => {
  const { myInfo } = useContext(AuthContext);

  // undefined를 리턴할 수 없음
  if (!myInfo) return null;

  return (
    <div className="flex justify-center h-[20%] w-full">
      {" "}
      <img
        draggable="false"
        className="h-[80%] my-auto aspect-square rounded-[100%] bg-[#ffffff] shadow-2xl"
        src={myInfo && myInfo.avatar ? myInfo.avatar : "default-avatar.jpeg"}
        alt="profile-avatar"
      />
      <div className="w-[60%] flex flex-col justify-around">
        <div className="text-center">{myInfo.nickname}</div>
        <div className="text-center">🇰🇷 42 {myInfo.campus}</div>
        <div className="flex justify-center items-center">
          <div className="text-center mx-3">Lv {Math.floor(myInfo.level)}</div>
          <div
            style={{
              backgroundColor: "#333333",
              borderRadius: "5px",
              width: "60%",
              height: "15px",
            }}
          >
            <div
              style={{
                width: isOpen ? `${(myInfo.level % 1) * 100}%` : "0%",
                height: "15px",
                borderRadius: "5px",
                backgroundColor: "#4caf50",
                transition: "width 1s ease",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
