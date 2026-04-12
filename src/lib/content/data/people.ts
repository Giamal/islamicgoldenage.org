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
        summary:
          "Religious and historical figure at the center of early Islamic history.",
        excerpt:
          "His leadership in Mecca and Medina shaped the earliest Muslim community and left a lasting civilizational legacy.",
        seo: {
          seoTitle: "Prophet Muhammad | Person",
          seoDescription:
            "Concise educational overview of Prophet Muhammad's life, context, and legacy.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Introduction",
            content:
              "Prophet Muhammad is the central figure of Islam and a key historical reference point for the formation of early Muslim society.",
            order: 1,
          },
          {
            sectionKey: "biography",
            heading: "Biography",
            content:
              "Born in Mecca, he later migrated to Medina, where a structured community took shape under his leadership.",
            order: 2,
          },
          {
            sectionKey: "contributions",
            heading: "Contributions",
            content:
              "His teachings established core religious, social, and legal principles that influenced later educational and scholarly traditions.",
            order: 3,
          },
          {
            sectionKey: "legacy",
            heading: "Legacy",
            content:
              "The memory of his life became foundational for historical writing, devotional literature, and ethical thought across the Islamic world.",
            order: 4,
          },
        ],
      },
      it: {
        locale: "it",
        slug: "muhammad",
        title: "Profeta Muhammad",
        summary:
          "Figura religiosa e storica centrale per la formazione della prima comunita islamica.",
        excerpt:
          "La sua guida tra Mecca e Medina ha avuto un impatto duraturo sulla storia politica, religiosa e culturale islamica.",
        seo: {
          seoTitle: "Profeta Muhammad | Persona",
          seoDescription:
            "Profilo educativo sintetico del Profeta Muhammad tra contesto storico e eredita.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Introduzione",
            content:
              "Il Profeta Muhammad e il riferimento centrale dell'Islam e una figura decisiva della storia tardoantica.",
            order: 1,
          },
          {
            sectionKey: "biography",
            heading: "Biografia",
            content:
              "Nato alla Mecca, la sua migrazione a Medina segna l'avvio di una nuova fase comunitaria e politica.",
            order: 2,
          },
          {
            sectionKey: "contributions",
            heading: "Contributi",
            content:
              "Le sue indicazioni religiose ed etiche influenzano in seguito istituzioni giuridiche, educative e sociali.",
            order: 3,
          },
          {
            sectionKey: "legacy",
            heading: "Eredita",
            content:
              "La memoria della sua vita diventa centrale nella storiografia, nella letteratura religiosa e nella cultura islamica.",
            order: 4,
          },
        ],
      },
      ar: {
        locale: "ar",
        slug: "muhammad",
        title: "Muhammad",
        summary:
          "Shakhsiyya diniyya wa tarikhiyya markaziyya fi nashat al-mujtama al-islami al-awwal.",
        excerpt:
          "Qiyadatuhu bayna Makka wa al-Madina aththarat bishaql da'im fi al-hadara al-islamiyya.",
        seo: {
          seoTitle: "Muhammad | Shakhsiyya",
          seoDescription:
            "Mulakhkhas ta'limi an hayat al-nabi Muhammad wa atharihi al-tarikhi.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Muqaddima",
            content:
              "Muhammad hu marja asasi fi al-tarikh al-islami wa fi takwin al-mujtama al-awwal.",
            order: 1,
          },
          {
            sectionKey: "biography",
            heading: "Sira",
            content:
              "Intaqala min Makka ila al-Madina, wa kana dhalik marhala muhima fi bina al-mujtama.",
            order: 2,
          },
          {
            sectionKey: "legacy",
            heading: "Irth",
            content:
              "Turathuh aththara fi al-fikr al-dini wa al-ijtima'i wa fi kutub al-tarikh wa al-adab.",
            order: 3,
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
        summary:
          "Polymath of the Islamic Golden Age known for medicine and philosophy.",
        excerpt:
          "His synthesis of clinical practice and philosophical inquiry made him one of the most influential thinkers of the medieval world.",
        seo: {
          seoTitle: "Ibn Sina (Avicenna) | Person",
          seoDescription:
            "Educational profile of Ibn Sina, his life, major works, and long-term influence.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Introduction",
            content:
              "Ibn Sina is remembered as a physician, philosopher, and scholar whose writings circulated across multiple intellectual traditions.",
            order: 1,
          },
          {
            sectionKey: "biography",
            heading: "Biography",
            content:
              "Born near Bukhara, he worked in several courts and scholarly circles, combining practical medicine with extensive study.",
            order: 2,
          },
          {
            sectionKey: "contributions",
            heading: "Contributions",
            content:
              "His medical encyclopedia, The Canon of Medicine, and his philosophical treatises became reference texts for centuries.",
            order: 3,
          },
          {
            sectionKey: "influence",
            heading: "Influence",
            content:
              "His methods shaped teaching in medicine and logic across Arabic, Persian, and later Latin scholarly environments.",
            order: 4,
          },
          {
            sectionKey: "legacy",
            heading: "Legacy",
            content:
              "Ibn Sina remains a central figure in the history of science and intellectual exchange between regions and languages.",
            order: 5,
          },
        ],
      },
      it: {
        locale: "it",
        slug: "ibn-sina",
        title: "Ibn Sina (Avicenna)",
        summary:
          "Polimata dell'eta dell'oro islamica noto soprattutto per medicina e filosofia.",
        excerpt:
          "L'unione tra pratica medica e riflessione filosofica lo rende una figura chiave della storia intellettuale medievale.",
        seo: {
          seoTitle: "Ibn Sina (Avicenna) | Persona",
          seoDescription:
            "Profilo sintetico di Ibn Sina, opere principali e influenza storica.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Introduzione",
            content:
              "Ibn Sina e ricordato come medico, filosofo e autore di testi fondamentali per la formazione scientifica medievale.",
            order: 1,
          },
          {
            sectionKey: "biography",
            heading: "Biografia",
            content:
              "Nato nell'area di Bukhara, opero in diversi contesti politici e culturali mantenendo una forte attivita di studio.",
            order: 2,
          },
          {
            sectionKey: "contributions",
            heading: "Contributi",
            content:
              "Il Canone della Medicina e altre opere sistematizzano il sapere medico e filosofico con grande chiarezza.",
            order: 3,
          },
          {
            sectionKey: "legacy",
            heading: "Eredita",
            content:
              "La sua opera rimane un riferimento nella storia della medicina e della filosofia nel Mediterraneo medievale.",
            order: 4,
          },
        ],
      },
      ar: {
        locale: "ar",
        slug: "ibn-sina",
        title: "Ibn Sina",
        summary:
          "Tabib wa faylasuf min abaraz ulama al-asr al-dhahabi al-islami.",
        excerpt:
          "Jama bayna al-tibb wa al-falsafa fi muallafat aththarat fi al-fikr li qarnin mutataliya.",
        seo: {
          seoTitle: "Ibn Sina | Shakhsiyya",
          seoDescription:
            "Mulakhkhas ta'limi an hayat Ibn Sina wa muallafatihi fi al-tibb wa al-falsafa.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Muqaddima",
            content:
              "Ibn Sina min ashhar ulama al-hadara al-islamiyya fi al-tibb wa al-falsafa.",
            order: 1,
          },
          {
            sectionKey: "biography",
            heading: "Sira",
            content:
              "Nasha qurb Bukhara wa tanqqala bayna madin, wa kana yatlub al-ilm wa yumaris al-tibb.",
            order: 2,
          },
          {
            sectionKey: "contributions",
            heading: "Ishamat",
            content:
              "Kitabuhu Al-Qanun fi al-Tibb asbaha marja asasi fi al-dirasa al-tibbiyya.",
            order: 3,
          },
          {
            sectionKey: "legacy",
            heading: "Irth",
            content:
              "Atharuh baqin fi tarikh al-ulum wa fi al-hiwar al-fikri bayna al-hadarat.",
            order: 4,
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
        summary:
          "Mathematician and astronomer associated with the early development of algebra.",
        excerpt:
          "His technical writing on calculation and equations helped shape mathematical language and methods in later traditions.",
        seo: {
          seoTitle: "Al-Khwarizmi | Person",
          seoDescription:
            "Educational profile of Al-Khwarizmi and his role in the history of algebra and astronomy.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Introduction",
            content:
              "Al-Khwarizmi is one of the best-known scientific figures associated with Abbasid Baghdad.",
            order: 1,
          },
          {
            sectionKey: "biography",
            heading: "Biography",
            content:
              "He worked in a scholarly environment linked to translation, astronomy, and state-supported research.",
            order: 2,
          },
          {
            sectionKey: "contributions",
            heading: "Contributions",
            content:
              "His treatise on algebra organized mathematical procedures into a teachable format with broad influence.",
            order: 3,
          },
          {
            sectionKey: "influence",
            heading: "Influence",
            content:
              "His terminology and methods contributed to the long transmission of mathematical knowledge into later languages.",
            order: 4,
          },
        ],
      },
      it: {
        locale: "it",
        slug: "al-khwarizmi",
        title: "Al-Khwarizmi",
        summary:
          "Matematico e astronomo legato alla formazione dell'algebra classica.",
        excerpt:
          "I suoi testi su calcolo e risoluzione delle equazioni hanno avuto un impatto duraturo nella tradizione scientifica.",
        seo: {
          seoTitle: "Al-Khwarizmi | Persona",
          seoDescription:
            "Profilo sintetico di Al-Khwarizmi e del suo contributo alla matematica medievale.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Introduzione",
            content:
              "Al-Khwarizmi e una figura centrale della matematica nel periodo abbaside.",
            order: 1,
          },
          {
            sectionKey: "biography",
            heading: "Biografia",
            content:
              "Opero a Baghdad in un contesto di traduzioni, studio astronomico e ricerca matematica.",
            order: 2,
          },
          {
            sectionKey: "contributions",
            heading: "Contributi",
            content:
              "Il suo trattato di algebra rese piu sistematici metodi di calcolo e risoluzione dei problemi.",
            order: 3,
          },
          {
            sectionKey: "legacy",
            heading: "Eredita",
            content:
              "La sua opera resta un riferimento per comprendere la storia della matematica premoderna.",
            order: 4,
          },
        ],
      },
      ar: {
        locale: "ar",
        slug: "al-khwarizmi",
        title: "Al-Khwarizmi",
        summary:
          "Alim fi al-riyadiyyat wa al-falak wa min ruwwad al-jabr fi al-asr al-abbasi.",
        excerpt:
          "Muallafatuhu fi al-hisab wa al-jabr ashamat fi binyat al-fikr al-riyadi li ajyal mutaakhkhira.",
        seo: {
          seoTitle: "Al-Khwarizmi | Shakhsiyya",
          seoDescription:
            "Mulakhkhas ta'limi an ishamat al-khwarizmi fi al-riyadiyyat wa al-falak.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Muqaddima",
            content:
              "Al-Khwarizmi min a'lam al-riyadiyyat fi Baghdad al-abbasiyya.",
            order: 1,
          },
          {
            sectionKey: "contributions",
            heading: "Ishamat",
            content:
              "Kitabatuhu fi al-jabr wa al-hisab ja'alat al-manhaj al-riyadi akthar tanziman.",
            order: 2,
          },
          {
            sectionKey: "legacy",
            heading: "Irth",
            content:
              "Atharuhu zahir fi tarikh al-riyadiyyat wa fi intiqal al-maarifa bayna al-hadarat.",
            order: 3,
          },
        ],
      },
    },
  },
];
