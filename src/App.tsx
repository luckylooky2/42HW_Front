import React from "react";
import { Routes, Route, Navigate } from "react-router";
// 동적 import 추가하기
import Login from "@pages/Login";
import Redirect from "@pages/Redirect";
import Main from "@pages/Main";
import Waiting from "@pages/Waiting";
import Call from "@pages/Call";
import Setting from "@pages/Setting";
import { ToastContainer } from "react-toastify";
import * as process from "process";
import { COUNT, MILLISECOND } from "@utils/constant";

(window as any).global = window;
(window as any).process = process;
(window as any).Buffer = [];

function App() {
  return (
    <div className="container h-full">
      <div className="h-[100%]">
        <Routes>
          <Route path="/" element={<Navigate replace to="/main" />} />
          <Route path="/login" Component={Login} />
          <Route path="/setting" Component={Setting} />
          <Route path="/redirect" Component={Redirect} />
          <Route path="/main" Component={Main} />
          <Route path="/waiting" Component={Waiting} />
          <Route path="/call" Component={Call} />
          <Route path="/profile" />
        </Routes>
        <ToastContainer
          position="top-center"
          theme="colored"
          closeOnClick={false}
          pauseOnHover={false}
          pauseOnFocusLoss={false}
          autoClose={COUNT.READY * MILLISECOND}
        />
      </div>
    </div>
  );
}

export default App;
