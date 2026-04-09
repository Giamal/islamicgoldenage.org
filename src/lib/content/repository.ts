/**
 * Placeholder content repository
 *
 * Mimics the shape of the future database-backed repository with a small in-memory dataset.
 * This lets routing, SEO, and UI evolve now while keeping the swap to Prisma intentionally low-friction later.
 */
import type { Locale } from "@/i18n/config";

export type EntityKind = "ARTICLE" | "PERSON" | "BOOK" | "EVENT" | "CATEGORY";

type EntityTranslationRecord = {
  locale: Locale;
  slug: string;
  title: string;
  excerpt: string;
  bodyParagraphs: string[];
};

type EntityRecord = {
  id: string;
  canonicalSlug: string;
  kind: EntityKind;
  featuredYear?: number;
  updatedAt: string;
  translations: EntityTranslationRecord[];
  relatedEntityIds: string[];
};

export type LocalizedEntitySummary = {
  id: string;
  canonicalSlug: string;
  kind: EntityKind;
  featuredYear?: number;
  updatedAt: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyParagraphs: string[];
};

const placeholderEntities: EntityRecord[] = [
  {
    id: "entity-al-khwarizmi",
    canonicalSlug: "al-khwarizmi",
    kind: "PERSON",
    featuredYear: 820,
    updatedAt: "2026-04-09T12:00:00.000Z",
    relatedEntityIds: ["entity-house-of-wisdom", "entity-book-of-restoration"],
    translations: [
      {
        locale: "en",
        slug: "al-khwarizmi",
        title: "Al-Khwarizmi",
        excerpt:
          "A foundational mathematician whose work on algebra and calculation shaped later scientific traditions.",
        bodyParagraphs: [
          "Muhammad ibn Musa al-Khwarizmi worked in Baghdad during the Abbasid period and became one of the defining scholarly figures of the Islamic Golden Age.",
          "His writings on algebra, arithmetic, and astronomical calculation helped organize knowledge into forms that could be studied, taught, and transmitted widely.",
          "This project treats figures like Al-Khwarizmi as canonical entities so they can be linked cleanly to books, events, and related topics across languages.",
        ],
      },
      {
        locale: "it",
        slug: "al-khwarizmi",
        title: "Al-Khwarizmi",
        excerpt:
          "Matematico fondamentale, il cui lavoro sull'algebra e sul calcolo ha influenzato tradizioni scientifiche successive.",
        bodyParagraphs: [
          "Muhammad ibn Musa al-Khwarizmi opero a Baghdad nel periodo abbaside e divenne una delle figure piu importanti dell'eta dell'oro islamica.",
          "I suoi testi su algebra, aritmetica e calcolo astronomico aiutarono a organizzare il sapere in forme piu facili da studiare e trasmettere.",
          "Questa piattaforma tratta figure come Al-Khwarizmi come entita canoniche, cosi da collegarle con chiarezza a libri, eventi e temi correlati in piu lingue.",
        ],
      },
      {
        locale: "ar",
        slug: "al-khwarizmi",
        title: "الخوارزمي",
        excerpt:
          "عالم رياضيات مؤثر ساهمت أعماله في الجبر والحساب في تشكيل تقاليد علمية لاحقة.",
        bodyParagraphs: [
          "عمل محمد بن موسى الخوارزمي في بغداد في العصر العباسي وكان من أبرز علماء العصر الذهبي الإسلامي.",
          "ساعدت مؤلفاته في الجبر والحساب والفلك على تنظيم المعرفة في صيغ يمكن تعلمها ونقلها بسهولة أكبر.",
          "يعامل هذا المشروع شخصيات مثل الخوارزمي ككيانات مرجعية أساسية يمكن ربطها بالكتب والأحداث والموضوعات عبر اللغات.",
        ],
      },
    ],
  },
  {
    id: "entity-book-of-restoration",
    canonicalSlug: "book-of-restoration-and-balance",
    kind: "BOOK",
    featuredYear: 830,
    updatedAt: "2026-04-09T12:00:00.000Z",
    relatedEntityIds: ["entity-al-khwarizmi"],
    translations: [
      {
        locale: "en",
        slug: "book-of-restoration-and-balance",
        title:
          "The Compendious Book on Calculation by Completion and Balancing",
        excerpt:
          "A landmark algebra text that gave later generations both methods and terminology.",
        bodyParagraphs: [
          "This book is often cited as one of the central texts in the early history of algebra.",
          "It matters not only because of technical procedures, but also because it shows how scholars translated practical problems into teachable mathematical reasoning.",
          "For a reference platform, books like this become anchor nodes that connect people, concepts, and later scientific developments.",
        ],
      },
      {
        locale: "it",
        slug: "libro-del-completamento-e-del-bilanciamento",
        title:
          "Libro compendioso sul calcolo per completamento e bilanciamento",
        excerpt:
          "Testo fondamentale dell'algebra che ha trasmesso metodi e linguaggio alle generazioni successive.",
        bodyParagraphs: [
          "Quest'opera e spesso considerata uno dei testi centrali della storia iniziale dell'algebra.",
          "Il suo valore non riguarda solo le procedure tecniche, ma anche il modo in cui traduce problemi pratici in ragionamento matematico insegnabile.",
          "In una piattaforma di riferimento, libri come questo diventano nodi centrali che collegano persone, concetti e sviluppi successivi.",
        ],
      },
      {
        locale: "ar",
        slug: "الكتاب-المختصر-في-حساب-الجبر-والمقابلة",
        title: "الكتاب المختصر في حساب الجبر والمقابلة",
        excerpt:
          "نص بارز في تاريخ الجبر المبكر نقل المناهج والمصطلحات إلى أجيال لاحقة.",
        bodyParagraphs: [
          "يعد هذا الكتاب من النصوص الأساسية في التاريخ المبكر لعلم الجبر.",
          "تكمن أهميته في جمعه بين الإجراءات الحسابية وصياغة المشكلات العملية في صورة معرفة قابلة للتعليم.",
          "في منصة مرجعية تعليمية يصبح مثل هذا الكتاب نقطة وصل بين العلماء والأفكار والتطورات اللاحقة.",
        ],
      },
    ],
  },
  {
    id: "entity-house-of-wisdom",
    canonicalSlug: "house-of-wisdom",
    kind: "EVENT",
    featuredYear: 830,
    updatedAt: "2026-04-09T12:00:00.000Z",
    relatedEntityIds: ["entity-al-khwarizmi", "entity-baghdad-category"],
    translations: [
      {
        locale: "en",
        slug: "house-of-wisdom",
        title: "Baghdad and the House of Wisdom",
        excerpt:
          "A symbolic hub of translation, study, and scientific exchange in the Abbasid world.",
        bodyParagraphs: [
          "The House of Wisdom represents more than a building; it symbolizes a scholarly ecosystem shaped by translation, patronage, and debate.",
          "Baghdad became a center where knowledge from multiple traditions could be collected, studied, and extended.",
          "The platform's data model is intentionally designed to capture that network effect through explicit links between entities.",
        ],
      },
      {
        locale: "it",
        slug: "baghdad-e-la-casa-della-sapienza",
        title: "Baghdad e la Casa della Sapienza",
        excerpt:
          "Un centro simbolico di traduzione, studio e scambio scientifico nel mondo abbaside.",
        bodyParagraphs: [
          "La Casa della Sapienza rappresenta piu di un edificio: simboleggia un ecosistema di studio fatto di traduzioni, patronato e confronto intellettuale.",
          "Baghdad divenne un centro in cui conoscenze provenienti da tradizioni diverse potevano essere raccolte, studiate e sviluppate.",
          "Il modello dati della piattaforma e progettato apposta per riflettere questo effetto di rete tramite collegamenti espliciti tra entita.",
        ],
      },
      {
        locale: "ar",
        slug: "بيت-الحكمة",
        title: "بغداد وبيت الحكمة",
        excerpt:
          "مركز رمزي للترجمة والدراسة والتبادل العلمي في العالم العباسي.",
        bodyParagraphs: [
          "يمثل بيت الحكمة أكثر من مبنى؛ فهو يرمز إلى بيئة علمية قامت على الترجمة والرعاية والنقاش.",
          "أصبحت بغداد مركزا تلتقي فيه المعارف القادمة من تقاليد متعددة لتجمع وتدرس وتطور.",
          "لهذا صمم نموذج البيانات في المنصة لالتقاط هذا الترابط عبر وصلات صريحة بين الكيانات.",
        ],
      },
    ],
  },
  {
    id: "entity-baghdad-category",
    canonicalSlug: "baghdad",
    kind: "CATEGORY",
    featuredYear: 800,
    updatedAt: "2026-04-09T12:00:00.000Z",
    relatedEntityIds: ["entity-house-of-wisdom"],
    translations: [
      {
        locale: "en",
        slug: "baghdad",
        title: "Baghdad",
        excerpt:
          "A category placeholder showing how places or themes can group future content.",
        bodyParagraphs: [
          "Categories are modeled as entities so they can carry translations, metadata, and links just like people or books.",
          "This keeps the initial schema lean while still supporting rich internal linking and future thematic navigation.",
        ],
      },
      {
        locale: "it",
        slug: "baghdad",
        title: "Baghdad",
        excerpt:
          "Categoria di esempio che mostra come luoghi o temi possano raggruppare contenuti futuri.",
        bodyParagraphs: [
          "Le categorie sono modellate come entita cosi da avere traduzioni, metadati e collegamenti come persone o libri.",
          "Questo mantiene lo schema iniziale snello ma gia adatto a una navigazione tematica piu ricca.",
        ],
      },
      {
        locale: "ar",
        slug: "بغداد",
        title: "بغداد",
        excerpt:
          "تصنيف تجريبي يوضح كيف يمكن للأماكن أو الموضوعات أن تجمع المحتوى مستقبلا.",
        bodyParagraphs: [
          "تمثل التصنيفات كيانات مستقلة حتى تمتلك ترجمات وبيانات وصفية وروابط مثل الأشخاص والكتب.",
          "بهذا يظل المخطط الأولي بسيطا مع الحفاظ على قابلية التوسع للربط والتنظيم الموضوعي.",
        ],
      },
    ],
  },
];

