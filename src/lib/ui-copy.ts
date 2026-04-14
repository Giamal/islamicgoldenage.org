/**
 * UI copy helpers
 *
 * Keeps the first-wave interface text centralized and locale-aware.
 * This avoids scattering placeholder strings across routes while a real translation workflow is still being introduced.
 */
import type { Locale } from "@/i18n/config";
import type { ContentEntityType } from "@prisma/client";

/**
 * Returns localized copy for the shared navigation.
 */
export function getNavigationCopy(locale: Locale) {
  const dictionary = {
    en: {
      tagline: "Scholars, books, timelines, and discoveries in context.",
      home: "Home",
      explore: "Explore",
    },
    it: {
      tagline: "Studiosi, libri, cronologie e scoperte nel loro contesto.",
      home: "Home",
      explore: "Esplora",
    },
    ar: {
      tagline: "علماء وكتب وجداول زمنية واكتشافات في سياقها.",
      home: "الرئيسية",
      explore: "استكشف",
    },
  } as const;

  return dictionary[locale];
}

/**
 * Returns localized copy for the homepage.
 */
export function getHomepageCopy(locale: Locale) {
  const dictionary = {
    en: {
      kicker: "Editorial Archive",
      title: "A multilingual archive of the Islamic Golden Age.",
      description:
        "Explore scholars, works, and disciplines through a calm, verifiable editorial structure designed for long-term educational use.",
      primaryCta: "Explore entries",
      secondaryCta: "Read a featured profile",
      highlights: [
        {
          title: "Structured for reference",
          description:
            "People, works, and topics are modeled as canonical entities so links and translations stay coherent as the archive grows.",
        },
        {
          title: "Multilingual by default",
          description:
            "Locale-aware routing, SEO metadata, and right-to-left support ensure the same content can be read across languages.",
        },
        {
          title: "Editorially maintainable",
          description:
            "The interface prioritizes clarity, reading comfort, and reusable patterns over visual noise or trend-driven layouts.",
        },
      ],
    },
    it: {
      kicker: "Archivio Editoriale",
      title: "Un archivio multilingue sull'età dell'oro islamica.",
      description:
        "Esplora studiosi, opere e discipline attraverso una struttura editoriale chiara e verificabile, pensata per la crescita nel tempo.",
      primaryCta: "Esplora le voci",
      secondaryCta: "Leggi un profilo in evidenza",
      highlights: [
        {
          title: "Struttura da archivio",
          description:
            "Persone, opere e temi sono modellati come entità canoniche così che traduzioni e collegamenti restino coerenti.",
        },
        {
          title: "Multilingue per impostazione",
          description:
            "Routing per lingua, metadati SEO e supporto RTL permettono una consultazione stabile in più lingue.",
        },
        {
          title: "Rigore editoriale",
          description:
            "L'interfaccia privilegia leggibilità, gerarchia e continuità, evitando elementi decorativi superflui.",
        },
      ],
    },
    ar: {
      kicker: "أرشيف تحريري",
      title: "أرشيف متعدد اللغات عن العصر الذهبي الإسلامي.",
      description:
        "استكشف العلماء والأعمال والموضوعات ضمن بنية تحريرية هادئة وموثوقة مصممة للنمو المعرفي طويل المدى.",
      primaryCta: "استكشف المداخل",
      secondaryCta: "اقرأ ملفًا مميزًا",
      highlights: [
        {
          title: "بنية مرجعية",
          description:
            "تُنظَّم الشخصيات والأعمال والموضوعات ككيانات معيارية للحفاظ على اتساق الروابط والترجمات.",
        },
        {
          title: "متعدد اللغات افتراضيًا",
          description:
            "يوفر التوجيه حسب اللغة وبيانات SEO ودعم اتجاه النص تجربة قراءة مستقرة عبر اللغات.",
        },
        {
          title: "انضباط تحريري",
          description:
            "يركز التصميم على الوضوح وقابلية القراءة والاتساق، بعيدًا عن الضوضاء البصرية.",
        },
      ],
    },
  } as const;

  return dictionary[locale];
}

/**
 * Returns localized copy for the entity listing page.
 */
export function getEntityIndexCopy(locale: Locale) {
  const dictionary = {
    en: {
      kicker: "Explore",
      title: "Entities Archive",
      description:
        "Browse published entries across people, works, and topics in a unified editorial index.",
    },
    it: {
      kicker: "Esplora",
      title: "Archivio delle Entità",
      description:
        "Consulta le voci pubblicate tra persone, opere e temi in un indice editoriale unificato.",
    },
    ar: {
      kicker: "استكشاف",
      title: "أرشيف الكيانات",
      description:
        "تصفح المداخل المنشورة ضمن فهرس تحريري موحّد يربط الشخصيات والأعمال والموضوعات.",
    },
  } as const;

  return dictionary[locale];
}

/**
 * Returns a localized label for an entity type.
 */
export function getEntityTypeLabel(locale: Locale, entityType: ContentEntityType) {
  const dictionary: Record<Locale, Record<ContentEntityType, string>> = {
    en: {
      person: "Person",
      work: "Work",
      topic: "Topic",
      event: "Event",
      place: "Place",
      source: "Source",
    },
    it: {
      person: "Persona",
      work: "Opera",
      topic: "Tema",
      event: "Evento",
      place: "Luogo",
      source: "Fonte",
    },
    ar: {
      person: "شخصية",
      work: "عمل",
      topic: "موضوع",
      event: "حدث",
      place: "مكان",
      source: "مصدر",
    },
  };

  return dictionary[locale][entityType];
}
