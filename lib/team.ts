import type { Locale } from './content';

/**
 * TEAM / CREDIBILITY DATA
 *
 * ⚠️ PLACEHOLDER CONTENT — names, credentials, years and tags must be confirmed
 * with the client before publishing. The structure is final; only the values change.
 *
 * `name`  → leave '' and the card headline falls back to the role (no fake names shown).
 * `photo` → '/team/<slug>.jpg'. Square crop, min 900×900, neutral/plant background,
 *           subject looking at camera. Leave '' for the branded placeholder portrait.
 * `linkedin` → currently '#' as a PLACEHOLDER so the button can be previewed on the
 *              cards; swap in each engineer's real profile URL before publishing,
 *              or delete the field to hide the button for that member.
 *
 * The `/team/*.jpg` files currently wired in are GENERATED generic silhouette
 * placeholders (gradient + abstract shape, see public/team/README.md) — not
 * stock photos, not real people — so the flip-card layout can be previewed
 * with the photo slot filled before the real photo shoot happens. Swap each
 * path for the real portrait as soon as it's available.
 */

export type LocalizedText = { en: string; fr: string };
export type LocalizedList = { en: string[]; fr: string[] };

export type TeamMember = {
  slug: string;
  name: string;
  photo: string;
  years: string;
  credentials: LocalizedText;
  role: LocalizedText;
  bio: LocalizedText;
  tags: LocalizedList;
  linkedin?: string;
};

