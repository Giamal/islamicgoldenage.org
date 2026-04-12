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
        summary:
          "A major medical encyclopedia by Ibn Sina that organized clinical and theoretical knowledge.",
        excerpt:
          "One of the best-known medical compendia of the medieval period, studied across regions and languages.",
        seo: {
          seoTitle: "The Canon of Medicine | Work",
          seoDescription:
            "Overview of Ibn Sina's Canon and its long-term influence on medical education.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Introduction",
            content:
              "The Canon of Medicine is a structured reference work that combines inherited knowledge with clinical reasoning.",
            order: 1,
          },
          {
            sectionKey: "structure",
            heading: "Structure",
            content:
              "Its organization into thematic books made it practical for teaching and consultation.",
            order: 2,
          },
          {
            sectionKey: "impact",
            heading: "Impact",
            content:
              "The text shaped medical learning across the Islamic world and later influenced Latin curricula.",
            order: 3,
          },
        ],
      },
      it: {
        locale: "it",
        slug: "canon-of-medicine",
        title: "Il Canone della Medicina",
        summary:
          "Grande enciclopedia medica di Ibn Sina che ordina sapere teorico e pratica clinica.",
        excerpt:
          "Opera di riferimento della medicina medievale, studiata in contesti linguistici e culturali diversi.",
        seo: {
          seoTitle: "Il Canone della Medicina | Opera",
          seoDescription:
            "Panoramica sul Canone di Ibn Sina e sul suo impatto storico nella formazione medica.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Introduzione",
            content:
              "Il Canone unisce tradizioni mediche precedenti e osservazione clinica in una sintesi molto ordinata.",
            order: 1,
          },
          {
            sectionKey: "structure",
            heading: "Struttura",
            content:
              "La divisione in parti tematiche facilita lo studio e la trasmissione del sapere.",
            order: 2,
          },
          {
            sectionKey: "impact",
            heading: "Impatto",
            content:
              "L'opera ha influenzato a lungo l'insegnamento medico in ambito islamico ed europeo.",
            order: 3,
          },
        ],
      },
      ar: {
        locale: "ar",
        slug: "canon-of-medicine",
        title: "Al-Qanun fi al-Tibb",
        summary:
          "Mawsua tibbiyya kabira li Ibn Sina tanzim al-maarifa al-nazariyya wa al-amaliyya.",
        excerpt:
          "Min ahamm al-kutub al-tibbiyya allati ustukhdimat fi al-ta'lim li mudda tawila.",
        seo: {
          seoTitle: "Al-Qanun fi al-Tibb | Amal",
          seoDescription:
            "Mulakhkhas an kitab al-qanun wa atharihi fi tarikh al-ta'lim al-tibbi.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Muqaddima",
            content:
              "Al-qanun kitab jami fi al-tibb yajma bayna al-nazariyya wa al-mumarasa.",
            order: 1,
          },
          {
            sectionKey: "impact",
            heading: "Athar",
            content:
              "Asbaha marja li al-atibba wa al-talaba fi madaris mukhtalifa.",
            order: 2,
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
        summary:
          "Foundational treatise that formalized algebraic problem-solving methods.",
        excerpt:
          "A landmark text in the history of mathematics that helped define algebra as a teachable discipline.",
        seo: {
          seoTitle: "Al-Jabr wa'l-Muqabala | Work",
          seoDescription:
            "Overview of Al-Khwarizmi's algebra treatise and its historical significance.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Introduction",
            content:
              "This treatise is central to the history of algebra and to the pedagogy of mathematical reasoning.",
            order: 1,
          },
          {
            sectionKey: "themes",
            heading: "Major Themes",
            content:
              "It presents classification of equations and practical procedures for solving them.",
            order: 2,
          },
          {
            sectionKey: "impact",
            heading: "Impact",
            content:
              "Its methods traveled across scholarly networks and influenced later mathematical writing.",
            order: 3,
          },
        ],
      },
      it: {
        locale: "it",
        slug: "al-jabr-wal-muqabala",
        title: "Al-Jabr wa'l-Muqabala",
        summary:
          "Trattato fondamentale che rende sistematico il ragionamento algebrico.",
        excerpt:
          "Testo chiave nella storia della matematica medievale e nell'insegnamento dell'algebra.",
        seo: {
          seoTitle: "Al-Jabr wa'l-Muqabala | Opera",
          seoDescription:
            "Panoramica del trattato di Al-Khwarizmi e della sua importanza storica.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Introduzione",
            content:
              "L'opera rappresenta un passaggio decisivo nella formalizzazione dell'algebra.",
            order: 1,
          },
          {
            sectionKey: "themes",
            heading: "Temi principali",
            content:
              "Presenta metodi operativi per classificare e risolvere equazioni in modo coerente.",
            order: 2,
          },
          {
            sectionKey: "impact",
            heading: "Impatto",
            content:
              "I suoi modelli di calcolo hanno influenzato a lungo la tradizione matematica successiva.",
            order: 3,
          },
        ],
      },
      ar: {
        locale: "ar",
        slug: "al-jabr-wal-muqabala",
        title: "Al-Jabr wa al-Muqabala",
        summary:
          "Risala asasiyya sa'adat fi ta'sis al-manhaj al-jabri fi al-riyadiyyat.",
        excerpt:
          "Nass marja'i fi tarikh al-riyadiyyat wa fi ta'lim hall al-masa'il.",
        seo: {
          seoTitle: "Al-Jabr wa al-Muqabala | Amal",
          seoDescription:
            "Mulakhkhas an risalat al-khwarizmi wa athariha fi tatawwur al-jabr.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Muqaddima",
            content: "Hadhihi al-risala min asasiyyat tarikh al-jabr.",
            order: 1,
          },
          {
            sectionKey: "themes",
            heading: "Mawduat",
            content:
              "Tatadamman tariqa munazzama li tasnif al-muadalat wa halliha.",
            order: 2,
          },
          {
            sectionKey: "impact",
            heading: "Athar",
            content:
              "Aththarat fi al-kitabat al-riyadiyya fi marahil muta'akhkhira.",
            order: 3,
          },
        ],
      },
    },
  },
  {
    id: "work-sirah-ibn-hisham",
    entityType: "work",
    canonicalSlug: "sirah-ibn-hisham",
    status: "published",
    importanceScore: 85,
    createdAt: "2026-04-12",
    updatedAt: "2026-04-12",
    titlePrimary: "Sirah Ibn Hisham",
    workType: "book",
    compositionYear: 833,
    languageOriginal: "Arabic",
    contributors: [],
    localizations: {
      en: {
        locale: "en",
        slug: "sirah-ibn-hisham",
        title: "Sirah Ibn Hisham",
        summary:
          "A major early biography of Prophet Muhammad compiled from earlier narrative traditions.",
        excerpt:
          "One of the most cited narrative sources for the life of Prophet Muhammad in later scholarship.",
        seo: {
          seoTitle: "Sirah Ibn Hisham | Work",
          seoDescription:
            "Short overview of Sirah Ibn Hisham and its importance in Islamic historiography.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Introduction",
            content:
              "This work preserves and arranges early material on the life of Prophet Muhammad.",
            order: 1,
          },
          {
            sectionKey: "transmission",
            heading: "Transmission",
            content:
              "It circulated widely and became a core reference in later historical and devotional writing.",
            order: 2,
          },
        ],
      },
      it: {
        locale: "it",
        slug: "sirah-ibn-hisham",
        title: "Sira di Ibn Hisham",
        summary:
          "Importante biografia antica del Profeta Muhammad basata su tradizioni precedenti.",
        excerpt:
          "Testo molto citato nella storiografia islamica per la ricostruzione della vita del Profeta.",
        seo: {
          seoTitle: "Sira di Ibn Hisham | Opera",
          seoDescription:
            "Panoramica sintetica della Sira di Ibn Hisham e del suo ruolo storiografico.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Introduzione",
            content:
              "L'opera raccoglie e ordina tradizioni narrative sulla vita del Profeta Muhammad.",
            order: 1,
          },
          {
            sectionKey: "transmission",
            heading: "Trasmissione",
            content:
              "La sua diffusione ne ha fatto una fonte centrale per autori e studiosi successivi.",
            order: 2,
          },
        ],
      },
      ar: {
        locale: "ar",
        slug: "sirah-ibn-hisham",
        title: "Sirat Ibn Hisham",
        summary:
          "Min ahamm masadir al-sira al-nabawiyya fi al-turath al-islami al-mubakkir.",
        excerpt:
          "Nass marja'i yasta'inu bihi al-bahithun fi dirasat hayat al-nabi Muhammad.",
        seo: {
          seoTitle: "Sirat Ibn Hisham | Amal",
          seoDescription:
            "Mulakhkhas an Sirat Ibn Hisham wa makanatiha fi al-kitabat al-tarikhiyya.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "Muqaddima",
            content:
              "Al-kitab yajma riwayat mubakkira an hayah al-nabi Muhammad.",
            order: 1,
          },
          {
            sectionKey: "transmission",
            heading: "Intiqal",
            content:
              "Antashara al-kitab wa asbaha marja muhiman fi al-sira wa al-tarikh.",
            order: 2,
          },
        ],
      },
    },
  },
];
