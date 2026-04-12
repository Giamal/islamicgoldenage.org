/**
 * In-memory work entities used by the content repository.
 */
import type { WorkEntity } from "@/lib/content/types";

export const works: WorkEntity[] = [
  {
    id: "work-canon-of-medicine",
    entityType: "work",
    canonicalSlug: "canon-of-medicine",
    status: "published",
    importanceScore: 94,
    createdAt: "2026-04-12",
    updatedAt: "2026-04-12",
    titlePrimary: "The Canon of Medicine",
    workType: "book",
    compositionYear: 1025,
    languageOriginal: "Arabic",
    contributors: [{ personId: "person-ibn-sina", role: "author" }],
    localizations: {
      en: {
        locale: "en",
        slug: "canon-of-medicine",
        title: "The Canon of Medicine",
        summary: "A landmark medical encyclopedia by Ibn Sina.",
        excerpt:
          "One of the most influential medical works in premodern intellectual history.",
        seo: {
          seoTitle: "The Canon of Medicine | Work",
          seoDescription:
            "Overview of Ibn Sina's Canon of Medicine and its historical impact.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Introduction",
            content:
              "The Canon of Medicine systematized medical knowledge and circulated widely in multiple scholarly contexts.",
            order: 1,
          },
        ],
      },
      it: {
        locale: "it",
        slug: "canon-of-medicine",
        title: "Il Canone della Medicina",
        summary: "Enciclopedia medica di riferimento di Ibn Sina.",
        excerpt:
          "Opera medica di grande influenza nella storia intellettuale premoderna.",
        seo: {
          seoTitle: "Il Canone della Medicina | Opera",
          seoDescription:
            "Panoramica del Canone della Medicina e del suo impatto storico.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Introduzione",
            content:
              "Il Canone organizza il sapere medico in forma sistematica.",
            order: 1,
          },
        ],
      },
      ar: {
        locale: "ar",
        slug: "canon-of-medicine",
        title: "Al-Qanun fi al-Tibb",
        summary: "Marja tibbi kabir li Ibn Sina.",
        excerpt: "Min ahamm al-muallafat al-tibbiyya fi al-tarikh al-qadim.",
        seo: {
          seoTitle: "Al-Qanun fi al-Tibb | Amal",
          seoDescription: "Mulakhkhas an al-qanun wa atharihi al-tarikhi.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Muqaddima",
            content: "Kitab jama wa rattaba ma'rifat al-tibb bi uslub manhaji.",
            order: 1,
          },
        ],
      },
    },
  },
  {
    id: "work-al-jabr",
    entityType: "work",
    canonicalSlug: "al-jabr-wal-muqabala",
    status: "published",
    importanceScore: 93,
    createdAt: "2026-04-12",
    updatedAt: "2026-04-12",
    titlePrimary: "Al-Jabr wa'l-Muqabala",
    workType: "treatise",
    compositionYear: 830,
    languageOriginal: "Arabic",
    contributors: [{ personId: "person-al-khwarizmi", role: "author" }],
    localizations: {
      en: {
        locale: "en",
        slug: "al-jabr-wal-muqabala",
        title: "Al-Jabr wa'l-Muqabala",
        summary: "A foundational algebra treatise by Al-Khwarizmi.",
        excerpt:
          "A classic work that helped establish algebra as a formal discipline.",
        seo: {
          seoTitle: "Al-Jabr wa'l-Muqabala | Work",
          seoDescription:
            "Overview of Al-Khwarizmi's foundational treatise on algebra.",
        },
        sections: [
          {
            sectionKey: "themes",
            heading: "Major Themes",
            content:
              "The treatise presents problem-solving methods that became central to algebraic instruction.",
            order: 1,
          },
        ],
      },
      it: {
        locale: "it",
        slug: "al-jabr-wal-muqabala",
        title: "Al-Jabr wa'l-Muqabala",
        summary: "Trattato fondativo di algebra di Al-Khwarizmi.",
        excerpt:
          "Testo classico che ha contribuito alla formalizzazione dell'algebra.",
        seo: {
          seoTitle: "Al-Jabr wa'l-Muqabala | Opera",
          seoDescription: "Panoramica del trattato algebrico di Al-Khwarizmi.",
        },
        sections: [
          {
            sectionKey: "themes",
            heading: "Temi principali",
            content:
              "Il testo espone metodi di soluzione che diventarono centrali per l'algebra.",
            order: 1,
          },
        ],
      },
      ar: {
        locale: "ar",
        slug: "al-jabr-wal-muqabala",
        title: "Al-Jabr wa al-Muqabala",
        summary: "Risala asasiyya fi al-jabr li al-khwarizmi.",
        excerpt: "Nass marja'i sa'ada fi tashakkul ilm al-jabr.",
        seo: {
          seoTitle: "Al-Jabr wa al-Muqabala | Amal",
          seoDescription: "Mulakhkhas al-risala wa ahammiyatuha fi al-riyadiyyat.",
        },
        sections: [
          {
            sectionKey: "themes",
            heading: "Mawduat",
            content: "Arada qawaid hall al-masa'il bi tariqa manhajiyya.",
            order: 1,
          },
        ],
      },
    },
  },
];
