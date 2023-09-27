import { FC, useCallback, useEffect, useState } from "react";
import { API_URL } from "@utils/constant";
import axios from "axios";
import { IUser } from "@typings/db";

interface Props {
  isOpen: boolean | null;
}

const ProfileCard: FC<Props> = ({ isOpen }) => {
  const [myInfo, setMyInfo] = useState<IUser | null>(null);

  const getMyInfo = useCallback(async () => {
    const response = await axios.get(`${API_URL}/users`);
    setMyInfo(response.data);
  }, []);

  useEffect(() => {
    getMyInfo();
  }, []);

  // undefined를 리턴할 수 없음
  if (!myInfo) return null;

  return (
    <div className="flex justify-center h-[20%] w-full">
      {" "}
      <div className="w-[80%] flex flex-col justify-around">
        <div className="flex justify-center">
          <img
            draggable="false"
            className="h-[40px] my-auto aspect-square rounded-[100%] bg-[#ffffff] shadow-2x m-4"
            src={
              myInfo && myInfo.avatar ? myInfo.avatar : "default-avatar.jpeg"
            }
            alt="profile-avatar"
          />
          <div className="text-center text-[20px]">{myInfo.nickname}</div>
        </div>
        <div className="text-center">🇰🇷 42 {myInfo.campus}</div>
        <div className="flex justify-center items-center">
          <div className="text-center mx-3">Lv {Math.floor(myInfo.level)}</div>
          <div
            style={{
              backgroundColor: "#333333",
              borderRadius: "5px",
              width: "100px",
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
