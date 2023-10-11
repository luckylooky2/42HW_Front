import React from "react";
import { Routes, Route } from "react-router";
// 동적 import 추가하기
import Login from "@pages/Login";
import MainRouter from "@utils/MainRouter";
import { ToastContainer } from "react-toastify";
import * as process from "process";
import { COUNT, MILLISECOND } from "@utils/constant";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import i18n from "./i18n";

console.log(i18n);

(window as any).global = window;
(window as any).process = process;
(window as any).Buffer = [];

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      console.log(e);
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      // PWA 앱 모드에서 열림
      console.log("PWA 앱 모드에서 열림");
    } else {
      // 웹 브라우저에서 열림
      toast.info(
        <div>
          <div className="text-center">
            42Hello World는 앱에서 원활한 사용을 할 수 있습니다.
          </div>
          <div className="flex">
            {window.navigator.userAgent.toLowerCase().indexOf("chrome") ===
            -1 ? (
              <div className="w-full text-center">
                <img
                  className="inline"
                  width="15"
                  height="15"
                  src="./share.svg"
                  alt="install"
                />{" "}
                를 클릭하여 "홈 화면에 추가"를 통해 앱을 설치해주세요.
              </div>
            ) : (
              <button
                className="rounded-lg bg-orange-200 px-4 mx-auto"
                onClick={async () => {
                  if (!deferredPrompt) {
                    return;
                  }
                  deferredPrompt.prompt();
                  const { outcome } = await deferredPrompt.userChoice;
                  setDeferredPrompt(null);
                }}
              >
                홈 화면에 추가
              </button>
            )}
          </div>
        </div>,
        {
          autoClose: false,
        }
      );
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  return (
    <div className="h-full">
      <div className="h-full">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<MainRouter />} />
        </Routes>
        <ToastContainer
          position="top-center"
          theme="colored"
          hideProgressBar={true}
          closeOnClick={false}
          pauseOnHover={false}
          pauseOnFocusLoss={false}
          autoClose={COUNT.DEFAULT * MILLISECOND}
          style={{ maxWidth: "500px", width: "100vw" }}
        />
      </div>
    </div>
  );
}

export default App;
