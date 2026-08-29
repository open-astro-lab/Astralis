import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import hi from "./hi.json";

// To add a new language later: create fr.json / de.json with the SAME keys
// as en.json, import it here, and add it to `resources` + LANGUAGES below.
export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
];

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: localStorage.getItem("astralis_lang") || undefined,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
