import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @typedef {"person"|"work"|"topic"|"event"|"place"|"source"} EntityType
 * @typedef {"draft"|"ready_for_review"|"published"|"archived"} Status
 * @typedef {"en"|"it"|"ar"} Locale
 * @typedef {{sectionKey:string; heading:string; content:string; sortOrder?:number}} Section
 * @typedef {{slug:string; title:string; summary:string; excerpt:string; seoTitle:string; seoDescription:string; sections:Section[]}} Loc
 * @typedef {{canonicalSlug:string; entityType:EntityType; status:Status; importanceScore:number; localizations:Record<Locale,Loc>}} SeedEntity
 */

/** @param {number} v @param {string} c */
function assertScore(v, c) {
  if (!Number.isInteger(v) || v < 0 || v > 100) {
    throw new Error(`${c}: importanceScore must be 0..100 integer.`);
  }
}

/** @param {Section[]} sections @param {string} c */
function assertUniqueSectionKeys(sections, c) {
  const keys = sections.map((s) => s.sectionKey);
  if (new Set(keys).size !== keys.length) {
    throw new Error(`${c}: duplicate sectionKey in localization.`);
  }
}

/** @param {SeedEntity} e */
function validateSeedEntity(e) {
  assertScore(e.importanceScore, e.canonicalSlug);
  for (const locale of /** @type {Locale[]} */ (["en", "it", "ar"])) {
    if (!e.localizations[locale]) {
      throw new Error(`${e.canonicalSlug}: missing ${locale} localization.`);
    }
    assertUniqueSectionKeys(e.localizations[locale].sections, `${e.canonicalSlug}/${locale}`);
  }
}

/**
 * @param {import("@prisma/client").Prisma.TransactionClient} tx
 * @param {SeedEntity} e
 */
async function upsertEntityWithLocalizations(tx, e) {
  validateSeedEntity(e);

  const entity = await tx.contentEntity.upsert({
    where: { canonicalSlug: e.canonicalSlug },
    update: {
      entityType: e.entityType,
      status: e.status,
      importanceScore: e.importanceScore,
    },
    create: {
      canonicalSlug: e.canonicalSlug,
      entityType: e.entityType,
      status: e.status,
      importanceScore: e.importanceScore,
    },
  });

  for (const locale of /** @type {Locale[]} */ (["en", "it", "ar"])) {
    const l = e.localizations[locale];
    const loc = await tx.contentEntityLocalization.upsert({
      where: { entityId_locale: { entityId: entity.id, locale } },
      update: {
        slug: l.slug,
        title: l.title,
        summary: l.summary,
        excerpt: l.excerpt,
        seoTitle: l.seoTitle,
        seoDescription: l.seoDescription,
      },
      create: {
        entityId: entity.id,
        locale,
        slug: l.slug,
        title: l.title,
        summary: l.summary,
        excerpt: l.excerpt,
        seoTitle: l.seoTitle,
        seoDescription: l.seoDescription,
      },
    });

    await tx.contentSection.deleteMany({ where: { localizationId: loc.id } });
    await tx.contentSection.createMany({
      data: l.sections.map((s, i) => ({
        localizationId: loc.id,
        sectionKey: s.sectionKey,
        heading: s.heading,
        content: s.content,
        sortOrder: s.sortOrder ?? i + 1,
      })),
    });
  }

  return entity;
}

