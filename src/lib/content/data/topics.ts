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
          "A thematic hub connecting physicians, major texts, and clinical traditions.",
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
              "Medicine here includes theory, diagnostics, therapeutics, and institutional teaching traditions.",
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
          "Tema che collega medici, opere principali e contesti di insegnamento.",
        seo: {
          seoTitle: "Medicina | Tema",
          seoDescription:
            "Esplora persone e opere collegate alla medicina nel periodo islamico classico.",
        },
        sections: [
          {
            sectionKey: "definition",
            heading: "Definizione",
            content:
              "La medicina comprende teoria, pratica clinica e trasmissione del sapere specialistico.",
            order: 1,
          },
        ],
      },
      ar: {
        locale: "ar",
        slug: "medicine",
        title: "Al-Tibb",
        summary: "Mawdu tibb fi al-asr al-dhahabi al-islami.",
        excerpt:
          "Mahwar yarbut al-atibba wa al-kutub al-tibbiyya wa bi'at al-ta'lim.",
        seo: {
          seoTitle: "Al-Tibb | Mawdu",
          seoDescription: "Istikshaf al-a'lam wa al-a'mal al-murtabita bi al-tibb.",
        },
        sections: [
          {
            sectionKey: "definition",
            heading: "Ta'rif",
            content:
              "Yashmal al-tibb al-nazariya wa al-mumarasa wa intiqal al-ma'rifa.",
            order: 1,
          },
        ],
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
        sections: [
          {
            sectionKey: "definition",
            heading: "Definition",
            content:
              "Mathematics includes arithmetic, algebra, geometry, and astronomical calculation.",
            order: 1,
          },
        ],
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
        sections: [
          {
            sectionKey: "definition",
            heading: "Definizione",
            content:
              "Comprende aritmetica, algebra, geometria e applicazioni astronomiche.",
            order: 1,
          },
        ],
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
        sections: [
          {
            sectionKey: "definition",
            heading: "Ta'rif",
            content:
              "Tashmal al-riyadiyyat al-hisab wa al-jabr wa al-handasa wa tatbiqat falakiyya.",
            order: 1,
          },
        ],
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
        sections: [
          {
            sectionKey: "definition",
            heading: "Definition",
            content:
              "Philosophy covers logic, metaphysics, ethics, and natural thought in conversation with inherited traditions.",
            order: 1,
          },
        ],
      },
      it: {
        locale: "it",
        slug: "philosophy",
        title: "Filosofia",
        summary: "Tradizioni e dibattiti filosofici nella storia islamica.",
        excerpt:
          "Tema che collega pensatori, testi e percorsi concettuali della filosofia islamica.",
        seo: {
          seoTitle: "Filosofia | Tema",
          seoDescription:
            "Esplora persone e opere legate alla filosofia nel periodo islamico classico.",
        },
        sections: [
          {
            sectionKey: "definition",
            heading: "Definizione",
            content:
              "Comprende logica, metafisica, etica e riflessione sulla natura in contesti di dialogo intellettuale.",
            order: 1,
          },
        ],
      },
      ar: {
        locale: "ar",
        slug: "philosophy",
        title: "Al-Falsafa",
        summary: "Taqalid wa niqashat falsafiyya fi al-tarikh al-islami.",
        excerpt:
          "Mawdu yarbut al-mufakkirin wa al-nusus wa al-masarat al-fikriyya.",
        seo: {
          seoTitle: "Al-Falsafa | Mawdu",
          seoDescription:
            "Istikshaf al-a'lam wa al-a'mal al-murtabita bi al-falsafa fi al-asr al-dhahabi.",
        },
        sections: [
          {
            sectionKey: "definition",
            heading: "Ta'rif",
            content:
              "Tashmal al-falsafa al-mantiq wa al-ilahiyyat wa al-akhlaq wa bahth al-tabia.",
            order: 1,
          },
        ],
      },
    },
  },
  {
    id: "topic-prophetic-biography",
    entityType: "topic",
    canonicalSlug: "prophetic-biography",
    status: "published",
    importanceScore: 82,
    createdAt: "2026-04-12",
    updatedAt: "2026-04-12",
    labelPrimary: "Prophetic Biography",
    topicType: "discipline",
    localizations: {
      en: {
        locale: "en",
        slug: "prophetic-biography",
        title: "Prophetic Biography",
        summary:
          "Narrative and historical traditions related to the life of Prophet Muhammad.",
        excerpt:
          "A topic that connects key biographical works and early Islamic historical memory.",
        seo: {
          seoTitle: "Prophetic Biography | Topic",
          seoDescription:
            "Explore major works and historical themes related to the life of Prophet Muhammad.",
        },
        sections: [
          {
            sectionKey: "definition",
            heading: "Definition",
            content:
              "This topic groups literary and historical materials about the life, context, and legacy of Prophet Muhammad.",
            order: 1,
          },
        ],
      },
      it: {
        locale: "it",
        slug: "prophetic-biography",
        title: "Biografia Profetica",
        summary:
          "Tradizioni narrative e storiche relative alla vita del Profeta Muhammad.",
        excerpt:
          "Tema che collega opere biografiche principali e memoria storica islamica antica.",
        seo: {
          seoTitle: "Biografia Profetica | Tema",
          seoDescription:
            "Esplora opere e temi storici collegati alla vita del Profeta Muhammad.",
        },
        sections: [
          {
            sectionKey: "definition",
            heading: "Definizione",
            content:
              "Raccoglie testi storici e narrativi dedicati alla vita e all'eredita del Profeta.",
            order: 1,
          },
        ],
      },
      ar: {
        locale: "ar",
        slug: "prophetic-biography",
        title: "Al-Sira al-Nabawiyya",
        summary:
          "Mawdu yakhuss riwayat hayah al-nabi Muhammad fi al-masadir al-mubakkira.",
        excerpt:
          "Yajma al-kutub wa al-mawduat al-murtabita bi sira al-nabi wa al-dhakira al-tarikhiyya.",
        seo: {
          seoTitle: "Al-Sira al-Nabawiyya | Mawdu",
          seoDescription:
            "Istikshaf al-a'mal wa al-mawduat al-raisiya fi dirasat sira al-nabi Muhammad.",
        },
        sections: [
          {
            sectionKey: "definition",
            heading: "Ta'rif",
            content:
              "Yajma hadha al-mawdu al-nusus allati tata'allaq bi hayat al-nabi wa irthihi al-tarikhi.",
            order: 1,
          },
        ],
      },
    },
  },
];
