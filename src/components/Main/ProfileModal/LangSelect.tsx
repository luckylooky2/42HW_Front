import { useCallback, useEffect, useState } from "react";
import i18n from "i18n";
import { LANG, LANGLIST } from "@utils/constant";

const LangSelect = () => {
  const [langList, setLangList] = useState<string[]>([]);

  useEffect(() => {
    const curr = localStorage.getItem("lang") === LANG.KR ? LANG.KR : LANG.EN;
    setLangList(curr === LANG.KR ? LANGLIST.KR : LANGLIST.EN);
  }, []);

  const setSystemLanguage = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const target = e.target as HTMLSelectElement;
      if (target.value === "한국어" || target.value === "Korean") {
        localStorage.setItem("lang", LANG.KR);
        i18n.changeLanguage(LANG.KR).then().catch();
        setLangList(LANGLIST.KR);
      } else {
        localStorage.setItem("lang", LANG.EN);
        i18n.changeLanguage(LANG.EN).then().catch();
        setLangList(LANGLIST.EN);
      }
    },
    []
  );

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
              value={
                localStorage.getItem("lang") === LANG.KR ? "한국어" : "영어"
              }
              onChange={setSystemLanguage}
            >
              {langList.map((v, i) => (
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
