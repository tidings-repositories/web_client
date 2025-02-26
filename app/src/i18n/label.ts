import i18next from "i18next";

const us = "en-US";
const kr = "ko-KR";

const module = await loadLanguageFile();
const language = module.default;

async function loadLanguageFile() {
  const defaultLanguage = navigator.language ?? "en-US";

  if (defaultLanguage == us) {
    return import("./l10n/en/label-en.json");
  } else if (defaultLanguage == kr) {
    return import("./l10n/ko/label-ko.json");
  } else {
    return import("./l10n/en/label-en.json");
  }
}

const defaultSetting = {
  translation: language,
};

i18next.init({
  lng: "en",
  resources: {
    en: defaultSetting,
    ko: defaultSetting,
  },
});
