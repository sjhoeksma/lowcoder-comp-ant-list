import { getI18nObjects, getValueByLocale, Translator } from "lowcoder-sdk";
import * as localeData from "./locales";
import { I18nObjects } from "./locales/types";

// @ts-ignore
export const { trans, language } = new Translator<typeof localeData.en>(
  localeData,
  REACT_APP_LANGUAGES
);

// @ts-ignore
export const i18nObjs: any = getI18nObjects<I18nObjects>(localeData, REACT_APP_LANGUAGES);

export function getEchartsLocale() {
  return getValueByLocale("EN", (locale: any) => {
    switch (locale.language) {
      case "en":
        return "EN";
      case "zh":
        return "ZH";
    }
  });
}

export function getCalendarLocale() {
  switch (language) {
    case "zh":
      return "zh-cn";
    default:
      return "en-gb";
  }
}
