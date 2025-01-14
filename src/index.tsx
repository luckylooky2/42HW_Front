import AudioProvider from "@contexts/AudioProvider";
import AuthProvider from "@contexts/AuthProvider";
import CallProvider from "@contexts/CallProvider";
import SocketProvider from "@contexts/SocketProvider";
import { API_URL } from "@utils/constant";
import { getCookie, deleteCookie } from "@utils/manageCookie";
import axios from "axios";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./tailwind.css";
import "./index.css";

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  //   import.meta.env.NODE_ENV === "production"
  // ? "https://sleact.nodebird.com"
  // :
  API_URL;

// at는 확인할 수 없고, login만 확인 가능
axios.interceptors.request.use(
  function (request) {
    const cookies = getCookie("login");
    if (!cookies) {
      alert("로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요.");
      window.location.href = "/";
    }
    return request;
  },
  function (error) {
    return error;
  }
);

// login은 반드시 있다는 가정(즉, at가 없거나 만료되었을 때)
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    deleteCookie("login");
    alert("로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요.");
    window.location.href = "/";
    return error;
  }
);

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
        <AudioProvider>
          <CallProvider>
            <App />
          </CallProvider>
        </AudioProvider>
      </SocketProvider>
    </AuthProvider>
  </BrowserRouter>
  // </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