/** @type {SeedEntity[]} */
const people = [
  {
    canonicalSlug: "al-khwarizmi",
    entityType: "person",
    status: "published",
    importanceScore: 95,
    localizations: {
      en: { slug: "al-khwarizmi", title: "Al-Khwarizmi", summary: "Persian polymath active in Baghdad; foundational for algebra.", excerpt: "A key figure in Abbasid mathematical scholarship.", seoTitle: "Al-Khwarizmi | Person", seoDescription: "Educational profile of Al-Khwarizmi.", sections: [{ sectionKey: "bio", heading: "Biography", content: "Worked in ninth-century Baghdad and contributed to scientific scholarship." }, { sectionKey: "contrib", heading: "Contributions", content: "His algebraic treatise helped systematize equation solving." }] },
      it: { slug: "al-khwarizmi", title: "Al-Khwarizmi", summary: "Polimata persiano attivo a Baghdad, fondamentale per l'algebra.", excerpt: "Figura chiave della matematica in epoca abbaside.", seoTitle: "Al-Khwarizmi | Persona", seoDescription: "Profilo educativo di Al-Khwarizmi.", sections: [{ sectionKey: "bio", heading: "Biografia", content: "Opero nella Baghdad del IX secolo contribuendo alla cultura scientifica." }, { sectionKey: "contrib", heading: "Contributi", content: "Il suo trattato rese piu sistematico lo studio delle equazioni." }] },
      ar: { slug: "الخوارزمي", title: "الخوارزمي", summary: "عالم موسوعي فارسي نشط في بغداد وله دور تأسيسي في الجبر.", excerpt: "شخصية محورية في الرياضيات في العصر العباسي.", seoTitle: "الخوارزمي | شخصية", seoDescription: "صفحة تعليمية عن الخوارزمي.", sections: [{ sectionKey: "bio", heading: "السيرة", content: "عمل في بغداد في القرن التاسع وأسهم في النشاط العلمي العباسي." }, { sectionKey: "contrib", heading: "الإسهامات", content: "أسهم كتابه في تنظيم طرق حل المعادلات." }] },
    },
  },
  {
    canonicalSlug: "ibn-sina",
    entityType: "person",
    status: "published",
    importanceScore: 96,
    localizations: {
      en: { slug: "ibn-sina", title: "Ibn Sina", summary: "Physician and philosopher known as Avicenna in Latin tradition.", excerpt: "Author of the Canon of Medicine.", seoTitle: "Ibn Sina | Person", seoDescription: "Educational profile of Ibn Sina.", sections: [{ sectionKey: "bio", heading: "Biography", content: "Lived between the tenth and eleventh centuries and wrote on medicine and philosophy." }, { sectionKey: "legacy", heading: "Legacy", content: "His medical synthesis influenced learning across regions." }] },
      it: { slug: "ibn-sina", title: "Ibn Sina", summary: "Medico e filosofo noto nella tradizione latina come Avicenna.", excerpt: "Autore del Canone della medicina.", seoTitle: "Ibn Sina | Persona", seoDescription: "Profilo educativo di Ibn Sina.", sections: [{ sectionKey: "bio", heading: "Biografia", content: "Visse tra X e XI secolo con opere fondamentali in medicina e filosofia." }, { sectionKey: "legacy", heading: "Eredita", content: "La sua sintesi medica influenzo a lungo l'insegnamento." }] },
      ar: { slug: "ابن-سينا", title: "ابن سينا", summary: "طبيب وفيلسوف عُرف في التراث اللاتيني باسم أفيسينا.", excerpt: "مؤلف كتاب القانون في الطب.", seoTitle: "ابن سينا | شخصية", seoDescription: "صفحة تعليمية عن ابن سينا.", sections: [{ sectionKey: "bio", heading: "السيرة", content: "عاش بين القرنين العاشر والحادي عشر وكتب في الطب والفلسفة." }, { sectionKey: "legacy", heading: "الأثر", content: "استمر تأثيره في التعليم الطبي عبر مناطق متعددة." }] },
    },
  },
  {
    canonicalSlug: "al-razi",
    entityType: "person",
    status: "published",
    importanceScore: 92,
    localizations: {
      en: { slug: "al-razi", title: "Al-Razi", summary: "Clinician and scholar known for careful medical observation.", excerpt: "Associated with major medical compilations.", seoTitle: "Al-Razi | Person", seoDescription: "Educational profile of Al-Razi.", sections: [{ sectionKey: "bio", heading: "Biography", content: "Worked in major urban centers and wrote practical medical texts." }, { sectionKey: "method", heading: "Method", content: "Emphasized observation and case-based reasoning." }] },
      it: { slug: "al-razi", title: "Al-Razi", summary: "Medico e studioso noto per l'osservazione clinica accurata.", excerpt: "Legato a grandi compilazioni mediche.", seoTitle: "Al-Razi | Persona", seoDescription: "Profilo educativo di Al-Razi.", sections: [{ sectionKey: "bio", heading: "Biografia", content: "Opero in grandi centri urbani e scrisse testi medici pratici." }, { sectionKey: "method", heading: "Metodo", content: "Valorizzo osservazione e analisi dei casi." }] },
      ar: { slug: "الرازي", title: "الرازي", summary: "طبيب وعالم اشتهر بالملاحظة السريرية الدقيقة.", excerpt: "ارتبط بتصانيف طبية موسوعية.", seoTitle: "الرازي | شخصية", seoDescription: "صفحة تعليمية عن الرازي.", sections: [{ sectionKey: "bio", heading: "السيرة", content: "عمل في مراكز حضرية مهمة وكتب مؤلفات طبية عملية." }, { sectionKey: "method", heading: "المنهج", content: "ركز على الملاحظة وتحليل الحالات السريرية." }] },
    },
  },
];

