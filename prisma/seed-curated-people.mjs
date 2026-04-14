import { PrismaClient } from "@prisma/client";

/**
 * Curated people seed (EN + AR only)
 *
 * This script populates a first DB-driven set of person entities for public use.
 * Italian is intentionally not touched because it is temporarily disabled in public UI.
 */

const prisma = new PrismaClient();

/** @typedef {"en"|"ar"} PublicLocale */

/**
 * @typedef PersonSeed
 * @property {string} slug
 * @property {{ en: { title: string; excerpt: string; body: string }, ar: { title: string; excerpt: string; body: string } }} localizations
 * @property {number | null} birthYear
 * @property {number | null} deathYear
 * @property {import("@prisma/client").PersonRole[]} roles
 * @property {string[]} domains
 * @property {string[]} associatedPlaces
 * @property {string | null} eraLabel
 * @property {string[]} nameVariants
 */

/** @type {const} */
const PUBLIC_LOCALES = ["en", "ar"];

/**
 * Temporary recovery map for Arabic localized content.
 * Some previous source text was corrupted, so we keep Arabic copy
 * in one reusable map to guarantee valid UTF-8 inserts on every reseed.
 *
 * @type {Record<string, { title: string; excerpt: string; body: string }>}
 */
const AR_LOCALIZATIONS = {
  "muhammad": {
    title: "محمد",
    excerpt: "محمد هو نبي الإسلام والشخصية المركزية في بدايات التاريخ الإسلامي.",
    body: "عاش محمد في القرنين السادس والسابع، وقاد أول مجتمع مسلم في الجزيرة العربية. وقد شكّلت سيرته وتعاليمه أساس الحضارة الإسلامية.",
  },
  "abu-bakr": {
    title: "أبو بكر",
    excerpt: "أبو بكر هو أول الخلفاء بعد محمد ومن أبرز قادة المجتمع الإسلامي المبكر.",
    body: "تولّى أبو بكر القيادة في مرحلة انتقالية حساسة بعد وفاة النبي. وأسهمت سياسته في تثبيت الدولة الإسلامية الناشئة.",
  },
  "umar-ibn-al-khattab": {
    title: "عمر بن الخطاب",
    excerpt: "عمر بن الخطاب هو الخليفة الثاني وأحد أهم رجال الدولة في صدر الإسلام.",
    body: "اشتهر عمر بإصلاحات إدارية واسعة وتوسّع الدولة الإسلامية. وترتبط به نظم وممارسات استمر أثرها في الفترات اللاحقة.",
  },
  "uthman-ibn-affan": {
    title: "عثمان بن عفان",
    excerpt: "عثمان بن عفان هو الخليفة الثالث وشخصية محورية في التاريخ الإسلامي المبكر.",
    body: "شهد عهده استمرار توسّع الدولة الإسلامية. ويُذكر غالبًا في سياق جمع المصحف وتوحيد القراءة.",
  },
  "ali-ibn-abi-talib": {
    title: "علي بن أبي طالب",
    excerpt: "علي بن أبي طالب هو الخليفة الرابع وشخصية أساسية في الفكر والتاريخ الإسلامي.",
    body: "يحمل تراث علي أهمية كبيرة في الجوانب السياسية والفقهية والكلامية. وتمثل مرحلته جزءًا مهمًا من نقاشات التاريخ الإسلامي المبكر.",
  },
  "al-khwarizmi": {
    title: "الخوارزمي",
    excerpt: "الخوارزمي عالم بارز في الرياضيات والفلك في بغداد العباسية.",
    body: "يرتبط اسمه ببدايات علم الجبر وبالنشاط العلمي في بيت الحكمة. وقد أثرت أعماله في تقاليد رياضية لاحقة داخل العالم الإسلامي وخارجه.",
  },
  "ibn-sina": {
    title: "ابن سينا",
    excerpt: "ابن سينا طبيب وفيلسوف كبير، عُرف في اللاتينية باسم أفيسينا.",
    body: "ألّف كتبًا مؤثرة في الطب والفلسفة، ومن أشهرها القانون في الطب. وظلت مؤلفاته مرجعًا مهمًا لقرون طويلة.",
  },
  "al-razi": {
    title: "الرازي",
    excerpt: "الرازي طبيب وعالم اشتهر بالملاحظة السريرية الدقيقة.",
    body: "قدّم أعمالًا مهمة في الطب والكيمياء والفكر العلمي. ويُعد من أبرز الأسماء في تاريخ الطب في الحضارة الإسلامية.",
  },
  "al-farabi": {
    title: "الفارابي",
    excerpt: "الفارابي فيلسوف ساهم في تطوير الفلسفة المنطقية والسياسية.",
    body: "كتب الفارابي في المنطق والفلسفة السياسية ونظرية المعرفة. وشكّلت أعماله جسرًا مهمًا بين التراث اليوناني والفكر الإسلامي.",
  },
  "ibn-rushd": {
    title: "ابن رشد",
    excerpt: "ابن رشد فيلسوف وفقيه من الأندلس عُرف في اللاتينية باسم أفيروس.",
    body: "اشتهر بشروحه على أرسطو وبمحاولته التوفيق بين العقل والنص. وكان لأعماله أثر واسع في الفكر الإسلامي والأوروبي الوسيط.",
  },
  "al-ghazali": {
    title: "الغزالي",
    excerpt: "الغزالي عالم بارز في الفقه والكلام والتصوف.",
    body: "تناول الغزالي أسئلة المعرفة واليقين وأخلاق السلوك الديني. وتُعد كتبه من أكثر المؤلفات تأثيرًا في التراث الإسلامي.",
  },
  "ibn-al-haytham": {
    title: "ابن الهيثم",
    excerpt: "ابن الهيثم عالم في البصريات والرياضيات ومن رواد المنهج التجريبي.",
    body: "يُعرف بكتابه المناظر الذي قدّم فيه تفسيرًا علميًا للرؤية والضوء. وتمثل أعماله مرحلة متقدمة في تاريخ العلوم الطبيعية.",
  },
  "hunayn-ibn-ishaq": {
    title: "حنين بن إسحاق",
    excerpt: "حنين بن إسحاق مترجم وطبيب لعب دورًا كبيرًا في حركة الترجمة.",
    body: "ساهم في نقل نصوص الطب والفلسفة إلى العربية بلغة دقيقة. وكان عمله أساسًا مهمًا لتطور المعرفة العلمية في العصر العباسي.",
  },
  "thabit-ibn-qurra": {
    title: "ثابت بن قرة",
    excerpt: "ثابت بن قرة عالم في الرياضيات والفلك والميكانيكا.",
    body: "قدم مساهمات مهمة في نظرية الأعداد والهندسة والفلك. واشتهر أيضًا بدوره في ترجمة النصوص العلمية وتطويرها.",
  },
  "al-idrisi": {
    title: "الإدريسي",
    excerpt: "الإدريسي جغرافي اشتهر بإعداد خرائط دقيقة للعالم المعروف في عصره.",
    body: "جمع معلومات من الرحالة والتجار وصاغها في أعمال جغرافية مفصلة. وتعد خرائطه من أهم منجزات الجغرافيا في العصور الوسطى.",
  },
  "al-biruni": {
    title: "البيروني",
    excerpt: "البيروني عالم موسوعي كتب في الفلك والرياضيات والجغرافيا.",
    body: "اتسمت أبحاثه بالدقة والمقارنة بين الثقافات والمعارف. وتبقى أعماله مصدرًا أساسيًا لدراسة تاريخ العلوم.",
  },
  "ibn-battuta": {
    title: "ابن بطوطة",
    excerpt: "ابن بطوطة رحالة مغربي قام برحلات واسعة عبر العالم الإسلامي وخارجه.",
    body: "دوّن مشاهداته في نص رحلي غني بالمعلومات الاجتماعية والثقافية. وتمنح كتاباته صورة قيّمة عن العالم في القرن الرابع عشر.",
  },
  "harun-al-rashid": {
    title: "هارون الرشيد",
    excerpt: "هارون الرشيد خليفة عباسي ارتبط عصره بازدهار سياسي وثقافي.",
    body: "شهدت بغداد في عهده نشاطًا علميًا وأدبيًا واسعًا. ويرتبط اسمه في الذاكرة التاريخية ببروز الدولة العباسية في أوج قوتها.",
  },
  "al-mamun": {
    title: "المأمون",
    excerpt: "المأمون خليفة عباسي معروف بدعمه للعلم والترجمة.",
    body: "ارتبط عهده بتوسّع النشاط العلمي في بيت الحكمة وبترسيخ مؤسسات المعرفة. وكان له أثر مهم في تاريخ العلوم في الحضارة الإسلامية.",
  },
  "salah-al-din": {
    title: "صلاح الدين",
    excerpt: "صلاح الدين قائد سياسي وعسكري ومؤسس الدولة الأيوبية.",
    body: "اشتهر بتوحيد مناطق واسعة من المشرق وبحضوره في سياق الحروب الصليبية. وتظهر سيرته في مصادر تاريخية وأدبية متعددة.",
  },
  "al-jazari": {
    title: "الجزري",
    excerpt: "الجزري مهندس ومخترع عُرف بتصميم الأجهزة الميكانيكية.",
    body: "وصف في كتابه الساعات المائية والآلات الذاتية الحركة وأدوات هندسية عملية. ويُعد عمله مرجعًا مهمًا في تاريخ التكنولوجيا.",
  },
  "ibn-khaldun": {
    title: "ابن خلدون",
    excerpt: "ابن خلدون مؤرخ ومفكر اشتهر بتحليل العمران والدولة.",
    body: "قدمت مقدمته تصورًا واسعًا لآليات التغير الاجتماعي والسياسي. وما زالت أفكاره حاضرة في النقاشات التاريخية والاجتماعية.",
  },
  "al-tusi": {
    title: "الطوسي",
    excerpt: "الطوسي عالم موسوعي نشط في الفلك والرياضيات والفلسفة.",
    body: "أسهم في تطوير النماذج الفلكية وبناء مؤسسات علمية مثل مرصد مراغة. وكان لعمله أثر واضح في تطور العلم لاحقًا.",
  },
  "ibn-zuhr": {
    title: "ابن زهر",
    excerpt: "ابن زهر طبيب أندلسي اشتهر بكتاباته الطبية العملية.",
    body: "ركز على التشخيص والعلاج القائمين على الخبرة السريرية. وتعد مساهماته جزءًا مهمًا من تاريخ الطب في الأندلس.",
  },
  "al-kindi": {
    title: "الكندي",
    excerpt: "الكندي فيلسوف وعالم من أوائل المفكرين الكبار باللغة العربية.",
    body: "كتب في الفلسفة والرياضيات والموسيقى والعلوم الطبيعية. وأسهم في بناء مفردات فلسفية عربية مبكرة ذات أثر طويل.",
  },
};

