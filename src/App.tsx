import React from "react";
import { Routes, Route, Navigate } from "react-router";
// 동적 import 추가하기
import Login from "@pages/Login";
import Redirect from "@pages/Redirect";
import Main from "@pages/Main";
import Waiting from "@pages/Waiting";
import Call from "@pages/Call";

function App() {
  return (
    <div className="container h-full">
      <div className="h-[100%]">
        <Routes>
          <Route path="/" element={<Navigate replace to="/main" />} />
          <Route path="/login" Component={Login} />
          <Route path="/redirect" Component={Redirect} />
          <Route path="/main" Component={Main} />
          <Route path="/waiting" Component={Waiting} />
          <Route path="/call" Component={Call} />
          <Route path="/profile" />
        </Routes>
      </div>
    </div>
  );
}

export default App;