/** @type {SeedEntity[]} */
const works = [
  {
    canonicalSlug: "al-jabr-wal-muqabala",
    entityType: "work",
    status: "published",
    importanceScore: 93,
    localizations: {
      en: { slug: "al-jabr-wal-muqabala", title: "Al-Jabr wa'l-Muqabala", summary: "Foundational mathematical treatise associated with early algebra.", excerpt: "Landmark text for equation methods.", seoTitle: "Al-Jabr wa'l-Muqabala | Work", seoDescription: "Educational overview of Al-Jabr wa'l-Muqabala.", sections: [{ sectionKey: "context", heading: "Context", content: "Composed in Abbasid era for practical and scholarly mathematics." }, { sectionKey: "impact", heading: "Impact", content: "Helped standardize key algebraic procedures." }] },
      it: { slug: "al-jabr-wal-muqabala", title: "Al-Jabr wa'l-Muqabala", summary: "Trattato matematico fondamentale legato all'algebra.", excerpt: "Testo centrale per lo sviluppo dei metodi sulle equazioni.", seoTitle: "Al-Jabr wa'l-Muqabala | Opera", seoDescription: "Panoramica educativa su Al-Jabr wa'l-Muqabala.", sections: [{ sectionKey: "context", heading: "Contesto", content: "Opera composta in epoca abbaside tra esigenze pratiche e teoriche." }, { sectionKey: "impact", heading: "Impatto", content: "Contribui alla sistematizzazione di procedure algebriche." }] },
      ar: { slug: "الجبر-والمقابلة", title: "الجبر والمقابلة", summary: "عمل رياضي تأسيسي ارتبط بتبلور علم الجبر.", excerpt: "نص مرجعي في تطور طرق معالجة المعادلات.", seoTitle: "الجبر والمقابلة | عمل", seoDescription: "عرض تعليمي لكتاب الجبر والمقابلة.", sections: [{ sectionKey: "context", heading: "السياق", content: "أُلّف في العصر العباسي لخدمة مسائل رياضية عملية وعلمية." }, { sectionKey: "impact", heading: "الأثر", content: "أسهم في تثبيت إجراءات أساسية في التفكير الجبري." }] },
    },
  },
  {
    canonicalSlug: "canon-of-medicine",
    entityType: "work",
    status: "published",
    importanceScore: 95,
    localizations: {
      en: { slug: "canon-of-medicine", title: "Canon of Medicine", summary: "Major medical compendium combining theory and practice.", excerpt: "Highly influential in medieval medical learning.", seoTitle: "Canon of Medicine | Work", seoDescription: "Educational overview of Canon of Medicine.", sections: [{ sectionKey: "structure", heading: "Structure", content: "Organized as a systematic compendium of principles and treatments." }, { sectionKey: "reception", heading: "Reception", content: "Circulated broadly across regions and traditions." }] },
      it: { slug: "canone-della-medicina", title: "Canone della medicina", summary: "Grande compendio medico che integra teoria e pratica.", excerpt: "Opera molto influente nella formazione medica medievale.", seoTitle: "Canone della medicina | Opera", seoDescription: "Panoramica educativa del Canone della medicina.", sections: [{ sectionKey: "structure", heading: "Struttura", content: "Compendio sistematico di principi, diagnosi e terapie." }, { sectionKey: "reception", heading: "Ricezione", content: "Circolo ampiamente in aree e tradizioni diverse." }] },
      ar: { slug: "القانون-في-الطب", title: "القانون في الطب", summary: "موسوعة طبية كبرى تجمع بين النظرية والممارسة.", excerpt: "من أكثر الكتب تأثيرا في التعليم الطبي الوسيط.", seoTitle: "القانون في الطب | عمل", seoDescription: "عرض تعليمي لكتاب القانون في الطب.", sections: [{ sectionKey: "structure", heading: "البنية", content: "مرجع منهجي يجمع المبادئ والتشخيص والمعالجة." }, { sectionKey: "reception", heading: "الانتشار", content: "انتشر على نطاق واسع في مؤسسات تعليمية متعددة." }] },
    },
  },
  {
    canonicalSlug: "kitab-al-hawi",
    entityType: "work",
    status: "published",
    importanceScore: 90,
    localizations: {
      en: { slug: "kitab-al-hawi", title: "Kitab al-Hawi", summary: "Large medical compilation grounded in clinical observation.", excerpt: "Major reference associated with Al-Razi.", seoTitle: "Kitab al-Hawi | Work", seoDescription: "Educational overview of Kitab al-Hawi.", sections: [{ sectionKey: "scope", heading: "Scope", content: "Combines earlier authorities with clinical notes." }, { sectionKey: "importance", heading: "Importance", content: "Its breadth made it influential in later scholarship." }] },
      it: { slug: "kitab-al-hawi", title: "Kitab al-Hawi", summary: "Ampia compilazione medica fondata su osservazione clinica.", excerpt: "Importante opera di riferimento associata ad Al-Razi.", seoTitle: "Kitab al-Hawi | Opera", seoDescription: "Panoramica educativa di Kitab al-Hawi.", sections: [{ sectionKey: "scope", heading: "Ampiezza", content: "Integra fonti precedenti con osservazioni cliniche." }, { sectionKey: "importance", heading: "Rilevanza", content: "La sua estensione ne favori l'uso nei secoli successivi." }] },
      ar: { slug: "الحاوي", title: "كتاب الحاوي", summary: "مصنف طبي واسع يقوم على الجمع والملاحظة السريرية.", excerpt: "مرجع طبي كبير مرتبط بالرازي.", seoTitle: "كتاب الحاوي | عمل", seoDescription: "عرض تعليمي لكتاب الحاوي.", sections: [{ sectionKey: "scope", heading: "النطاق", content: "يجمع مواد من مؤلفات سابقة مع ملاحظات سريرية." }, { sectionKey: "importance", heading: "الأهمية", content: "كان مرجعا مهما في التأليف الطبي اللاحق." }] },
    },
  },
];

