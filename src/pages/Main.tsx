import ChatButton from "@components/Main/ChatButton";
import { useMyInfo } from "@hooks/useMyInfo";
import { useRoomType } from "@hooks/useRoomType";
import { useSocket } from "@hooks/useSocket";
import { useStream } from "@hooks/useStream";
import "@styles/Main.css";
import Loading from "@utils/Loading";
import {
  API_URL,
  GROUP_CALL,
  PAGE,
  SINGLE_CALL,
  TRANSLATION,
} from "@utils/constant";
import axios from "axios";
import { useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const Main = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(TRANSLATION, { keyPrefix: PAGE.MAIN });
  const { myInfo, setMyInfo, isLoading } = useMyInfo();
  const { connectSocket } = useSocket();
  const { disconnectStream } = useStream();
  const [_roomType, setRoomType] = useRoomType();

  const getMyInfo = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setMyInfo(response.data);
      connectSocket();
    } catch (e) {
      console.log(e);
    }
  }, []);

  const joinSingleChat = useCallback(() => {
    setRoomType(SINGLE_CALL);
    navigate("/setting");
  }, []);

  const joinGroupChat = useCallback(() => {
    setRoomType(GROUP_CALL);
    navigate("/setting");
  }, []);

  const navigateProfile = useCallback(() => {
    navigate("/profile");
  }, []);

  useEffect(() => {
    getMyInfo();
    disconnectStream();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-full justify-center items-center relative overflow-hidden">
      <ChatButton
        value={t("singleCall")}
        css="hover:bg-gray-100"
        onClick={joinSingleChat}
      />
      <button className="absolute" onClick={navigateProfile}>
        <img
          draggable="false"
          className="mx-auto w-[150px] h-[150px] rounded-[100%] bg-[#ffffff]"
          src={myInfo && myInfo.avatar ? myInfo.avatar : "default-avatar.jpeg"}
          alt="main-avatar"
        />
      </button>
      <ChatButton
        value={t("groupCall")}
        css="rounded-t-3xl bg-orange-100 shadow-[inset_0_0.2em_rgba(221,221,221,1)] hover:bg-orange-200"
        onClick={joinGroupChat}
      />
    </div>
  );
};

export default Main;