export const team: TeamMember[] = [
  {
    slug: 'controls-automation-lead',
    name: '',
    photo: '/team/controls-automation-lead.jpg',
    years: '20+ yrs',
    role: { en: 'Lead — Controls & Automation', fr: 'Responsable — Contrôle et automatisation' },
    credentials: { en: 'P.Eng. · B.Eng. Electrical Engineering', fr: 'ing. · B.Ing. génie électrique' },
    bio: {
      en: 'Two decades on plant floors, from single-machine retrofits to multi-line control migrations executed without stopping production. Owns PLC, HMI and safety architecture at RCL — usually the engineer in the room when a legacy system has to keep running while it is being replaced.',
      fr: "Vingt ans sur des planchers d'usine, du rétrofit d'une machine aux migrations de contrôle multilignes réalisées sans arrêter la production. Responsable de l'architecture PLC, IHM et sécurité chez RCL — souvent l'ingénieur présent quand un système existant doit continuer de tourner pendant son remplacement.",
    },
    tags: {
      en: ['PLC', 'SCADA', 'Functional safety', 'Live migrations'],
      fr: ['PLC', 'SCADA', 'Sécurité fonctionnelle', 'Migrations en production'],
    },
    linkedin: '#',
  },
  {
    slug: 'iiot-data-lead',
    name: '',
    photo: '/team/iiot-data-lead.jpg',
    years: '15+ yrs',
    role: { en: 'Lead — IIoT & Industrial Data', fr: 'Responsable — IIoT et données industrielles' },
    credentials: { en: 'P.Eng. · M.Sc. Systems Engineering', fr: 'ing. · M.Sc. génie des systèmes' },
    bio: {
      en: 'Builds the layer that makes a plant legible: OPC UA, historians, edge gateways and the data models behind them. Has connected equipment from four decades of vintages into one operational picture — and decides which data is worth collecting before anyone buys a dashboard.',
      fr: "Construit la couche qui rend l'usine lisible : OPC UA, historiseurs, passerelles edge et les modèles de données qui les soutiennent. A connecté des équipements de quatre décennies différentes en une seule vue opérationnelle — et détermine quelles données valent la peine d'être collectées avant l'achat d'un tableau de bord.",
    },
    tags: {
      en: ['OPC UA', 'Historians', 'Edge computing', 'System integration'],
      fr: ['OPC UA', 'Historiseurs', 'Informatique en périphérie', 'Intégration de systèmes'],
    },
    linkedin: '#',
  },
  {
    slug: 'industrial-engineering-lead',
    name: '',
    photo: '/team/industrial-engineering-lead.jpg',
    years: '18+ yrs',
    role: { en: 'Lead — Industrial & Process Engineering', fr: 'Responsable — Génie industriel et des procédés' },
    credentials: { en: 'P.Eng. · B.Eng. Industrial Engineering', fr: 'ing. · B.Ing. génie industriel' },
    bio: {
      en: 'Called in when the problem has no obvious owner. Maps process, throughput and constraint before touching technology, so capital goes to the bottleneck that is actually limiting output — not to the equipment that is easiest to replace.',
      fr: "Intervient quand le problème n'a pas de propriétaire évident. Cartographie le procédé, la cadence et la contrainte avant de toucher à la technologie, afin que les investissements aillent au goulot qui limite réellement la production — et non à l'équipement le plus facile à remplacer.",
    },
    tags: {
      en: ['Process mapping', 'Throughput', 'Reliability', 'Root-cause analysis'],
      fr: ['Cartographie de procédé', 'Cadence', 'Fiabilité', 'Analyse des causes'],
    },
    linkedin: '#',
  },
  {
    slug: 'industrial-software-lead',
    name: '',
    photo: '/team/industrial-software-lead.jpg',
    years: '12+ yrs',
    role: { en: 'Lead — Industrial Software', fr: 'Responsable — Logiciels industriels' },
    credentials: { en: 'B.Sc. Computer Engineering · Industrial systems', fr: 'B.Sc. génie informatique · systèmes industriels' },
    bio: {
      en: 'Designs and ships the software between the control layer and the business: MES-adjacent tools, custom operator interfaces and integrations built around how the operation actually runs — not around a vendor roadmap.',
      fr: "Conçoit et livre les logiciels entre la couche de contrôle et l'entreprise : outils de type MES, interfaces opérateur sur mesure et intégrations bâties autour du fonctionnement réel de l'opération — pas autour de la feuille de route d'un fournisseur.",
    },
    tags: {
      en: ['Custom systems', 'Operator UX', 'APIs', 'Industrial integration'],
      fr: ['Systèmes sur mesure', 'UX opérateur', 'API', 'Intégration industrielle'],
    },
    linkedin: '#',
  },
  {
    slug: 'optimization-ai-lead',
    name: '',
    photo: '/team/optimization-ai-lead.jpg',
    years: '10+ yrs',
    role: { en: 'Lead — Optimization, ML & AI', fr: 'Responsable — Optimisation, ML et IA' },
    credentials: { en: 'Ph.D. Process Control · M.Sc. Applied Mathematics', fr: 'Ph.D. contrôle des procédés · M.Sc. mathématiques appliquées' },
    bio: {
      en: 'Turns process data into control decisions: soft sensors, predictive models and advanced control that hold a setpoint better than manual operation can. Every model ships with the engineering context that makes it trustworthy on the floor.',
      fr: "Transforme les données de procédé en décisions de contrôle : capteurs virtuels, modèles prédictifs et contrôle avancé qui maintiennent une consigne mieux qu'une conduite manuelle. Chaque modèle est livré avec le contexte d'ingénierie qui le rend fiable en usine.",
    },
    tags: {
      en: ['Advanced control', 'Soft sensors', 'Predictive models', 'Energy optimization'],
      fr: ['Contrôle avancé', 'Capteurs virtuels', 'Modèles prédictifs', 'Optimisation énergétique'],
    },
    linkedin: '#',
  },
];

export type ResolvedMember = {
  slug: string;
  name: string;
  photo: string;
  years: string;
  role: string;
  credentials: string;
  bio: string;
  tags: string[];
  linkedin?: string;
};

function pick(locale: string) { return locale === 'fr' ? 'fr' : 'en'; }

export function getTeam(locale: string | Locale): ResolvedMember[] {
  const l = pick(locale);
  return team.map(m => ({
    slug: m.slug,
    name: m.name,
    photo: m.photo,
    years: m.years,
    role: m.role[l],
    credentials: m.credentials[l],
    bio: m.bio[l],
    tags: m.tags[l],
    linkedin: m.linkedin,
  }));
}

export function getFeaturedTeam(locale: string | Locale, count = 3): ResolvedMember[] {
  return getTeam(locale).slice(0, count);
}