/** @type {SeedEntity[]} */
const topics = [
  {
    canonicalSlug: "algebra",
    entityType: "topic",
    status: "published",
    importanceScore: 89,
    localizations: {
      en: { slug: "algebra", title: "Algebra", summary: "Mathematical discipline focused on equations and symbolic reasoning.", excerpt: "Connects major scholars and works.", seoTitle: "Algebra | Topic", seoDescription: "Educational topic page for algebra.", sections: [{ sectionKey: "definition", heading: "Definition", content: "Algebra studies unknown quantities and formal solution methods." }] },
      it: { slug: "algebra", title: "Algebra", summary: "Disciplina matematica centrata su equazioni e ragionamento simbolico.", excerpt: "Collega studiosi e opere principali.", seoTitle: "Algebra | Tema", seoDescription: "Pagina tema educativa sull'algebra.", sections: [{ sectionKey: "definition", heading: "Definizione", content: "L'algebra studia incognite e metodi formali di risoluzione." }] },
      ar: { slug: "الجبر", title: "الجبر", summary: "فرع رياضي يركز على المعادلات والاستدلال الرمزي.", excerpt: "يربط بين العلماء والأعمال الأساسية.", seoTitle: "الجبر | موضوع", seoDescription: "صفحة موضوع تعليمية عن الجبر.", sections: [{ sectionKey: "definition", heading: "التعريف", content: "يدرس الجبر المجاهيل والطرائق المنهجية لحل المعادلات." }] },
    },
  },
  {
    canonicalSlug: "medicine",
    entityType: "topic",
    status: "published",
    importanceScore: 91,
    localizations: {
      en: { slug: "medicine", title: "Medicine", summary: "Field combining medical theory, practice, and pharmacology.", excerpt: "Links physicians and influential texts.", seoTitle: "Medicine | Topic", seoDescription: "Educational topic page for medicine.", sections: [{ sectionKey: "context", heading: "Historical Context", content: "Developed through translation, commentary, and clinical practice." }] },
      it: { slug: "medicina", title: "Medicina", summary: "Campo che integra teoria medica, pratica e farmacologia.", excerpt: "Collega medici e testi influenti.", seoTitle: "Medicina | Tema", seoDescription: "Pagina tema educativa sulla medicina.", sections: [{ sectionKey: "context", heading: "Contesto storico", content: "Si sviluppo tramite traduzioni, commenti e pratica clinica." }] },
      ar: { slug: "الطب", title: "الطب", summary: "مجال يجمع النظرية الطبية والممارسة وعلم الأدوية.", excerpt: "يربط الأطباء بالنصوص المؤثرة.", seoTitle: "الطب | موضوع", seoDescription: "صفحة موضوع تعليمية عن الطب.", sections: [{ sectionKey: "context", heading: "السياق التاريخي", content: "تطور عبر الترجمة والشرح والممارسة السريرية." }] },
    },
  },
  {
    canonicalSlug: "astronomy",
    entityType: "topic",
    status: "published",
    importanceScore: 84,
    localizations: {
      en: { slug: "astronomy", title: "Astronomy", summary: "Study of celestial phenomena through observation and calculation.", excerpt: "Connected to mathematics and instruments.", seoTitle: "Astronomy | Topic", seoDescription: "Educational topic page for astronomy.", sections: [{ sectionKey: "definition", heading: "Definition", content: "Combined inherited models with new observation and computation." }] },
      it: { slug: "astronomia", title: "Astronomia", summary: "Studio dei fenomeni celesti tramite osservazione e calcolo.", excerpt: "Connessa a matematica e strumenti scientifici.", seoTitle: "Astronomia | Tema", seoDescription: "Pagina tema educativa sull'astronomia.", sections: [{ sectionKey: "definition", heading: "Definizione", content: "Univa modelli ereditati a nuove osservazioni e calcoli." }] },
      ar: { slug: "علم-الفلك", title: "علم الفلك", summary: "دراسة الظواهر السماوية بالرصد والحساب.", excerpt: "يرتبط بالرياضيات وبالأدوات العلمية.", seoTitle: "علم الفلك | موضوع", seoDescription: "صفحة موضوع تعليمية عن علم الفلك.", sections: [{ sectionKey: "definition", heading: "التعريف", content: "جمع بين النماذج الموروثة والرصد الجديد والحساب." }] },
    },
  },
];

