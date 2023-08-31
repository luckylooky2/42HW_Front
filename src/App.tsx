import React from "react";
import { Routes, Route, Navigate } from "react-router";
// 동적 import 추가하기
import Login from "@pages/Login";
import Redirect from "@pages/Redirect";
import Main from "@pages/Main";
import Waiting from "@pages/Waiting";

function App() {
  return (
    <>
      <div className="container h-full">
        <div className="h-[100%]">
          <Routes>
            <Route path="/" element={<Navigate replace to="/main" />} />
            <Route path="/login" Component={Login} />
            <Route path="/redirect" Component={Redirect} />
            <Route path="/main" Component={Main} />
            <Route path="/waiting" Component={Waiting} />
            <Route path="/chat" />
            <Route path="/profile" />
          </Routes>
        </div>
        {/* <footer className="h-[5%] text-center text-gray-500 flex justify-center items-center">
          <div className="py-auto">
            <small className="italic">Copyright &copy; 2023 Mozila</small>
            <small> | </small>
            <small>문의하기</small>
          </div>
        </footer> */}
      </div>
    </>
  );
}

export default App;
