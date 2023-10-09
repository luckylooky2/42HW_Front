import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translationKr, translationEn } from "./locale";
import { LANG } from "@utils/constant";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      kr: { translation: translationKr },
      en: { translation: translationEn },
    },
    lng: localStorage.getItem("lang") === LANG.KR ? LANG.KR : LANG.EN, // 기본 언어
    fallbackLng: LANG.EN,
    keySeparator: ".",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
