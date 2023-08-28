import { FC, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "@utils/AuthProvider";
import { ICallHistory } from "@typings/db";
import { API_URL } from "@utils/constant";
import axios from "axios";
import { useNavigate } from "react-router";
import CallHistory from "./CallHistory";

interface Props {
  isOpen: boolean | null;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const ProfileModal: FC<Props> = ({ isOpen, setIsOpen }) => {
  const { myInfo } = useContext(AuthContext);
  const [systemLang, setSystemLang] = useState("");
  const [callHistory, setCallHistory] = useState<ICallHistory[]>([]);
  const navigate = useNavigate();

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const getCallHistory = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/call/callHistory`);
      console.log(response.data);
      setCallHistory(response.data);
    } catch (e) {
      alert("로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요.");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    getCallHistory();
  }, []);

  // undefined를 리턴할 수 없음
  if (!myInfo) return null;

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
        className="absolute w-[80%] h-[85%] bg-gray-100 rounded-xl z-2"
        style={{
          display: isOpen === null ? "none" : "block",
          animation: `${isOpen ? "slide-up" : "slide-down"} 0.5s ease forwards`,
        }}
      >
        <div className="h-full w-full p-6">
          <div className="h-[90%] w-full flex flex-col justify-around">
            <div className="flex h-[20%] w-full">
              <img
                draggable="false"
                className="h-[100%] aspect-square rounded-[100%] bg-[#ffffff] shadow-2xl"
                src={myInfo ? myInfo.avatar : "default-avatar.jpeg"}
                alt="main-avatar"
              />
              <div className="w-full flex flex-col justify-around">
                <div className="text-center">{myInfo.nickname}</div>
                <div className="text-center">🇰🇷 42 {myInfo.campus}</div>
                <div className="flex justify-center items-center">
                  <div className="text-center mx-3">
                    Lv {Math.floor(myInfo.level)}
                  </div>
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
            <div className="flex flex-col h-[20%] justify-between">
              <div className="h-[20%]">언어 설정</div>
              <div className="flex flex-col h-[75%] w-full justify-around ">
                <div className="flex items-center bg-gray-200 rounded-md h-8 mx-2 px-5">
                  <div>
                    <span>배우고 싶은 언어 : </span>
                    <select className="w-20" disabled>
                      {["영어"].map((v, i) => (
                        <option key={`배우고 싶은 언어-${i}`}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center bg-gray-200 rounded-md h-8 mx-2 px-5">
                  <div>
                    <span>시스템 언어 설정 : </span>
                    <select
                      className="w-20"
                      onChange={(e) => setSystemLang(e.target.value)}
                    >
                      {["한국어", "영어"].map((v, i) => (
                        <option key={`시스템 언어-${i}`}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col h-[50%] justify-between">
              <div className="h-[8%]">대화 히스토리</div>
              <div className="h-[90%] overflow-auto bg-gray-200 rounded-md p-3 mx-2 px-2">
                {callHistory.length === 0 ? (
                  <div className="h-full flex justify-center items-center text-gray-500">
                    대화 히스토리가 존재하지 않습니다!
                  </div>
                ) : (
                  callHistory.map((v) => (
                    <CallHistory key={`${v.id}-${v.startTime}`} callData={v} />
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="h-[10%] flex items-center justify-center">
            <button
              className="w-40 h-8 block rounded-md bg-orange-100 hover:bg-orange-200 "
              onClick={closeModal}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfileModal;

// width: `${(myInfo.level % 1) * 100}%`,
