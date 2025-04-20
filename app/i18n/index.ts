import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { getOptions } from "./settings";

// Initialize i18next instance for server-side rendering
const initI18next = async (lng: string, ns: string | string[]) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../../public/locales/${language}/${namespace}.json`)
      )
    )
    .init(getOptions(lng, ns));

  return i18nInstance;
};

// Translation function for server components
export async function useTranslation(
  lng: string,
  ns: string | string[] = "common",
  options: { keyPrefix?: string } = {}
) {
  const i18nextInstance = await initI18next(lng, ns);

  return {
    t: i18nextInstance.getFixedT(
      lng,
      Array.isArray(ns) ? ns[0] : ns,
      options.keyPrefix
    ),
    i18n: i18nextInstance,
  };
}
