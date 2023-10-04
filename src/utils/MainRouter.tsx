import React, { useLayoutEffect, useState } from "react";
import { Routes, Route } from "react-router";
import Main from "@pages/Main";
import Waiting from "@pages/Waiting";
import Call from "@pages/Call";
import Setting from "@pages/Setting";
import NotFound from "@pages/NotFound";
import { getCookie } from "@utils/manageCookie";
import Profile from "@pages/Profile";
import { deleteCookie } from "@utils/manageCookie";

const MainRouter = () => {
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const cookie = getCookie("login");
    if (!cookie) {
      alert("로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요.");
      // isLogin이 로그인을 판단했던 것처럼 똑같이 login 쿠키가 로그인을 판단
      // 여기서 delete를 해주지 않으면, 액세스 토큰만 지워진 경우 로그인이 되었다고 판단하여 무한 라우팅됨
      deleteCookie("login");
      window.location.href = "/";
    } else setIsLoading(false);
  }, []);

  return (
    <Routes>
      <Route path="/main" Component={Main} />
      <Route path="/profile" Component={Profile} />
      <Route path="/setting" Component={Setting} />
      <Route path="/waiting" Component={Waiting} />
      <Route path="/call" Component={Call} />
      <Route path="*" element={<NotFound isLoading={isLoading} />} />
    </Routes>
  );
};

export default MainRouter;
