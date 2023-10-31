import React, { useEffect, useRef, useCallback } from "react";
import { Routes, Route } from "react-router";
// 동적 import 추가하기
import Login from "@pages/Login";
import MainRouter from "@utils/MainRouter";
import { ToastContainer } from "react-toastify";
import * as process from "process";
import { COUNT, MILLISECOND } from "@utils/constant";
import { toast } from "react-toastify";
import "./i18n";

(window as any).global = window;
(window as any).process = process;
(window as any).Buffer = [];

function App() {
  const deferredPrompt = useRef<any>(null);

  const onInstallClick = useCallback(async () => {
    // ref를 사용한 이유
    // 1.
    //  deferredPrompt가 useState라면, 함수 컴포넌트 안에서의 비동기 처리는 상태 업데이트와 동기적으로 이루어지지 않을 수 있음
    // 따라서 이벤트가 발생하여 setState를 한다 해도, 여전히 null로 출력될 수 있음 => 버튼을 눌러도 prompt가 뜨지 않는 원인
    // 하지만 ref를 사용하면, React의 렌더링 주기와는 독립적으로 데이터를 저장하고 관리(사용)할 수 있으므로
    // 실제로 ref에 값이 할당 될 때, 모든 코드에서 deferredPrompt.current 값이 업데이트 됨
    // 오히려, setState를 하여 발생하는 비동기 문제보다 훨씬 쉽게 직관적으로 참조 값을 관리할 수 있음
    // 따라서 이 콜백 함수의 위치는 관련이 없음(아래에 존재해도 됨)
    if (!deferredPrompt.current) {
      return;
    }
    deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    console.log(outcome);
    // if (outcome === "dismissed") => 처리?
    deferredPrompt.current = null;
  }, []);

  useEffect(() => {
    // 2.
    // dismissed 될 때마다 불림
    // useState로 한다면, 취소할 때마다 불필요한 리렌더링이 일어나기 때문에 ref로 변경
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      deferredPrompt.current = e;
    };

    // install prompt가 불리기 전에 발생하는 이벤트
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  useEffect(() => {
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
                onClick={onInstallClick}
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
