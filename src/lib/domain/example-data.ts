/**
 * Example domain dataset
 *
 * Provides a minimal in-memory dataset for the canonical content model and its translations.
 * This gives the project a concrete reference shape that is easy to replace later with Prisma-backed records.
 */
import type { Book, Event, Person } from "@/lib/types/content";
import type { Translation } from "@/lib/types/i18n";

/**
 * Example canonical people records.
 * These values stay language-neutral so translations can evolve independently.
 */
export const examplePeople: Person[] = [
  {
    id: "person-al-khwarizmi",
    slug: "al-khwarizmi",
    birthYear: 780,
    deathYear: 850,
    region: "Baghdad",
    tags: ["mathematics", "astronomy", "algebra"],
    relatedBookIds: ["book-al-jabr"],
    relatedEventIds: ["event-house-of-wisdom"],
  },
  {
    id: "person-hunayn-ibn-ishaq",
    slug: "hunayn-ibn-ishaq",
    birthYear: 809,
    deathYear: 873,
    region: "Baghdad",
    tags: ["translation", "medicine", "scholarship"],
    relatedBookIds: [],
    relatedEventIds: ["event-house-of-wisdom"],
  },
];

/**
 * Example canonical book records.
 * Books reference authors by canonical identifier instead of embedding translated details.
 */
export const exampleBooks: Book[] = [
  {
    id: "book-al-jabr",
    slug: "al-jabr-wa-al-muqabala",
    authorId: "person-al-khwarizmi",
    year: 830,
    category: "mathematics",
  },
];

/**
 * Example canonical event records.
 * Events link to people through identifiers so the model remains easy to persist in a relational database.
 */
export const exampleEvents: Event[] = [
  {
    id: "event-house-of-wisdom",
    slug: "house-of-wisdom",
    year: 830,
    region: "Baghdad",
    relatedPeopleIds: ["person-al-khwarizmi", "person-hunayn-ibn-ishaq"],
  },
];

/**
 * Example translation records.
 * Each translation belongs to one canonical entity and keeps localized presentation fields out of the canonical model.
 */
export const exampleTranslations: Translation[] = [
  {
    entityId: "person-al-khwarizmi",
    entityType: "person",
    locale: "en",
    title: "Al-Khwarizmi",
    description:
      "A foundational scholar whose work helped shape algebra and mathematical reasoning.",
    content:
      "Al-Khwarizmi is one of the most important figures associated with the scientific flourishing of the Abbasid era.",
  },
  {
    entityId: "person-al-khwarizmi",
    entityType: "person",
    locale: "it",
    title: "Al-Khwarizmi",
    description:
      "Studioso fondamentale il cui lavoro ha contribuito a definire l'algebra e il ragionamento matematico.",
    content:
      "Al-Khwarizmi e una delle figure piu importanti legate alla fioritura scientifica dell'epoca abbaside.",
  },
  {
    entityId: "person-al-khwarizmi",
    entityType: "person",
    locale: "ar",
    title: "الخوارزمي",
    description:
      "عالم بارز ساعدت أعماله في تشكيل علم الجبر وأساليب التفكير الرياضي.",
    content:
      "يعد الخوارزمي من أهم الشخصيات المرتبطة بازدهار العلوم في العصر العباسي.",
  },
  {
    entityId: "book-al-jabr",
    entityType: "book",
    locale: "en",
    title: "Al-Jabr wa al-Muqabala",
    description:
      "A landmark mathematical work associated with the early development of algebra.",
    content:
      "This book is often used to illustrate how mathematical problems were organized into a teachable method.",
  },
  {
    entityId: "event-house-of-wisdom",
    entityType: "event",
    locale: "en",
    title: "House of Wisdom",
    description:
      "A scholarly center linked with translation, research, and scientific exchange in Baghdad.",
    content:
      "The House of Wisdom symbolizes the intellectual networks that supported knowledge production during the Islamic Golden Age.",
  },
];
