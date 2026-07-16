(function () {
  const STORAGE_KEY = "gipsodelkaSiteDataV1";

  const defaultSite = {
    heroTitle: "Интерьерный декор ручной работы из гипса",
    heroSubtitle: "Панно • Вазы • Подсвечники • Ароматические свечи • Декоративная плитка",
    aboutTitle: "Меня зовут Дарья",
    aboutText1:
      "Я создаю интерьерный декор из гипса вручную. Каждое изделие проходит несколько этапов обработки и окрашивается вручную, чтобы фактура, цвет и детали выглядели аккуратно в живом интерьере.",
    aboutText2:
      "В мастерской можно заказать готовые изделия, подобрать цвет под интерьер или обсудить индивидуальную работу.",
    contactOwner: "ИП Васильева Дарья Владимировна",
    phonePrimary: "+7 996 342 70 75",
    phoneSecondary: "+7 995 966 21 08",
    email: "gipsodelka2108@yandex.ru",
    vk: "https://vk.com/gipsodelka2108",
    telegram: "https://t.me/gipsodelka2108",
    telegramLabel: "@gipsodelka2108",
    whatsapp: "79963427075",
  };

  const defaultProducts = [
    {
      id: "panel-gold-tree",
      type: "Панно",
      title: "Панно «Золотое дерево»",
      sizeLabel: "Размер",
      size: "30×40 см",
      price: "от 6 500 ₽",
      colors: ["#161412", "#b28445", "#f2eadb"],
      image: "assets/panel-black-gold-leaf.jpg",
    },
    {
      id: "panel-field-flowers",
      type: "Панно",
      title: "Панно «Полевые цветы»",
      sizeLabel: "Размер",
      size: "40×50 см",
      price: "от 5 900 ₽",
      colors: ["#efe4d2", "#ffffff", "#8d765b"],
      image: "assets/panel-wildflowers.jpg",
    },
    {
      id: "tile-models-1-2",
      type: "3D-плитка",
      title: "Декоративная плитка «Модель 1 и 2»",
      sizeLabel: "Размер",
      size: "150×150 мм / 100×100 мм",
      price: "от 600 ₽ / шт",
      colors: ["#ffffff", "#e9decc", "#b28445"],
      image: "assets/decorative-tiles.jpg",
    },
    {
      id: "panel-wave",
      type: "3D-панель",
      title: "3D-панель «Волна»",
      sizeLabel: "Размер",
      size: "415×415 мм, толщина 20 мм",
      price: "от 1 500 ₽ / шт",
      colors: ["#ffffff", "#d9d0c1", "#4f614c"],
      image: "assets/decorative-tiles.jpg",
    },
    {
      id: "holder-cat",
      type: "Подсвечник",
      title: "Подсвечник «Котик»",
      sizeLabel: "Размер",
      size: "12×16 см",
      price: "790 ₽",
      colors: ["#ffffff", "#eee3d1", "#b28445"],
      image: "assets/cat-tray.jpg",
    },
    {
      id: "vase-fluted",
      type: "Ваза",
      title: "Ваза «Рифленая»",
      sizeLabel: "Размер",
      size: "22 см",
      price: "1 450 ₽",
      colors: ["#ffffff", "#e7c9c1", "#b7aa96"],
      image: "assets/fluted-vase.jpg",
    },
    {
      id: "candle-butterflies",
      type: "Ароматическая свеча",
      title: "Свеча «Бабочки»",
      sizeLabel: "Объем",
      size: "250 мл",
      price: "от 1 200 ₽",
      colors: ["#a36045", "#f4eadc", "#b28445"],
      image: "assets/candle-butterflies.jpg",
    },
    {
      id: "tray-gold-edge",
      type: "Поднос",
      title: "Поднос «Золотой край»",
      sizeLabel: "Размер",
      size: "26 см",
      price: "от 1 300 ₽",
      colors: ["#ffffff", "#b28445", "#ded3c4"],
      image: "assets/tray-gold.jpg",
    },
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function defaults() {
    return {
      site: clone(defaultSite),
      products: clone(defaultProducts),
      updatedAt: new Date().toISOString(),
    };
  }

  function normalizeState(input) {
    const base = defaults();
    const state = input && typeof input === "object" ? input : {};
    return {
      site: { ...base.site, ...(state.site || {}) },
      products: Array.isArray(state.products) ? state.products : base.products,
      updatedAt: state.updatedAt || base.updatedAt,
    };
  }

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return defaults();
      }

      return normalizeState(JSON.parse(saved));
    } catch {
      return defaults();
    }
  }

  function save(state) {
    const normalized = normalizeState(state);
    normalized.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    return defaults();
  }

  window.GipsodelkaCatalog = {
    STORAGE_KEY,
    defaultSite,
    defaultProducts,
    defaults,
    load,
    save,
    reset,
  };
})();
