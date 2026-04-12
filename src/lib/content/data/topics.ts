/**
 * In-memory topic entities used by the content repository.
 */
import type { TopicEntity } from "@/lib/content/types";

export const topics: TopicEntity[] = [
  {
    id: "topic-medicine",
    entityType: "topic",
    canonicalSlug: "medicine",
    status: "published",
    importanceScore: 90,
    createdAt: "2026-04-12",
    updatedAt: "2026-04-12",
    labelPrimary: "Medicine",
    topicType: "discipline",
    localizations: {
      en: {
        locale: "en",
        slug: "medicine",
        title: "Medicine",
        summary: "Medical knowledge and practice in the Islamic Golden Age.",
        excerpt:
          "A thematic hub connecting physicians, core medical works, and institutions.",
        seo: {
          seoTitle: "Medicine | Topic",
          seoDescription:
            "Explore people, works, and milestones connected to medicine.",
        },
        sections: [
          {
            sectionKey: "definition",
            heading: "Definition",
            content:
              "Medicine in this project covers clinical practice, theory, and transmission of medical learning.",
            order: 1,
          },
        ],
      },
      it: {
        locale: "it",
        slug: "medicine",
        title: "Medicina",
        summary: "Saperi e pratiche mediche nell'eta dell'oro islamica.",
        excerpt:
          "Tema che collega medici, opere principali e contesti istituzionali.",
        seo: {
          seoTitle: "Medicina | Tema",
          seoDescription:
            "Esplora persone e opere collegate alla medicina nel periodo islamico classico.",
        },
        sections: [],
      },
      ar: {
        locale: "ar",
        slug: "medicine",
        title: "Al-Tibb",
        summary: "Mawdu tibb fi al-asr al-dhahabi al-islami.",
        excerpt: "Mahwar yajma al-atibba wa al-muallafat al-tibbiyya.",
        seo: {
          seoTitle: "Al-Tibb | Mawdu",
          seoDescription: "Istikshaf al-a'lam wa al-a'mal al-murtabita bi al-tibb.",
        },
        sections: [],
      },
    },
  },
  {
    id: "topic-mathematics",
    entityType: "topic",
    canonicalSlug: "mathematics",
    status: "published",
    importanceScore: 89,
    createdAt: "2026-04-12",
    updatedAt: "2026-04-12",
    labelPrimary: "Mathematics",
    topicType: "discipline",
    localizations: {
      en: {
        locale: "en",
        slug: "mathematics",
        title: "Mathematics",
        summary: "Mathematical developments across the Islamic Golden Age.",
        excerpt:
          "A topic page linking algebraic works, scholars, and methods.",
        seo: {
          seoTitle: "Mathematics | Topic",
          seoDescription:
            "Discover major people and works in Islamic Golden Age mathematics.",
        },
        sections: [],
      },
      it: {
        locale: "it",
        slug: "mathematics",
        title: "Matematica",
        summary: "Sviluppi matematici nel periodo classico islamico.",
        excerpt:
          "Pagina tematica su studiosi, opere e metodi della matematica.",
        seo: {
          seoTitle: "Matematica | Tema",
          seoDescription: "Esplora persone e opere della matematica islamica.",
        },
        sections: [],
      },
      ar: {
        locale: "ar",
        slug: "mathematics",
        title: "Al-Riyadiyyat",
        summary: "Tatawwur al-riyadiyyat fi al-asr al-dhahabi.",
        excerpt: "Safha mawduiyya lil-a'lam wa al-a'mal al-riyadiyya.",
        seo: {
          seoTitle: "Al-Riyadiyyat | Mawdu",
          seoDescription:
            "Ta'arruf ala a'lam al-riyadiyyat wa muallafatihim.",
        },
        sections: [],
      },
    },
  },
  {
    id: "topic-philosophy",
    entityType: "topic",
    canonicalSlug: "philosophy",
    status: "published",
    importanceScore: 84,
    createdAt: "2026-04-12",
    updatedAt: "2026-04-12",
    labelPrimary: "Philosophy",
    topicType: "discipline",
    localizations: {
      en: {
        locale: "en",
        slug: "philosophy",
        title: "Philosophy",
        summary: "Philosophical traditions and debates in Islamic history.",
        excerpt:
          "A discovery layer connecting thinkers, texts, and conceptual lineages.",
        seo: {
          seoTitle: "Philosophy | Topic",
          seoDescription:
            "Explore philosophical people, works, and ideas in the Islamic Golden Age.",
        },
        sections: [],
      },
    },
  },
];
