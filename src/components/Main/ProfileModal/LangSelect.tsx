import { useState } from "react";

const LangSelect = () => {
  const [systemLang, setSystemLang] = useState("");

  return (
    <div className="flex flex-col h-[30%] justify-between">
      <div className="h-[20%] text-xl">언어 설정</div>
      <div className="flex flex-col h-[70%] w-full">
        <div className="flex items-center bg-gray-200 rounded-md h-8 mx-1 my-0.5 px-5">
          <div>
            <span>배울 언어 : </span>
            <select className="w-20" disabled>
              {["영어"].map((v, i) => (
                <option key={`배울 언어-${i}`}>{v}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center bg-gray-200 rounded-md h-8 mx-1 my-0.5 px-5">
          <div>
            <span>시스템 언어 : </span>
            <select
              className="w-20"
              onChange={(e) => setSystemLang(e.target.value)}
            >
              {["한국어", "영어"].map((v, i) => (
                <option key={`시스템 언어-${i}`}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LangSelect;
