import enUS from "$/translations/en-US.json" with { type: "json" };
import { Options } from "localekit_fresh";

export default {
  selfURL: import.meta.url,
  languages: {
    en: enUS,
  },
  fallback_language: "en",
} as unknown as Options;
