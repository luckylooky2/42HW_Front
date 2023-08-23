import React from "react";
import { Routes, Route, Navigate } from "react-router";
import Login from "@pages/Login";
import Redirect from "@pages/Redirect";

function App() {
  return (
    <>
      <div className="container h-full">
        <div className="h-[95%]">
          <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" Component={Login} />
            <Route path="/redirect" Component={Redirect} />
            <Route path="/main" />
            <Route path="/chat" />
            <Route path="/profile" />
          </Routes>
        </div>
        <footer className="text-center text-gray-500">
          <small className="italic">Copyright &copy; 2023 Mozila</small>
          <small> | </small>
          <small>문의하기</small>
        </footer>
      </div>
    </>
  );
}

export default App;
