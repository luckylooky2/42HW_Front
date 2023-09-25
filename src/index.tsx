import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { API_URL } from "@utils/constant";
import AuthProvider from "@contexts/AuthProvider";
import SocketProvider from "@contexts/SocketProvider";
import CallProvider from "@contexts/CallProvider";
import axios from "axios";

// TODO : axios interceptor 사용하기
axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  //   process.env.NODE_ENV === "production"
  // ? "https://sleact.nodebird.com"
  // :
  API_URL;

// // 토큰이 있으면 꺼내서 axios에 저장
// function loadUserData() {
//   try {
//     const token = localStorage.getItem("at");
//     // 없으면 일단 저장하지 않음
//     if (!token) return;

//     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } catch (e) {
//     console.log("localStorage is not working");
//   }
// }

// loadUserData();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// AuthProvider는 BrowserRouter 안에 존재해야 함
// Uncaught Error: useNavigate() may be used only in the context of a <Router> component.
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <SocketProvider>
        <CallProvider>
          <App />
        </CallProvider>
      </SocketProvider>
    </AuthProvider>
  </BrowserRouter>
  // {/* </React.StrictMode> */}
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
