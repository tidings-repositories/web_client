import i18next from "i18next";

const us = "en-US";
const kr = "ko-KR";

const module = await loadLanguageFile();
const language = module.default;

async function loadLanguageFile() {
  const defaultLanguage = navigator.language ?? "ko-KR";

  if (defaultLanguage == kr) {
    return import("./l10n/ko/label-ko.json");
  } else if (defaultLanguage == us) {
    return import("./l10n/en/label-en.json");
  } else {
    return import("./l10n/en/label-en.json");
  }
}

const defaultSetting = {
  translation: language,
};

i18next.init({
  lng: "ko",
  resources: {
    en: defaultSetting,
    ko: defaultSetting,
  },
});
