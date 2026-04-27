export const dictionaries = {
  en: () => import("../messages/en.json").then((m) => m.default),
  es: () => import("../messages/es.json").then((m) => m.default),
};

export const getDictionary = async (lang) => {
  return dictionaries[lang]?.() || dictionaries.en();
};
