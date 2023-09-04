import React, { useCallback } from "react";
import { API_URL } from "@utils/constant";

const Login = () => {
  const clickLogin = useCallback(() => {
    window.location.href = `${API_URL}/auth/login`;
  }, []);

  return (
    <div className="flex flex-col h-full justify-center	">
      <div className="px-10 h-1/4">
        <div className="text-4xl my-4">Hello World</div>
        <div>Have fun playing games </div>
        <div>with learning English!</div>
      </div>
      <div className="pt-8 h-1/3">
        <img className="mx-auto" src="login-image.svg" alt="login" />
      </div>
      <div className="flex justify-center items-center	 h-1/6">
        <button
          className="w-80 h-10 text-black bg-orange-100 rounded-lg text-center hover:bg-orange-200"
          onClick={clickLogin}
        >
          Sign in with 42
        </button>
      </div>
    </div>
  );
};

export default Login;

// TODO : 로그인 페이지에 추가
/* <footer className="h-[5%] text-center text-gray-500 flex justify-center items-center">
  <div className="py-auto">
    <small className="italic">Copyright &copy; 2023 Mozila</small>
    <small> | </small>
    <small>문의하기</small>
  </div>
</footer>; */
