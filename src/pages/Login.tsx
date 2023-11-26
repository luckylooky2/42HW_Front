import React, { useCallback, useEffect, useState } from "react";
import { API_URL, PAGE, TRANSLATION } from "@utils/constant";
import { useNavigate } from "react-router";
import Loading from "@utils/Loading";
import { getCookie } from "@utils/manageCookie";
import { useTranslation } from "react-i18next";
import { PulseLoader } from "react-spinners";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(TRANSLATION, { keyPrefix: PAGE.LOGIN });
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const clickLogin = useCallback(() => {
    setLoading(true);
    window.location.href = `${API_URL}/auth/login`;
  }, []);

  useEffect(() => {
    const cookie = getCookie("login");
    if (cookie) navigate("/main");
    else setLogin(true);
  }, []);

  return login ? (
    <div className="flex flex-col h-full justify-center	relative">
      <div className="px-10 h-1/4">
        <div className="text-4xl my-4">Hello World</div>
        <div>{t("greeting1")}</div>
        <div>{t("greeting2")}</div>
      </div>
      <div className="pt-8 h-1/3">
        <img className="mx-auto" src="login-image.svg" alt="login" />
      </div>
      <div className="flex justify-center items-center h-1/6">
        <button
          className="w-80 h-10 text-black bg-orange-100 rounded-lg text-center hover:bg-orange-200"
          onClick={clickLogin}
        >
          {loading ? (
            <PulseLoader
              color={"#808080"}
              size={10}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            t("login")
          )}
        </button>
      </div>
      <footer className="h-[5%] text-center text-gray-500 flex justify-center items-center absolute bottom-0 w-full">
        <div className="py-auto">
          <small>
            <a
              href="https://github.com/42HelloWorld/42HW_Front/issues/new"
              target="_blank"
            >
              버그 제보하기
            </a>
          </small>
          <small> | </small>
          <small>
            <a href="mailto:chanhyle@student.42seoul.kr">문의하기</a>
          </small>
        </div>
      </footer>
    </div>
  ) : (
    <Loading />
  );
};

export default Login;