/** @type {SeedEntity[]} */
const sources = [
  {
    canonicalSlug: "source-kennedy-khwarizmi",
    entityType: "source",
    status: "published",
    importanceScore: 68,
    localizations: {
      en: { slug: "source-kennedy-khwarizmi", title: "Reference on Al-Khwarizmi", summary: "Secondary source used for contextual notes on Al-Khwarizmi.", excerpt: "Modern reference used for educational framing.", seoTitle: "Source: Al-Khwarizmi Reference", seoDescription: "Secondary source metadata.", sections: [{ sectionKey: "notes", heading: "Notes", content: "Used for contextual chronology and attribution support." }] },
      it: { slug: "fonte-khwarizmi", title: "Fonte su Al-Khwarizmi", summary: "Fonte secondaria usata per note contestuali su Al-Khwarizmi.", excerpt: "Riferimento moderno per inquadramento didattico.", seoTitle: "Fonte: riferimento su Al-Khwarizmi", seoDescription: "Metadati della fonte secondaria.", sections: [{ sectionKey: "notes", heading: "Note", content: "Usata per supporto a cronologia e attribuzione." }] },
      ar: { slug: "مصدر-الخوارزمي", title: "مرجع عن الخوارزمي", summary: "مصدر ثانوي يُستخدم للملاحظات السياقية عن الخوارزمي.", excerpt: "مرجع حديث للتأطير التعليمي.", seoTitle: "مصدر: مرجع الخوارزمي", seoDescription: "بيانات مصدر ثانوي.", sections: [{ sectionKey: "notes", heading: "ملاحظات", content: "يُستخدم لدعم التأريخ ونسب الأعمال." }] },
    },
  },
  {
    canonicalSlug: "source-gutas-ibnsina",
    entityType: "source",
    status: "published",
    importanceScore: 67,
    localizations: {
      en: { slug: "source-gutas-ibn-sina", title: "Study on Ibn Sina", summary: "Secondary academic source for Ibn Sina context.", excerpt: "Supports educational summaries for Ibn Sina.", seoTitle: "Source: Study on Ibn Sina", seoDescription: "Secondary source metadata.", sections: [{ sectionKey: "notes", heading: "Notes", content: "Used for contextual overview, not critical edition claims." }] },
      it: { slug: "fonte-ibn-sina", title: "Studio su Ibn Sina", summary: "Fonte accademica secondaria per il contesto di Ibn Sina.", excerpt: "Supporta sintesi didattiche su Ibn Sina.", seoTitle: "Fonte: studio su Ibn Sina", seoDescription: "Metadati della fonte secondaria.", sections: [{ sectionKey: "notes", heading: "Note", content: "Usata per panoramica contestuale a livello educativo." }] },
      ar: { slug: "مصدر-ابن-سينا", title: "دراسة عن ابن سينا", summary: "مصدر أكاديمي ثانوي للسياق العام حول ابن سينا.", excerpt: "يدعم الملخصات التعليمية الخاصة بابن سينا.", seoTitle: "مصدر: دراسة عن ابن سينا", seoDescription: "بيانات مصدر ثانوي.", sections: [{ sectionKey: "notes", heading: "ملاحظات", content: "تُستخدم للتأطير العام لا للتحقيق النصي." }] },
    },
  },
];

