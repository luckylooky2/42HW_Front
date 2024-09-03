import { LANG } from "@utils/constant";
import i18n from "i18n";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LangSelect = () => {
  const { t } = useTranslation("translation", { keyPrefix: "profile" });
  const [langList, setLangList] = useState<string[]>([]);

  useEffect(() => {
    setLangList(t("language.list", { returnObjects: true }));
  }, []);

  const setSystemLanguage = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const target = e.target as HTMLSelectElement;
      let selectedLang: string;
      switch (target.value) {
        case "한국어":
        case "Korean":
          selectedLang = LANG.KO;
          break;
        case "영어":
        case "English":
          selectedLang = LANG.EN;
          break;
        default:
          selectedLang = LANG.EN;
      }
      localStorage.setItem("lang", selectedLang);
      i18n.changeLanguage(selectedLang).then().catch();
      setLangList(t("language.list", { returnObjects: true }));
    },
    []
  );

  return (
    <div className="flex flex-col h-[30%] justify-between">
      <div className="h-[20%] text-xl">{t("language.title")}</div>
      <div className="flex flex-col h-[70%] w-full">
        <div className="flex items-center bg-gray-200 rounded-md h-8 mx-1 my-0.5 px-5">
          <div>
            <span>{t("language.speak")} : </span>
            <select className="w-20" disabled>
              {langList.map((v, i) => (
                <option key={`langToSpeak-${i}`}>{v}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center bg-gray-200 rounded-md h-8 mx-1 my-0.5 px-5">
          <div>
            <span>{t("language.system")} : </span>
            <select
              className="w-20"
              value={t("language.default")}
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
