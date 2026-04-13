/**
 * Editorial entity templates
 *
 * Defines minimal, practical writing templates for person/work/topic creation.
 * Templates prefill markdown structure and relationship guidance in admin.
 */
import { locales, type Locale } from "@/i18n/config";
import type { ContentEntityType } from "@prisma/client";

export type EntityTemplateKey = "person" | "work" | "topic";

export type EntityTemplate = {
  key: EntityTemplateKey;
  title: string;
  description: string;
  suggestedRelationships: string[];
  bodyTemplateByLocale: Record<Locale, string>;
};

const personBody: Record<Locale, string> = {
  en: `## Biography

Write a concise narrative of the person's life and timeline.

## Contributions

Describe major scholarly or practical contributions.

## Historical Context

Explain the broader intellectual and social context.

## Related Works

List key works and explain relevance.

## Sources

Add references or source notes.`,
  it: `## Biografia

Scrivi una sintesi della vita e della cronologia della persona.

## Contributi

Descrivi i principali contributi intellettuali o pratici.

## Contesto storico

Spiega il contesto culturale e storico.

## Opere correlate

Indica le opere principali e la loro rilevanza.

## Fonti

Aggiungi riferimenti o note sulle fonti.`,
  ar: `## السيرة

اكتب عرضًا موجزًا لحياة الشخصية وتسلسلها الزمني.

## الإسهامات

اشرح أبرز الإسهامات العلمية أو العملية.

## السياق التاريخي

وضّح الإطار الفكري والاجتماعي الأوسع.

## الأعمال المرتبطة

اذكر الأعمال الأساسية وسبب أهميتها.

## المصادر

أضف المراجع أو ملاحظات المصادر.`,
};

const workBody: Record<Locale, string> = {
  en: `## Overview

Summarize the work and its scope.

## Authorship

Clarify authorship, date, and transmission context.

## Significance

Explain why this work matters historically.

## Related Topics

Link this work to key fields or concepts.

## Sources

Add references or source notes.`,
  it: `## Panoramica

Riassumi l'opera e il suo ambito.

## Autorialita

Chiarisci autore, data e contesto di trasmissione.

## Rilevanza

Spiega l'importanza storica dell'opera.

## Temi correlati

Collega l'opera ai campi o concetti principali.

## Fonti

Aggiungi riferimenti o note sulle fonti.`,
  ar: `## نظرة عامة

لخّص العمل ونطاقه.

## التأليف

وضّح المؤلف والتاريخ وسياق انتقال النص.

## الأهمية

اشرح الأهمية التاريخية لهذا العمل.

## الموضوعات المرتبطة

اربط العمل بالمجالات أو المفاهيم الأساسية.

## المصادر

أضف المراجع أو ملاحظات المصادر.`,
};

const topicBody: Record<Locale, string> = {
  en: `## Definition

Define the topic clearly and in scope.

## Development

Describe how the topic developed over time.

## Key Scholars

Identify major scholars connected to this topic.

## Important Works

List significant works related to this topic.

## Legacy

Explain later influence and long-term impact.`,
  it: `## Definizione

Definisci chiaramente il tema e il suo ambito.

## Sviluppo

Descrivi l'evoluzione del tema nel tempo.

## Studiosi principali

Indica gli studiosi piu rilevanti collegati al tema.

## Opere importanti

Elenca le opere significative collegate al tema.

## Eredita

Spiega influenza successiva e impatto di lungo periodo.`,
  ar: `## التعريف

عرّف الموضوع بشكل واضح وفي نطاق محدد.

## التطور

اشرح كيف تطور الموضوع عبر الزمن.

## العلماء الرئيسيون

حدّد أبرز العلماء المرتبطين بهذا الموضوع.

## الأعمال المهمة

اذكر أهم الأعمال المتعلقة بهذا الموضوع.

## الأثر

اشرح التأثير اللاحق والأثر بعيد المدى.`,
};

const templates: Record<EntityTemplateKey, EntityTemplate> = {
  person: {
    key: "person",
    title: "Person template",
    description: "For biographies and scholar profiles.",
    suggestedRelationships: ["authored", "influenced", "related_to", "about"],
    bodyTemplateByLocale: personBody,
  },
  work: {
    key: "work",
    title: "Work template",
    description: "For books, treatises, and manuscripts.",
    suggestedRelationships: ["authored", "about", "related_to", "documented_by"],
    bodyTemplateByLocale: workBody,
  },
  topic: {
    key: "topic",
    title: "Topic template",
    description: "For disciplines, concepts, and intellectual fields.",
    suggestedRelationships: [
      "related_to",
      "about",
      "associated_with",
      "documented_by",
    ],
    bodyTemplateByLocale: topicBody,
  },
};

export function isEntityTemplateKey(value: string | undefined): value is EntityTemplateKey {
  return value === "person" || value === "work" || value === "topic";
}

export function getEntityTemplate(templateKey: EntityTemplateKey): EntityTemplate {
  return templates[templateKey];
}

export function buildLocalizedTemplateBodies(templateKey: EntityTemplateKey) {
  const template = getEntityTemplate(templateKey);
  return locales.map((locale) => ({
    locale,
    bodyMarkdown: template.bodyTemplateByLocale[locale],
  }));
}

export function mapTemplateKeyToEntityType(
  templateKey: EntityTemplateKey,
): ContentEntityType {
  return templateKey;
}
