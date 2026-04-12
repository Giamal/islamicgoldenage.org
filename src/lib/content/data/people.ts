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
        title: "النبي محمد",
        summary:
          "شخصية دينية وتاريخية محورية في نشأة المجتمع الإسلامي الأول.",
        excerpt:
          "أثرت قيادته بين مكة والمدينة بشكل عميق في تشكل المجتمع الإسلامي المبكر ومساره الحضاري.",
        seo: {
          seoTitle: "النبي محمد | شخصية",
          seoDescription:
            "نظرة تعليمية موجزة إلى سيرة النبي محمد وسياقه التاريخي وإرثه.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "مقدمة",
            content:
              "يمثل النبي محمد المرجعية المركزية في التاريخ الإسلامي المبكر وفي تكوين الجماعة الأولى.",
            order: 1,
          },
          {
            sectionKey: "biography",
            heading: "السيرة",
            content:
              "وُلد في مكة ثم هاجر إلى المدينة، وكانت الهجرة نقطة تحول في بناء المجتمع وتنظيمه.",
            order: 2,
          },
          {
            sectionKey: "contributions",
            heading: "الإسهامات",
            content:
              "أرست تعاليمه أسسًا دينية وأخلاقية واجتماعية أثرت في مؤسسات العلم والفقه والحياة العامة.",
            order: 3,
          },
          {
            sectionKey: "legacy",
            heading: "الإرث",
            content:
              "حافظت المدونات التاريخية والأدبية على سيرته بوصفها أساسًا للذاكرة الدينية والثقافية الإسلامية.",
            order: 4,
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
        title: "ابن سينا",
        summary:
          "طبيب وفيلسوف من أبرز علماء العصر الذهبي الإسلامي.",
        excerpt:
          "جمع بين الممارسة الطبية والبحث الفلسفي في مؤلفات أثرت في الفكر العلمي قرونًا طويلة.",
        seo: {
          seoTitle: "ابن سينا | شخصية",
          seoDescription:
            "ملخص تعليمي عن سيرة ابن سينا وأعماله في الطب والفلسفة.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "مقدمة",
            content:
              "يعد ابن سينا من أشهر أعلام الحضارة الإسلامية في الطب والفلسفة.",
            order: 1,
          },
          {
            sectionKey: "biography",
            heading: "السيرة",
            content:
              "نشأ قرب بخارى وتنقل بين مدن ومراكز علمية متعددة، جامعًا بين التعليم والممارسة الطبية.",
            order: 2,
          },
          {
            sectionKey: "contributions",
            heading: "الإسهامات",
            content:
              "أصبح كتابه «القانون في الطب» مرجعًا أساسيًا في التعليم الطبي داخل العالم الإسلامي وخارجه.",
            order: 3,
          },
          {
            sectionKey: "influence",
            heading: "التأثير",
            content:
              "أسهمت مناهجه في المنطق والطب في تشكيل بيئات التدريس والبحث في تقاليد معرفية متعددة.",
            order: 4,
          },
          {
            sectionKey: "legacy",
            heading: "الإرث",
            content:
              "لا يزال حضوره بارزًا في تاريخ العلوم وفي دراسة انتقال المعرفة بين اللغات والحضارات.",
            order: 5,
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
        title: "الخوارزمي",
        summary:
          "عالم في الرياضيات والفلك ومن رواد تأسيس علم الجبر في العصر العباسي.",
        excerpt:
          "أسهمت مؤلفاته في الحساب والجبر في صياغة منهج رياضي واضح أثر في أجيال لاحقة.",
        seo: {
          seoTitle: "الخوارزمي | شخصية",
          seoDescription:
            "ملخص تعليمي عن إسهامات الخوارزمي في الرياضيات والفلك.",
        },
        sections: [
          {
            sectionKey: "introduction",
            heading: "مقدمة",
            content:
              "الخوارزمي من أبرز أعلام الرياضيات في بغداد العباسية.",
            order: 1,
          },
          {
            sectionKey: "biography",
            heading: "السيرة",
            content:
              "عمل في بيئة علمية نشطة ارتبطت بالترجمة والبحث في الفلك والحساب ضمن مؤسسات الدولة.",
            order: 2,
          },
          {
            sectionKey: "contributions",
            heading: "الإسهامات",
            content:
              "قدّم في مؤلفاته طرقًا منهجية لتصنيف المعادلات وحلها، مما عزز تعليم الجبر وتطوره.",
            order: 3,
          },
          {
            sectionKey: "influence",
            heading: "التأثير",
            content:
              "انتقلت مصطلحاته وأساليبه إلى تقاليد علمية مختلفة وأسهمت في تاريخ الرياضيات لاحقًا.",
            order: 4,
          },
          {
            sectionKey: "legacy",
            heading: "الإرث",
            content:
              "يبقى أثره واضحًا في دراسة نشأة الجبر وفي مسارات انتقال المعرفة بين الحضارات.",
            order: 5,
          },
        ],
      },
    },
  },
];
