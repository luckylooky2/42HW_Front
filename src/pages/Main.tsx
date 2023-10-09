import { useEffect, useContext, useCallback } from "react";
import { AuthContext } from "@contexts/AuthProvider";
import { API_URL, GROUP_CALL, SINGLE_CALL } from "@utils/constant";
import { useNavigate } from "react-router";
import axios from "axios";
import Loading from "@utils/Loading";
import ChatButton from "@components/Main/ChatButton";
import "@styles/Main.css";
import { SocketContext } from "@contexts/SocketProvider";
import { io } from "socket.io-client";
import { CallActionType, CallContext } from "@contexts/CallProvider";
import { useTranslation } from "react-i18next";

const Main = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("translation", { keyPrefix: "main" });
  const { myInfo, setMyInfo, isLoading, setIsLoading } =
    useContext(AuthContext);
  const { socket, setSocket } = useContext(SocketContext);
  const { dispatch } = useContext(CallContext);

  const connectSocket = useCallback(
    (nickname: string) => {
      if (socket === null) {
        const socket = io(`${API_URL}`);
        console.log(socket);
        setSocket(socket);
      }
    },
    [myInfo]
  );

  const getMyInfo = useCallback(async () => {
    const response = await axios.get(`${API_URL}/users`);
    setMyInfo(response.data);
    setIsLoading(false);
    connectSocket(response.data.nickname);
  }, []);

  const joinSingleChat = useCallback(() => {
    console.log("1:1 chat");
    dispatch({
      type: CallActionType.SET_ROOMTYPE,
      payload: SINGLE_CALL.TYPE,
    });
    navigate("/setting");
  }, []);

  const joinGroupChat = useCallback(() => {
    console.log("group chat");
    dispatch({
      type: CallActionType.SET_ROOMTYPE,
      payload: GROUP_CALL.TYPE,
    });
    navigate("/setting");
  }, []);

  const openModal = useCallback(() => {
    navigate("/profile");
  }, []);

  useEffect(() => {
    getMyInfo();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <div className="flex flex-col h-full justify-center items-center relative overflow-hidden">
      <ChatButton
        value={t("singleCall")}
        css="hover:bg-gray-100"
        onClick={joinSingleChat}
      />
      <button className="absolute" onClick={openModal}>
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
