import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import hi from "./hi.json";
import ta from "./ta.json";
import te from "./te.json";
import ml from "./ml.json";
import mr from "./mr.json";
import bn from "./bn.json";
import as from "./as.json";

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "ml", label: "മലയാളം" },
  { code: "mr", label: "मराठी" },
  { code: "bn", label: "বাংলা" },
  { code: "as", label: "অসমীয়া" },
];

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    ta: { translation: ta },
    te: { translation: te },
    ml: { translation: ml },
    mr: { translation: mr },
    bn: { translation: bn },
    as: { translation: as },
  },
  lng: localStorage.getItem("astralis_lang") || undefined,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