/** @type {PersonSeed[]} */
const curatedPeople = [
  {
    slug: "muhammad",
    localizations: {
      en: {
        title: "Muhammad",
        excerpt:
          "Muhammad is the Prophet of Islam and the central figure in early Islamic history.",
        body:
          "Muhammad lived in the 6th and 7th centuries and led the first Muslim community in Arabia. His life and teachings shaped the foundation of Islamic civilization.",
      },
      ar: AR_LOCALIZATIONS["muhammad"],
    },
    birthYear: 570,
    deathYear: 632,
    roles: ["prophet"],
    domains: ["religion", "community leadership"],
    associatedPlaces: ["Mecca", "Medina"],
    eraLabel: "Early Islamic period",
    nameVariants: ["Muhammad ibn Abd Allah"],
  },
  {
    slug: "abu-bakr",
    localizations: {
      en: {
        title: "Abu Bakr",
        excerpt:
          "Abu Bakr was the first caliph after Muhammad and an early leader of the Muslim community.",
        body:
          "Abu Bakr led the community during a critical transition after the Prophet's death. His leadership helped stabilize the early Islamic state.",
      },
      ar: AR_LOCALIZATIONS["abu-bakr"],
    },
    birthYear: 573,
    deathYear: 634,
    roles: ["ruler"],
    domains: ["governance", "early caliphate"],
    associatedPlaces: ["Mecca", "Medina"],
    eraLabel: "Rashidun period",
    nameVariants: ["Abu Bakr al-Siddiq"],
  },
  {
    slug: "umar-ibn-al-khattab",
    localizations: {
      en: {
        title: "Umar ibn al-Khattab",
        excerpt:
          "Umar ibn al-Khattab was the second caliph and an important statesman of the early caliphate.",
        body:
          "Umar is known for major administrative reforms and expansion of the Islamic state. Many later institutions are linked to his period of rule.",
      },
      ar: AR_LOCALIZATIONS["umar-ibn-al-khattab"],
    },
    birthYear: 584,
    deathYear: 644,
    roles: ["ruler"],
    domains: ["governance", "law"],
    associatedPlaces: ["Medina"],
    eraLabel: "Rashidun period",
    nameVariants: ["Umar al-Faruq"],
  },
  {
    slug: "uthman-ibn-affan",
    localizations: {
      en: {
        title: "Uthman ibn Affan",
        excerpt:
          "Uthman ibn Affan was the third caliph and a major figure in early Islamic history.",
        body:
          "Uthman ruled during a period of continued growth of the caliphate. He is often associated with the standardization of the Qur'anic text.",
      },
      ar: AR_LOCALIZATIONS["uthman-ibn-affan"],
    },
    birthYear: 576,
    deathYear: 656,
    roles: ["ruler"],
    domains: ["governance", "religious history"],
    associatedPlaces: ["Medina"],
    eraLabel: "Rashidun period",
    nameVariants: [],
  },
  {
    slug: "ali-ibn-abi-talib",
    localizations: {
      en: {
        title: "Ali ibn Abi Talib",
        excerpt:
          "Ali ibn Abi Talib was the fourth caliph and a central figure in Islamic thought and history.",
        body:
          "Ali's life is important in political, legal, and theological traditions. His period reflects major debates in early Muslim history.",
      },
      ar: AR_LOCALIZATIONS["ali-ibn-abi-talib"],
    },
    birthYear: 601,
    deathYear: 661,
    roles: ["ruler", "scholar"],
    domains: ["governance", "law", "theology"],
    associatedPlaces: ["Medina", "Kufa"],
    eraLabel: "Rashidun period",
    nameVariants: [],
  },
  {
    slug: "al-khwarizmi",
    localizations: {
      en: {
        title: "Al-Khwarizmi",
        excerpt:
          "Al-Khwarizmi was a scholar of mathematics and astronomy in Abbasid Baghdad.",
        body:
          "He is closely associated with early algebra and with scientific work in the House of Wisdom. His writings influenced later mathematical traditions.",
      },
      ar: AR_LOCALIZATIONS["al-khwarizmi"],
    },
    birthYear: 780,
    deathYear: 850,
    roles: ["scholar", "mathematician", "astronomer"],
    domains: ["mathematics", "astronomy"],
    associatedPlaces: ["Baghdad"],
    eraLabel: "Abbasid period",
    nameVariants: ["Muhammad ibn Musa al-Khwarizmi"],
  },
  {
    slug: "ibn-sina",
    localizations: {
      en: {
        title: "Ibn Sina",
        excerpt:
          "Ibn Sina was a physician and philosopher known in Latin as Avicenna.",
        body:
          "He wrote major works in medicine and philosophy, including the Canon of Medicine. His scholarship was studied for centuries across different regions.",
      },
      ar: AR_LOCALIZATIONS["ibn-sina"],
    },
    birthYear: 980,
    deathYear: 1037,
    roles: ["physician", "philosopher", "scholar"],
    domains: ["medicine", "philosophy"],
    associatedPlaces: ["Bukhara", "Isfahan"],
    eraLabel: "Islamic East",
    nameVariants: ["Avicenna"],
  },
  {
    slug: "al-razi",
    localizations: {
      en: {
        title: "Al-Razi",
        excerpt:
          "Al-Razi was a physician and scholar known for careful clinical observation.",
        body:
          "He wrote influential medical works and emphasized practical experience in treatment. His approach became important in later medical writing.",
      },
      ar: AR_LOCALIZATIONS["al-razi"],
    },
    birthYear: 865,
    deathYear: 925,
    roles: ["physician", "scholar", "philosopher"],
    domains: ["medicine", "clinical practice"],
    associatedPlaces: ["Rayy", "Baghdad"],
    eraLabel: "Abbasid period",
    nameVariants: ["Rhazes"],
  },
  {
    slug: "al-farabi",
    localizations: {
      en: {
        title: "Al-Farabi",
        excerpt:
          "Al-Farabi was a philosopher and scholar of logic and political thought.",
        body:
          "He is known for synthesizing Greek philosophy in Arabic intellectual contexts. His writings shaped discussions in later Islamic philosophy.",
      },
      ar: AR_LOCALIZATIONS["al-farabi"],
    },
    birthYear: 872,
    deathYear: 950,
    roles: ["philosopher", "scholar"],
    domains: ["philosophy", "logic"],
    associatedPlaces: ["Baghdad", "Damascus"],
    eraLabel: "Islamic philosophy",
    nameVariants: ["Alpharabius"],
  },
  {
    slug: "ibn-rushd",
    localizations: {
      en: {
        title: "Ibn Rushd",
        excerpt:
          "Ibn Rushd was a philosopher, jurist, and physician from al-Andalus.",
        body:
          "He is known for philosophical commentaries and legal scholarship. His works became influential in both Islamic and Latin intellectual traditions.",
      },
      ar: AR_LOCALIZATIONS["ibn-rushd"],
    },
    birthYear: 1126,
    deathYear: 1198,
    roles: ["philosopher", "jurist", "physician", "scholar"],
    domains: ["philosophy", "law", "medicine"],
    associatedPlaces: ["Cordoba", "Marrakesh"],
    eraLabel: "al-Andalus",
    nameVariants: ["Averroes"],
  },
  {
    slug: "al-ghazali",
    localizations: {
      en: {
        title: "Al-Ghazali",
        excerpt:
          "Al-Ghazali was a theologian, jurist, and scholar in the Seljuk period.",
        body:
          "His writings discuss ethics, law, theology, and spirituality. He remains a central author in many Islamic educational traditions.",
      },
      ar: AR_LOCALIZATIONS["al-ghazali"],
    },
    birthYear: 1058,
    deathYear: 1111,
    roles: ["theologian", "jurist", "scholar"],
    domains: ["theology", "law", "ethics"],
    associatedPlaces: ["Tus", "Nishapur", "Baghdad"],
    eraLabel: "Seljuk period",
    nameVariants: [],
  },
  {
    slug: "ibn-al-haytham",
    localizations: {
      en: {
        title: "Ibn al-Haytham",
        excerpt:
          "Ibn al-Haytham was a mathematician and scholar known for optics.",
        body:
          "He studied light and vision through careful analysis and experimentation. His work is often cited in the history of scientific method.",
      },
      ar: AR_LOCALIZATIONS["ibn-al-haytham"],
    },
    birthYear: 965,
    deathYear: 1040,
    roles: ["mathematician", "scholar"],
    domains: ["optics", "mathematics"],
    associatedPlaces: ["Basra", "Cairo"],
    eraLabel: "Fatimid period",
    nameVariants: ["Alhazen"],
  },
  {
    slug: "hunayn-ibn-ishaq",
    localizations: {
      en: {
        title: "Hunayn ibn Ishaq",
        excerpt:
          "Hunayn ibn Ishaq was a translator and physician active in Abbasid Baghdad.",
        body:
          "He played a major role in translating Greek scientific and medical texts into Arabic. His work supported the growth of learned institutions.",
      },
      ar: AR_LOCALIZATIONS["hunayn-ibn-ishaq"],
    },
    birthYear: 809,
    deathYear: 873,
    roles: ["translator", "physician", "scholar"],
    domains: ["translation", "medicine"],
    associatedPlaces: ["Baghdad"],
    eraLabel: "Translation movement",
    nameVariants: ["Johannitius"],
  },
  {
    slug: "thabit-ibn-qurra",
    localizations: {
      en: {
        title: "Thabit ibn Qurra",
        excerpt:
          "Thabit ibn Qurra was a mathematician and astronomer linked to the Abbasid translation movement.",
        body:
          "He contributed to mathematics, astronomy, and translation activity in Baghdad. His work connected earlier sources with new research.",
      },
      ar: AR_LOCALIZATIONS["thabit-ibn-qurra"],
    },
    birthYear: 826,
    deathYear: 901,
    roles: ["mathematician", "astronomer", "translator", "scholar"],
    domains: ["mathematics", "astronomy", "translation"],
    associatedPlaces: ["Baghdad"],
    eraLabel: "Abbasid period",
    nameVariants: [],
  },
  {
    slug: "al-idrisi",
    localizations: {
      en: {
        title: "Al-Idrisi",
        excerpt:
          "Al-Idrisi was a geographer and scholar known for cartographic works.",
        body:
          "Working in the 12th century, he compiled geographic knowledge into major maps and texts. His work reflects broad connections across regions.",
      },
      ar: AR_LOCALIZATIONS["al-idrisi"],
    },
    birthYear: 1100,
    deathYear: 1165,
    roles: ["scholar"],
    domains: ["geography", "cartography"],
    associatedPlaces: ["Palermo"],
    eraLabel: "Mediterranean scholarly exchange",
    nameVariants: [],
  },
  {
    slug: "al-biruni",
    localizations: {
      en: {
        title: "Al-Biruni",
        excerpt:
          "Al-Biruni was a polymath known for work in astronomy, mathematics, and comparative study.",
        body:
          "He wrote on astronomy, chronology, and cultures with careful documentation. His method is valued for precision and breadth.",
      },
      ar: AR_LOCALIZATIONS["al-biruni"],
    },
    birthYear: 973,
    deathYear: 1048,
    roles: ["scholar", "astronomer", "mathematician"],
    domains: ["astronomy", "mathematics", "history of cultures"],
    associatedPlaces: ["Khwarazm", "Ghazni"],
    eraLabel: "Islamic East",
    nameVariants: [],
  },
  {
    slug: "ibn-battuta",
    localizations: {
      en: {
        title: "Ibn Battuta",
        excerpt:
          "Ibn Battuta was a traveler and author whose journeys covered much of the Afro-Eurasian world.",
        body:
          "His travel account provides valuable historical observations on cities, courts, and everyday life. It is a major source for medieval interconnected worlds.",
      },
      ar: AR_LOCALIZATIONS["ibn-battuta"],
    },
    birthYear: 1304,
    deathYear: 1368,
    roles: ["scholar"],
    domains: ["travel literature", "historical observation"],
    associatedPlaces: ["Tangier"],
    eraLabel: "Late medieval period",
    nameVariants: [],
  },
  {
    slug: "harun-al-rashid",
    localizations: {
      en: {
        title: "Harun al-Rashid",
        excerpt:
          "Harun al-Rashid was an Abbasid caliph associated with a period of political and cultural strength.",
        body:
          "His reign is often connected with the growth of Baghdad as a major imperial and intellectual center. Sources present his court as influential in regional politics.",
      },
      ar: AR_LOCALIZATIONS["harun-al-rashid"],
    },
    birthYear: 763,
    deathYear: 809,
    roles: ["ruler", "patron"],
    domains: ["statecraft", "court culture"],
    associatedPlaces: ["Baghdad"],
    eraLabel: "Abbasid period",
    nameVariants: [],
  },
  {
    slug: "al-mamun",
    localizations: {
      en: {
        title: "Al-Ma'mun",
        excerpt:
          "Al-Ma'mun was an Abbasid caliph known for patronage of scholarship.",
        body:
          "His period is linked to major translation and scientific activities in Baghdad. He is often associated with the institutional memory of Bayt al-Hikma.",
      },
      ar: AR_LOCALIZATIONS["al-mamun"],
    },
    birthYear: 786,
    deathYear: 833,
    roles: ["ruler", "patron"],
    domains: ["statecraft", "patronage"],
    associatedPlaces: ["Baghdad"],
    eraLabel: "Abbasid period",
    nameVariants: ["Al-Ma'mun ibn Harun"],
  },
  {
    slug: "salah-al-din",
    localizations: {
      en: {
        title: "Salah al-Din",
        excerpt:
          "Salah al-Din was a ruler and military leader who founded the Ayyubid dynasty.",
        body:
          "He is known for unifying parts of the region and for his role during the Crusader period. His legacy appears in both historical and literary traditions.",
      },
      ar: AR_LOCALIZATIONS["salah-al-din"],
    },
    birthYear: 1137,
    deathYear: 1193,
    roles: ["ruler"],
    domains: ["statecraft", "military history"],
    associatedPlaces: ["Cairo", "Damascus", "Jerusalem"],
    eraLabel: "Ayyubid period",
    nameVariants: ["Saladin"],
  },
  {
    slug: "al-jazari",
    localizations: {
      en: {
        title: "Al-Jazari",
        excerpt:
          "Al-Jazari was an inventor and scholar known for mechanical devices.",
        body:
          "His book describes water clocks, automata, and engineering tools in clear practical detail. It is an important source in the history of technology.",
      },
      ar: AR_LOCALIZATIONS["al-jazari"],
    },
    birthYear: 1136,
    deathYear: 1206,
    roles: ["scholar"],
    domains: ["mechanics", "engineering history"],
    associatedPlaces: ["Diyarbakir"],
    eraLabel: "Artuqid period",
    nameVariants: ["Badi al-Zaman al-Jazari"],
  },
  {
    slug: "ibn-khaldun",
    localizations: {
      en: {
        title: "Ibn Khaldun",
        excerpt:
          "Ibn Khaldun was a historian and scholar known for analysis of society and state formation.",
        body:
          "His Muqaddimah presents a broad theory of social and political change. It remains influential in historical and social thought.",
      },
      ar: AR_LOCALIZATIONS["ibn-khaldun"],
    },
    birthYear: 1332,
    deathYear: 1406,
    roles: ["scholar", "jurist"],
    domains: ["history", "social thought"],
    associatedPlaces: ["Tunis", "Cairo"],
    eraLabel: "Late medieval Maghrib and Mamluk period",
    nameVariants: [],
  },
  {
    slug: "al-tusi",
    localizations: {
      en: {
        title: "Al-Tusi",
        excerpt:
          "Al-Tusi was a polymath active in astronomy, mathematics, and philosophy.",
        body:
          "He contributed to astronomy and built scholarly institutions such as observatory-centered projects. His work influenced later scientific developments.",
      },
      ar: AR_LOCALIZATIONS["al-tusi"],
    },
    birthYear: 1201,
    deathYear: 1274,
    roles: ["scholar", "astronomer", "mathematician", "philosopher"],
    domains: ["astronomy", "mathematics", "philosophy"],
    associatedPlaces: ["Tus", "Maragha"],
    eraLabel: "Ilkhanid period",
    nameVariants: ["Nasir al-Din al-Tusi"],
  },
  {
    slug: "ibn-zuhr",
    localizations: {
      en: {
        title: "Ibn Zuhr",
        excerpt:
          "Ibn Zuhr was an Andalusi physician known for practical medical writing.",
        body:
          "He focused on diagnosis and treatment based on clinical experience. His contributions are important in the history of medicine in al-Andalus.",
      },
      ar: AR_LOCALIZATIONS["ibn-zuhr"],
    },
    birthYear: 1094,
    deathYear: 1162,
    roles: ["physician", "scholar"],
    domains: ["medicine", "clinical practice"],
    associatedPlaces: ["Seville"],
    eraLabel: "al-Andalus",
    nameVariants: ["Avenzoar"],
  },
  {
    slug: "al-kindi",
    localizations: {
      en: {
        title: "Al-Kindi",
        excerpt:
          "Al-Kindi was a philosopher and scholar among the earliest major Arabic thinkers.",
        body:
          "He wrote on philosophy, mathematics, music, and natural sciences. His work helped shape early Arabic philosophical vocabulary.",
      },
      ar: AR_LOCALIZATIONS["al-kindi"],
    },
    birthYear: 801,
    deathYear: 873,
    roles: ["philosopher", "scholar", "mathematician"],
    domains: ["philosophy", "mathematics"],
    associatedPlaces: ["Baghdad"],
    eraLabel: "Abbasid period",
    nameVariants: [],
  },
];

