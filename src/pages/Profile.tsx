import { useCallback } from "react";
import ProfileCard from "@components/Profile/ProfileCard";
import LangSelect from "@components/Profile/LangSelect";
import CallHistoryList from "@components/Profile/CallHistoryList";
import BasicButton from "@utils/BasicButton";
import { useNavigate } from "react-router";
import { deleteCookie } from "@utils/manageCookie";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const closeModal = useCallback(() => {
    navigate("/main");
  }, []);

  const logout = useCallback(() => {
    deleteCookie("login");
    localStorage.removeItem("isLogin");
    window.location.href = "/";
  }, []);

  return (
    <>
      <div className="h-[10%] flex items-center justify-between bg-orange-100">
        <button
          className="w-[10%] h-full m-2 flex items-center justify-center"
          onClick={closeModal}
        >
          <img width="25" height="25" src="arrow.png" alt="profile_back" />
        </button>
        <b className="text-lg">{t("profile")}</b>
        <div className="w-[10%] h-full m-2 flex items-center justify-center" />
      </div>
      <div className="h-[90%] w-full p-4">
        <div className="h-[100%] w-full flex flex-col justify-around">
          <ProfileCard />
          <div className="h-[70%] flex flex-col justify-evenly">
            <LangSelect />
            <CallHistoryList />
          </div>
          <div className="h-[10%] flex items-center justify-center">
            <BasicButton onClick={logout} text="로그아웃" />
          </div>
        </div>
      </div>
    </>
  );
};
export default Profile;
