import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "welcome": "Welcome, {{name}}!",
      "text": "This is a simple home page.",
      "switch": "Switch to Hindi",
      "logout": "Logout"
    }
  },
  hi: {
    translation: {
      "welcome": "स्वागत है, {{name}}!",
      "text": "यह एक साधारण होम पेज है।",
      "switch": "अंग्रेज़ी में बदलें",
      "logout": "लॉग आउट"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", 
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