/**
 * Ensures one person entity with EN/AR localizations and profile.
 * This function is idempotent and safe to rerun.
 *
 * @param {import("@prisma/client").PrismaClient | import("@prisma/client").Prisma.TransactionClient} tx
 * @param {PersonSeed} person
 */
async function upsertCuratedPerson(tx, person) {
  const entity = await tx.contentEntity.upsert({
    where: { canonicalSlug: person.slug },
    update: {
      entityType: "person",
      status: "published",
      importanceScore: 80,
    },
    create: {
      canonicalSlug: person.slug,
      entityType: "person",
      status: "published",
      importanceScore: 80,
    },
  });

  for (const locale of /** @type {PublicLocale[]} */ (PUBLIC_LOCALES)) {
    const localization =
      locale === "ar" ? AR_LOCALIZATIONS[person.slug] : person.localizations.en;

    if (!localization) {
      throw new Error(`Missing ${locale} localization for slug "${person.slug}".`);
    }

    const loc = await tx.contentEntityLocalization.upsert({
      where: { entityId_locale: { entityId: entity.id, locale } },
      update: {
        slug: person.slug,
        title: localization.title,
        summary: localization.excerpt,
        excerpt: localization.excerpt,
        seoTitle: `${localization.title} | Person`,
        seoDescription: localization.excerpt,
      },
      create: {
        entityId: entity.id,
        locale,
        slug: person.slug,
        title: localization.title,
        summary: localization.excerpt,
        excerpt: localization.excerpt,
        seoTitle: `${localization.title} | Person`,
        seoDescription: localization.excerpt,
      },
    });

    // Replace EN/AR sections for deterministic re-runs.
    await tx.contentSection.deleteMany({ where: { localizationId: loc.id } });
    await tx.contentSection.create({
      data: {
        localizationId: loc.id,
        sectionKey: "intro",
        heading: locale === "ar" ? "مقدمة" : "Introduction",
        content: localization.body,
        sortOrder: 1,
      },
    });
  }

  await tx.personProfile.upsert({
    where: { entityId: entity.id },
    update: {
      namePrimary: person.localizations.en.title,
      nameVariants: person.nameVariants,
      birthYear: person.birthYear,
      deathYear: person.deathYear,
      roles: person.roles,
      domains: person.domains,
      associatedPlaces: person.associatedPlaces,
      eraLabel: person.eraLabel,
      gender: null,
    },
    create: {
      entityId: entity.id,
      namePrimary: person.localizations.en.title,
      nameVariants: person.nameVariants,
      birthYear: person.birthYear,
      deathYear: person.deathYear,
      roles: person.roles,
      domains: person.domains,
      associatedPlaces: person.associatedPlaces,
      eraLabel: person.eraLabel,
      gender: null,
    },
  });
}

async function main() {
  // Note: We intentionally avoid one long interactive transaction here.
  // Supabase poolers (transaction mode) can invalidate interactive transactions (P2028).
  // Idempotent upserts keep this safe to rerun without a global transaction wrapper.
  for (const person of curatedPeople) {
    await upsertCuratedPerson(prisma, person);
  }

  console.log(`Curated people seed completed: ${curatedPeople.length} person entities (EN/AR only).`);
}

main()
  .catch((error) => {
    console.error("Curated people seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
