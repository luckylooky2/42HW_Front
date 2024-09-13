import CallHistoryList from "@components/Profile/CallHistoryList";
import LangSelect from "@components/Profile/LangSelect";
import ProfileCard from "@components/Profile/ProfileCard";
import Header from "@utils/Header";
import TextButton from "@utils/TextButton";
import { API_URL, PAGE, TRANSLATION } from "@utils/constant";
import axios from "axios";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(TRANSLATION, { keyPrefix: PAGE.PROFILE });
  const logout = useCallback(async () => {
    await axios.get(`${API_URL}/auth/logout`);
    alert("로그아웃 되었습니다.");
    window.location.href = "/";
  }, []);

  const closeModal = useCallback(() => {
    navigate("/main");
  }, []);

  return (
    <Header onClick={closeModal} title={t("header")}>
      <div className="h-[100%] w-full flex flex-col justify-around">
        <ProfileCard />
        <div className="h-[70%] flex flex-col justify-evenly">
          <LangSelect />
          <CallHistoryList />
        </div>
        <div className="h-[10%] flex items-center justify-center">
          <TextButton onClick={logout} text={t("logout")} />
        </div>
      </div>
    </Header>
  );
};
export default Profile;