async function main() {
  await prisma.$transaction(async (tx) => {
    /** @type {Record<string,string>} */
    const ids = {};

    for (const e of [...people, ...works, ...topics, ...sources]) {
      const entity = await upsertEntityWithLocalizations(tx, e);
      ids[e.canonicalSlug] = entity.id;
    }

    // Person profiles
    await tx.personProfile.upsert({
      where: { entityId: ids["al-khwarizmi"] },
      update: { namePrimary: "Muhammad ibn Musa al-Khwarizmi", nameVariants: ["Al-Khwarizmi", "al-Khwarizmi"], birthYear: 780, deathYear: 850, roles: ["scholar", "mathematician", "astronomer"], domains: ["mathematics", "astronomy"], associatedPlaces: [], eraLabel: "Abbasid era", gender: "male" },
      create: { entityId: ids["al-khwarizmi"], namePrimary: "Muhammad ibn Musa al-Khwarizmi", nameVariants: ["Al-Khwarizmi", "al-Khwarizmi"], birthYear: 780, deathYear: 850, roles: ["scholar", "mathematician", "astronomer"], domains: ["mathematics", "astronomy"], associatedPlaces: [], eraLabel: "Abbasid era", gender: "male" },
    });
    await tx.personProfile.upsert({
      where: { entityId: ids["ibn-sina"] },
      update: { namePrimary: "Ibn Sina", nameVariants: ["Ibn Sina", "Avicenna"], birthYear: 980, deathYear: 1037, roles: ["physician", "philosopher", "scholar"], domains: ["medicine", "philosophy"], associatedPlaces: [], eraLabel: "Buyid period", gender: "male" },
      create: { entityId: ids["ibn-sina"], namePrimary: "Ibn Sina", nameVariants: ["Ibn Sina", "Avicenna"], birthYear: 980, deathYear: 1037, roles: ["physician", "philosopher", "scholar"], domains: ["medicine", "philosophy"], associatedPlaces: [], eraLabel: "Buyid period", gender: "male" },
    });
    await tx.personProfile.upsert({
      where: { entityId: ids["al-razi"] },
      update: { namePrimary: "Abu Bakr al-Razi", nameVariants: ["Al-Razi", "Rhazes"], birthYear: 865, deathYear: 925, roles: ["physician", "scholar", "philosopher"], domains: ["medicine", "clinical practice"], associatedPlaces: [], eraLabel: "Late Abbasid period", gender: "male" },
      create: { entityId: ids["al-razi"], namePrimary: "Abu Bakr al-Razi", nameVariants: ["Al-Razi", "Rhazes"], birthYear: 865, deathYear: 925, roles: ["physician", "scholar", "philosopher"], domains: ["medicine", "clinical practice"], associatedPlaces: [], eraLabel: "Late Abbasid period", gender: "male" },
    });

    // Work profiles
    await tx.workProfile.upsert({
      where: { entityId: ids["al-jabr-wal-muqabala"] },
      update: { titlePrimary: "Kitab al-Mukhtasar fi Hisab al-Jabr wa'l-Muqabala", workType: "treatise", compositionYear: 820, languageOriginal: "Arabic", alternateTitles: ["The Compendious Book on Calculation by Completion and Balancing"], incipit: "In the name of God, the Most Merciful, the Most Compassionate.", manuscriptPlaces: [] },
      create: { entityId: ids["al-jabr-wal-muqabala"], titlePrimary: "Kitab al-Mukhtasar fi Hisab al-Jabr wa'l-Muqabala", workType: "treatise", compositionYear: 820, languageOriginal: "Arabic", alternateTitles: ["The Compendious Book on Calculation by Completion and Balancing"], incipit: "In the name of God, the Most Merciful, the Most Compassionate.", manuscriptPlaces: [] },
    });
    await tx.workProfile.upsert({
      where: { entityId: ids["canon-of-medicine"] },
      update: { titlePrimary: "Al-Qanun fi al-Tibb", workType: "book", compositionYear: 1025, languageOriginal: "Arabic", alternateTitles: ["Canon of Medicine"], incipit: null, manuscriptPlaces: [] },
      create: { entityId: ids["canon-of-medicine"], titlePrimary: "Al-Qanun fi al-Tibb", workType: "book", compositionYear: 1025, languageOriginal: "Arabic", alternateTitles: ["Canon of Medicine"], incipit: null, manuscriptPlaces: [] },
    });
    await tx.workProfile.upsert({
      where: { entityId: ids["kitab-al-hawi"] },
      update: { titlePrimary: "Kitab al-Hawi", workType: "book", compositionYear: 900, languageOriginal: "Arabic", alternateTitles: ["Liber Continens"], incipit: null, manuscriptPlaces: [] },
      create: { entityId: ids["kitab-al-hawi"], titlePrimary: "Kitab al-Hawi", workType: "book", compositionYear: 900, languageOriginal: "Arabic", alternateTitles: ["Liber Continens"], incipit: null, manuscriptPlaces: [] },
    });

    // Topic profiles
    await tx.topicProfile.upsert({
      where: { entityId: ids["algebra"] },
      update: { labelPrimary: "Algebra", topicType: "discipline", parentTopicCanonicalSlug: null, synonymLabels: ["al-jabr"], relatedTopicCanonicalSlugs: ["astronomy"] },
      create: { entityId: ids["algebra"], labelPrimary: "Algebra", topicType: "discipline", parentTopicCanonicalSlug: null, synonymLabels: ["al-jabr"], relatedTopicCanonicalSlugs: ["astronomy"] },
    });
    await tx.topicProfile.upsert({
      where: { entityId: ids["medicine"] },
      update: { labelPrimary: "Medicine", topicType: "discipline", parentTopicCanonicalSlug: null, synonymLabels: ["tibb"], relatedTopicCanonicalSlugs: [] },
      create: { entityId: ids["medicine"], labelPrimary: "Medicine", topicType: "discipline", parentTopicCanonicalSlug: null, synonymLabels: ["tibb"], relatedTopicCanonicalSlugs: [] },
    });
    await tx.topicProfile.upsert({
      where: { entityId: ids["astronomy"] },
      update: { labelPrimary: "Astronomy", topicType: "discipline", parentTopicCanonicalSlug: null, synonymLabels: ["ilm al-haya"], relatedTopicCanonicalSlugs: ["algebra"] },
      create: { entityId: ids["astronomy"], labelPrimary: "Astronomy", topicType: "discipline", parentTopicCanonicalSlug: null, synonymLabels: ["ilm al-haya"], relatedTopicCanonicalSlugs: ["algebra"] },
    });

    // Source profiles
    await tx.sourceProfile.upsert({
      where: { entityId: ids["source-kennedy-khwarizmi"] },
      update: { sourceType: "secondary", citationShort: "Kennedy, EI2, Al-Khwarizmi", citationFull: "Kennedy, E. S., 'Al-Khwarizmi', Encyclopaedia of Islam, 2nd ed.", publicationYear: 1970, author: "E. S. Kennedy", publisher: "Brill", isbnOrIdentifier: null, url: null },
      create: { entityId: ids["source-kennedy-khwarizmi"], sourceType: "secondary", citationShort: "Kennedy, EI2, Al-Khwarizmi", citationFull: "Kennedy, E. S., 'Al-Khwarizmi', Encyclopaedia of Islam, 2nd ed.", publicationYear: 1970, author: "E. S. Kennedy", publisher: "Brill", isbnOrIdentifier: null, url: null },
    });
    await tx.sourceProfile.upsert({
      where: { entityId: ids["source-gutas-ibnsina"] },
      update: { sourceType: "secondary", citationShort: "Gutas, Avicenna and the Aristotelian Tradition", citationFull: "Gutas, Dimitri. Avicenna and the Aristotelian Tradition. Brill.", publicationYear: 2014, author: "Dimitri Gutas", publisher: "Brill", isbnOrIdentifier: null, url: null },
      create: { entityId: ids["source-gutas-ibnsina"], sourceType: "secondary", citationShort: "Gutas, Avicenna and the Aristotelian Tradition", citationFull: "Gutas, Dimitri. Avicenna and the Aristotelian Tradition. Brill.", publicationYear: 2014, author: "Dimitri Gutas", publisher: "Brill", isbnOrIdentifier: null, url: null },
    });

    // Work contributors
    await tx.workContributor.upsert({ where: { workEntityId_personEntityId_role: { workEntityId: ids["al-jabr-wal-muqabala"], personEntityId: ids["al-khwarizmi"], role: "author" } }, update: { sortOrder: 1 }, create: { workEntityId: ids["al-jabr-wal-muqabala"], personEntityId: ids["al-khwarizmi"], role: "author", sortOrder: 1 } });
    await tx.workContributor.upsert({ where: { workEntityId_personEntityId_role: { workEntityId: ids["canon-of-medicine"], personEntityId: ids["ibn-sina"], role: "author" } }, update: { sortOrder: 1 }, create: { workEntityId: ids["canon-of-medicine"], personEntityId: ids["ibn-sina"], role: "author", sortOrder: 1 } });
    await tx.workContributor.upsert({ where: { workEntityId_personEntityId_role: { workEntityId: ids["kitab-al-hawi"], personEntityId: ids["al-razi"], role: "author" } }, update: { sortOrder: 1 }, create: { workEntityId: ids["kitab-al-hawi"], personEntityId: ids["al-razi"], role: "author", sortOrder: 1 } });

    const rels = [
      ["al-khwarizmi", "al-jabr-wal-muqabala", "authored", 98, ["source-kennedy-khwarizmi"]],
      ["ibn-sina", "canon-of-medicine", "authored", 98, ["source-gutas-ibnsina"]],
      ["al-razi", "kitab-al-hawi", "authored", 96, []],
      ["al-jabr-wal-muqabala", "algebra", "about", 94, ["source-kennedy-khwarizmi"]],
      ["canon-of-medicine", "medicine", "about", 95, ["source-gutas-ibnsina"]],
      ["kitab-al-hawi", "medicine", "about", 92, []],
      ["al-khwarizmi", "algebra", "associated_with", 93, ["source-kennedy-khwarizmi"]],
      ["al-khwarizmi", "astronomy", "associated_with", 84, []],
      ["ibn-sina", "medicine", "associated_with", 95, ["source-gutas-ibnsina"]],
      ["al-razi", "medicine", "associated_with", 94, []],
      ["al-khwarizmi", "source-kennedy-khwarizmi", "documented_by", 70, ["source-kennedy-khwarizmi"]],
      ["ibn-sina", "source-gutas-ibnsina", "documented_by", 70, ["source-gutas-ibnsina"]],
    ];

    for (const [from, to, relationType, score, sourceSlugs] of rels) {
      assertScore(/** @type {number} */ (score), `${from}->${to}`);
      await tx.contentRelationship.upsert({
        where: {
          fromEntityId_toEntityId_relationType: {
            fromEntityId: ids[/** @type {string} */ (from)],
            toEntityId: ids[/** @type {string} */ (to)],
            relationType: /** @type {import("@prisma/client").RelationType} */ (relationType),
          },
        },
        update: {
          importanceScore: /** @type {number} */ (score),
          sourceEntityIds: /** @type {string[]} */ (sourceSlugs).map((s) => ids[s]),
        },
        create: {
          fromEntityId: ids[/** @type {string} */ (from)],
          toEntityId: ids[/** @type {string} */ (to)],
          relationType: /** @type {import("@prisma/client").RelationType} */ (relationType),
          importanceScore: /** @type {number} */ (score),
          sourceEntityIds: /** @type {string[]} */ (sourceSlugs).map((s) => ids[s]),
        },
      });
    }
  }, { maxWait: 30_000, timeout: 180_000 });

  console.log("Seed completed: 11 entities with en/it/ar localizations and graph relationships.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
