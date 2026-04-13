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
      kicker: "Version 0.1 Foundation",
      title: "A multilingual reference platform for the Islamic Golden Age.",
      description:
        "This first version establishes the core architecture for a public educational website that can grow into a trusted, well-linked knowledge base across languages.",
      primaryCta: "Browse placeholder content",
      secondaryCta: "Open the first profile",
      highlights: [
        {
          title: "Canonical by design",
          description:
            "People, books, events, and categories are modeled as canonical entities so translations and links stay organized as the catalog expands.",
        },
        {
          title: "Built for localization",
          description:
            "Locale-prefixed routing, metadata helpers, and direction-aware layout decisions make later multilingual growth far easier.",
        },
        {
          title: "Solo-maintainable",
          description:
            "The project starts as a clean monolith with explicit modules, avoiding extra infrastructure before it becomes useful.",
        },
      ],
    },
    it: {
      kicker: "Fondazione Versione 0.1",
      title:
        "Una piattaforma di riferimento multilingue per l'eta dell'oro islamica.",
      description:
        "Questa prima versione imposta l'architettura di base per un sito educativo pubblico che possa crescere in una knowledge base affidabile e ben collegata.",
      primaryCta: "Sfoglia i contenuti iniziali",
      secondaryCta: "Apri il primo profilo",
      highlights: [
        {
          title: "Modello canonico",
          description:
            "Persone, libri, eventi e categorie sono modellati come entita canoniche cosi che traduzioni e collegamenti restino ordinati nel tempo.",
        },
        {
          title: "Pensato per le lingue",
          description:
            "Routing con prefisso locale, helper SEO e supporto alla direzione del testo rendono piu semplice la crescita multilingue futura.",
        },
        {
          title: "Gestibile da una sola persona",
          description:
            "Il progetto parte come monolite pulito con moduli espliciti, senza infrastrutture aggiuntive finche non servono davvero.",
        },
      ],
    },
    ar: {
      kicker: "أساس الإصدار 0.1",
      title: "منصة مرجعية متعددة اللغات عن العصر الذهبي الإسلامي.",
      description:
        "يضع هذا الإصدار الأول الأساس المعماري لموقع تعليمي عام يمكن أن ينمو إلى قاعدة معرفة موثوقة ومترابطة عبر اللغات.",
      primaryCta: "تصفح المحتوى الأولي",
      secondaryCta: "افتح أول صفحة تعريفية",
      highlights: [
        {
          title: "تصميم مرجعي",
          description:
            "تمثل الشخصيات والكتب والأحداث والتصنيفات كيانات مرجعية أساسية حتى تبقى الترجمات والروابط منظمة مع توسع المحتوى.",
        },
        {
          title: "جاهز للتعريب",
          description:
            "يؤسس التوجيه المحلي في المسارات ومساعدات SEO والتعامل مع اتجاه النص قاعدة قوية للتوسع متعدد اللغات لاحقًا.",
        },
        {
          title: "مناسب للمطور الفردي",
          description:
            "يبدأ المشروع كتطبيق موحد واضح البنية دون بنية تحتية إضافية قبل أن تظهر الحاجة الحقيقية إليها.",
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
      title: "Early Reference Entries",
      description:
        "The first listing page is intentionally generic so the content architecture can support articles, scholars, books, events, and categories from one consistent foundation.",
    },
    it: {
      kicker: "Esplora",
      title: "Prime Voci di Riferimento",
      description:
        "La prima pagina elenco e volutamente generica, cosi l'architettura puo sostenere articoli, studiosi, libri, eventi e categorie da una base coerente.",
    },
    ar: {
      kicker: "استكشاف",
      title: "مداخل مرجعية أولية",
      description:
        "تم تصميم صفحة القائمة الأولى بشكل عام حتى تتمكن البنية نفسها من دعم المقالات والعلماء والكتب والأحداث والتصنيفات من أساس واحد متماسك.",
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
