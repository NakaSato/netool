export const fallbackLng = "en";
export const languages = ["en", "fr", "zh"];
export const defaultNS = "common";

export function getOptions(
  lng = fallbackLng,
  ns: string | string[] = defaultNS
) {
  return {
    // debug: process.env.NODE_ENV === 'development',
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
