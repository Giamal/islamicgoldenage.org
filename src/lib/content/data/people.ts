/**
 * In-memory person entities used by the content repository.
 */
import type { PersonEntity } from "@/lib/content/types";

export const people: PersonEntity[] = [
  {
    id: "person-muhammad",
    entityType: "person",
    canonicalSlug: "muhammad",
    status: "published",
    importanceScore: 100,
    createdAt: "2026-04-12",
    updatedAt: "2026-04-12",
    namePrimary: "Muhammad ibn Abd Allah",
    nameVariants: ["Prophet Muhammad", "Muhammad"],
    birthYear: 570,
    deathYear: 632,
    roles: ["prophet"],
    associatedPlaceIds: ["place-mecca", "place-medina"],
    eraLabel: "Early Islamic period",
    localizations: {
      en: {
        locale: "en",
        slug: "muhammad",
        title: "Prophet Muhammad",
        summary: "Foundational figure in Islamic history.",
        excerpt:
          "A central historical and religious figure whose life shaped Islamic civilization.",
        seo: {
          seoTitle: "Prophet Muhammad | Person",
          seoDescription:
            "Overview of Prophet Muhammad and his historical significance.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Introduction",
            content:
              "Prophet Muhammad is the foundational figure of Islam and an essential historical reference point for later intellectual traditions.",
            order: 1,
          },
          {
            sectionKey: "legacy",
            heading: "Legacy",
            content:
              "His legacy shaped educational, legal, and cultural institutions across the Islamic world.",
            order: 2,
          },
        ],
      },
      it: {
        locale: "it",
        slug: "muhammad",
        title: "Profeta Muhammad",
        summary: "Figura fondativa della storia islamica.",
        excerpt:
          "Figura centrale religiosa e storica che ha influenzato la civilta islamica.",
        seo: {
          seoTitle: "Profeta Muhammad | Persona",
          seoDescription:
            "Panoramica sul Profeta Muhammad e la sua rilevanza storica.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Introduzione",
            content:
              "Il Profeta Muhammad e il punto di riferimento fondamentale dell'Islam.",
            order: 1,
          },
        ],
      },
      ar: {
        locale: "ar",
        slug: "muhammad",
        title: "Muhammad",
        summary: "Shakhsiyya markaziyya fi al-tarikh al-islami.",
        excerpt: "Shakhsiyya diniyya wa tarikhiyya aththarat fi hadarat al-islam.",
        seo: {
          seoTitle: "Muhammad | Shakhsiyya",
          seoDescription: "Mulakhkhas tarikh al-nabi Muhammad wa ahammiyatihi.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Muqaddima",
            content: "Muhammad marja asasi fi tarikh al-islam.",
            order: 1,
          },
        ],
      },
    },
  },
  {
    id: "person-ibn-sina",
    entityType: "person",
    canonicalSlug: "ibn-sina",
    status: "published",
    importanceScore: 95,
    createdAt: "2026-04-12",
    updatedAt: "2026-04-12",
    namePrimary: "Ibn Sina",
    nameVariants: ["Avicenna", "Abu Ali al-Husayn ibn Sina"],
    birthYear: 980,
    deathYear: 1037,
    roles: ["physician", "philosopher", "scholar"],
    domains: ["medicine", "philosophy"],
    associatedPlaceIds: ["place-bukhara", "place-hamadan"],
    eraLabel: "Islamic Golden Age",
    localizations: {
      en: {
        locale: "en",
        slug: "ibn-sina",
        title: "Ibn Sina (Avicenna)",
        summary: "Physician and philosopher of the Islamic Golden Age.",
        excerpt:
          "A major polymath whose medical and philosophical works influenced global intellectual history.",
        seo: {
          seoTitle: "Ibn Sina (Avicenna) | Person",
          seoDescription:
            "Biography and contributions of Ibn Sina in medicine and philosophy.",
        },
        sections: [
          {
            sectionKey: "biography",
            heading: "Biography",
            content:
              "Ibn Sina was born near Bukhara and became one of the most influential scholars of his era.",
            order: 1,
          },
          {
            sectionKey: "contributions",
            heading: "Contributions",
            content:
              "He authored major works in medicine and philosophy, including The Canon of Medicine.",
            order: 2,
          },
        ],
      },
      it: {
        locale: "it",
        slug: "ibn-sina",
        title: "Ibn Sina (Avicenna)",
        summary: "Medico e filosofo dell'eta dell'oro islamica.",
        excerpt:
          "Polimata di grande influenza nella medicina e nella filosofia.",
        seo: {
          seoTitle: "Ibn Sina (Avicenna) | Persona",
          seoDescription:
            "Biografia e contributi di Ibn Sina in medicina e filosofia.",
        },
        sections: [
          {
            sectionKey: "biography",
            heading: "Biografia",
            content:
              "Ibn Sina nacque vicino a Bukhara e divenne uno dei grandi studiosi del suo tempo.",
            order: 1,
          },
        ],
      },
      ar: {
        locale: "ar",
        slug: "ibn-sina",
        title: "Ibn Sina",
        summary: "Tabib wa faylasuf min al-asr al-dhahabi al-islami.",
        excerpt: "Min abaraz al-mufakkirin fi al-tibb wa al-falsafa.",
        seo: {
          seoTitle: "Ibn Sina | Shakhsiyya",
          seoDescription: "Sira wa ishamat Ibn Sina fi al-tibb wa al-falsafa.",
        },
        sections: [
          {
            sectionKey: "biography",
            heading: "Sira",
            content: "Kana Ibn Sina min a'zam ulama al-asr al-dhahabi.",
            order: 1,
          },
        ],
      },
    },
  },
  {
    id: "person-al-khwarizmi",
    entityType: "person",
    canonicalSlug: "al-khwarizmi",
    status: "published",
    importanceScore: 92,
    createdAt: "2026-04-12",
    updatedAt: "2026-04-12",
    namePrimary: "Al-Khwarizmi",
    nameVariants: ["Muhammad ibn Musa al-Khwarizmi"],
    birthYear: 780,
    deathYear: 850,
    roles: ["mathematician", "astronomer", "scholar"],
    domains: ["mathematics", "astronomy"],
    associatedPlaceIds: ["place-baghdad"],
    eraLabel: "Islamic Golden Age",
    localizations: {
      en: {
        locale: "en",
        slug: "al-khwarizmi",
        title: "Al-Khwarizmi",
        summary: "Mathematician associated with the development of algebra.",
        excerpt:
          "A foundational scholar whose mathematical works shaped later scientific traditions.",
        seo: {
          seoTitle: "Al-Khwarizmi | Person",
          seoDescription:
            "Overview of Al-Khwarizmi and his role in the history of mathematics.",
        },
        sections: [
          {
            sectionKey: "contributions",
            heading: "Contributions",
            content:
              "Al-Khwarizmi's treatises on calculation and algebra influenced teaching and research for centuries.",
            order: 1,
          },
        ],
      },
      it: {
        locale: "it",
        slug: "al-khwarizmi",
        title: "Al-Khwarizmi",
        summary: "Matematico legato allo sviluppo dell'algebra.",
        excerpt:
          "Studioso fondamentale i cui lavori matematici influenzarono la tradizione scientifica.",
        seo: {
          seoTitle: "Al-Khwarizmi | Persona",
          seoDescription:
            "Panoramica su Al-Khwarizmi e il suo ruolo nella storia della matematica.",
        },
        sections: [
          {
            sectionKey: "contributions",
            heading: "Contributi",
            content:
              "I suoi testi su calcolo e algebra hanno avuto un impatto duraturo.",
            order: 1,
          },
        ],
      },
      ar: {
        locale: "ar",
        slug: "al-khwarizmi",
        title: "Al-Khwarizmi",
        summary: "Alim riyadi irtabata ismuhu bi nashat al-jabr.",
        excerpt: "Min ruwwad al-riyadiyyat fi al-hadara al-islamiyya.",
        seo: {
          seoTitle: "Al-Khwarizmi | Shakhsiyya",
          seoDescription: "Mulakhkhas ishamat al-khwarizmi fi al-riyadiyyat.",
        },
        sections: [
          {
            sectionKey: "contributions",
            heading: "Ishamat",
            content: "Asas li tatawwur al-jabr wa turuq al-hisab.",
            order: 1,
          },
        ],
      },
    },
  },
];
