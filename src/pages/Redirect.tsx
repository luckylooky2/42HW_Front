import { useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import Loading from "@utils/Loading";
import { getCookie } from "@utils/getCookie";

const Redirect = () => {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const cookie = getCookie("at");

    if (!cookie) {
      alert("로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요.");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("isLogin", "true");
    navigate("/main");
  }, []);

  return <Loading />;
};

export default Redirect;
