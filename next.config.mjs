/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    // These are the locales you want to support
    locales: ["en", "fr", "zh"],
    // This is the default locale
    defaultLocale: "en",
    // This is the locale detection strategy
    localeDetection: false,
  },
};

export default nextConfig;
