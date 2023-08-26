import { useEffect, useContext, useCallback, useState } from "react";
import { AuthContext } from "@utils/AuthProvider";
import { API_URL } from "@utils/constant";
import { useNavigate } from "react-router";
import axios from "axios";
import Loading from "@utils/Loading";
import ChatButton from "@components/Main/ChatButton";
import ProfileModal from "@components/Main/ProfileModal";
import "@styles/Main.css";

const Main = () => {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { myInfo, setMyInfo, isLoading, setIsLoading } =
    useContext(AuthContext);

  console.log(myInfo);

  const getMyInfo = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setMyInfo(response.data);
      setIsLoading(false);
    } catch (e) {
      alert("로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요.");
      navigate("/login");
    }
  }, []);

  const joinSingleChat = useCallback(() => {
    console.log("1:1 chat");
  }, []);

  const joinGroupChat = useCallback(() => {
    console.log("group chat");
  }, []);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    // getMyInfo();
  }, []);

  return !isLoading ? (
    <Loading />
  ) : (
    <div className="flex flex-col h-full justify-center items-center relative overflow-hidden">
      <ChatButton
        value="1:1 chat"
        css="hover:bg-gray-100"
        onClick={joinSingleChat}
      />
      <button
        className="w-[35%] min-w-[120px] aspect-square absolute"
        onClick={openModal}
      >
        <img
          className="mx-auto rounded-[100%] border-8 bg-[#ffffff] shadow-2xl"
          src={myInfo ? myInfo.avatar : "default-avatar.jpeg"}
          alt="main-avatar"
        />
      </button>
      <ChatButton
        value="Group chat"
        css="rounded-t-3xl bg-orange-100 shadow-[inset_0_0.2em_rgba(221,221,221,1)] hover:bg-orange-200"
        onClick={joinGroupChat}
      />
      <ProfileModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Main;