/**
 * Returns every placeholder entity for sitemap and future data replacement boundaries.
 */
export function getAllPlaceholderEntities() {
  return placeholderEntities;
}

/**
 * Maps a canonical entity to a locale-specific view model with English fallback.
 */
function localizeEntity(
  entity: EntityRecord,
  locale: Locale,
): LocalizedEntitySummary {
  const translation =
    entity.translations.find((item) => item.locale === locale) ??
    entity.translations.find((item) => item.locale === "en");

  if (!translation) {
    throw new Error(`Missing translation for entity ${entity.id}.`);
  }

  return {
    id: entity.id,
    canonicalSlug: entity.canonicalSlug,
    kind: entity.kind,
    featuredYear: entity.featuredYear,
    updatedAt: entity.updatedAt,
    slug: translation.slug,
    title: translation.title,
    excerpt: translation.excerpt,
    bodyParagraphs: translation.bodyParagraphs,
  };
}

/**
 * Returns localized summaries for the entity index page.
 */
export function getLocalizedEntities(locale: Locale) {
  return placeholderEntities.map((entity) => localizeEntity(entity, locale));
}

/**
 * Resolves a localized entity by its public route slug.
 */
export function getLocalizedEntityBySlug(locale: Locale, slug: string) {
  const entity = placeholderEntities.find((candidate) =>
    candidate.translations.some(
      (translation) =>
        translation.locale === locale && translation.slug === slug,
    ),
  );

  return entity ? localizeEntity(entity, locale) : null;
}

/**
 * Resolves linked entities for the detail page sidebar.
 */
export function getRelatedLocalizedEntities(locale: Locale, entityId: string) {
  const source = placeholderEntities.find((entity) => entity.id === entityId);

  if (!source) {
    return [];
  }

  return source.relatedEntityIds
    .map((relatedId) =>
      placeholderEntities.find((candidate) => candidate.id === relatedId),
    )
    .filter((entity): entity is EntityRecord => Boolean(entity))
    .map((entity) => localizeEntity(entity, locale));
}
