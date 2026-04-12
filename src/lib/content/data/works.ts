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
        title: "القانون في الطب",
        summary:
          "موسوعة طبية كبرى لابن سينا تجمع بين المعرفة النظرية والخبرة السريرية.",
        excerpt:
          "من أهم الكتب الطبية التي استُخدمت مرجعًا تعليميًا لقرون في مدارس متعددة.",
        seo: {
          seoTitle: "القانون في الطب | عمل",
          seoDescription:
            "نظرة موجزة إلى كتاب القانون في الطب وأثره في تاريخ التعليم الطبي.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "مقدمة",
            content:
              "يُعد القانون في الطب عملاً جامعًا ينظم المعارف الطبية في صورة منهجية واضحة.",
            order: 1,
          },
          {
            sectionKey: "structure",
            heading: "البنية",
            content:
              "قسّم ابن سينا الكتاب إلى أبواب موضوعية تسهّل المراجعة والتدريس والتطبيق العملي.",
            order: 2,
          },
          {
            sectionKey: "impact",
            heading: "الأثر",
            content:
              "أصبح مرجعًا للأطباء والطلاب، وانتقل أثره إلى تقاليد طبية في لغات ومناطق مختلفة.",
            order: 3,
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
        title: "الجبر والمقابلة",
        summary:
          "رسالة تأسيسية أسهمت في ترسيخ المنهج الجبري في الرياضيات.",
        excerpt:
          "نص مرجعي في تاريخ الرياضيات وفي تعليم طرائق حل المسائل والمعادلات.",
        seo: {
          seoTitle: "الجبر والمقابلة | عمل",
          seoDescription:
            "ملخص حول رسالة الخوارزمي وأثرها في تطور علم الجبر.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "مقدمة",
            content: "تُعد هذه الرسالة من النصوص المؤسسة في تاريخ الجبر وتعليمه.",
            order: 1,
          },
          {
            sectionKey: "themes",
            heading: "الموضوعات",
            content:
              "تعرض تصنيفًا منظمًا لأنواع المعادلات مع خطوات عملية لحلها.",
            order: 2,
          },
          {
            sectionKey: "impact",
            heading: "الأثر",
            content:
              "أثرت في الكتابات الرياضية اللاحقة وأسهمت في انتشار لغة جبرية أكثر دقة.",
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
        title: "سيرة ابن هشام",
        summary:
          "من أهم مصادر السيرة النبوية في التراث الإسلامي المبكر.",
        excerpt:
          "مرجع سردي وتاريخي أساسي يعتمد عليه الباحثون في دراسة حياة النبي محمد.",
        seo: {
          seoTitle: "سيرة ابن هشام | عمل",
          seoDescription:
            "عرض موجز لسيرة ابن هشام ومكانتها في الكتابة التاريخية الإسلامية.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "مقدمة",
            content:
              "يجمع الكتاب روايات مبكرة عن حياة النبي محمد ضمن صياغة سردية مؤثرة.",
            order: 1,
          },
          {
            sectionKey: "transmission",
            heading: "الانتقال والرواية",
            content:
              "انتشر النص على نطاق واسع وصار مرجعًا محوريًا في السيرة والكتابات التاريخية اللاحقة.",
            order: 2,
          },
        ],
      },
    },
  },
];
