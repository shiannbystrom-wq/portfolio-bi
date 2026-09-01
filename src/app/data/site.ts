/**
 * Everything factual about the site owner in one place.
 * Prose lives in public/i18n/*.json; this file holds the values that are the
 * same in both languages.
 */

export const CONTACT = {
  name: 'Shiann Lew Byström',
  email: 'shiannlew.bystrom@yh.nackademin.se',
  linkedin: 'https://www.linkedin.com/in/shiann-lew-bystrom',
  linkedinHandle: 'shiann-lew-bystrom',
  locality: 'Solna, Stockholm',
} as const;

export interface Kpi {
  labelKey: string;
  value: string;
  unit?: string;
  subKey: string;
  tone: 'accent' | 'cat2' | 'cat3' | 'cat4';
}

export const KPIS: readonly Kpi[] = [
  { labelKey: 'kpi.programme.label', value: '400', unit: 'YH-p', subKey: 'kpi.programme.sub', tone: 'accent' },
  { labelKey: 'kpi.progress.label',  value: '65',  unit: '%',    subKey: 'kpi.progress.sub',  tone: 'cat2' },
  { labelKey: 'kpi.years.label',     value: '10',                subKey: 'kpi.years.sub',     tone: 'cat3' },
  { labelKey: 'kpi.lia.label',       value: 'dec 26 – apr 27',   subKey: 'kpi.lia.sub',       tone: 'cat4' },
];

export interface Project {
  id: string;
  year: string;
  tools: string[];
  /** Screenshot in public/img. Null renders the empty image slot. */
  image: string | null;
}

export const PROJECTS: readonly Project[] = [
  { id: 'star',  year: '2026', tools: ['SQL Server', 'Power Query', 'DAX', 'Power BI'], image: null },
  { id: 'api',   year: '2026', tools: ['Python', 'REST API', 'ETL', 'Power BI'],        image: null },
  { id: 'care',  year: '2025', tools: ['Power BI', 'DAX', 'KPI'],                       image: null },
];

export interface SkillGroup {
  id: string;
  tags: string[];
}

export const SKILL_GROUPS: readonly SkillGroup[] = [
  { id: 'data',      tags: ['SQL', 'T-SQL', 'Datamodellering', 'Stjärnschema', 'Data warehouse', 'ETL'] },
  { id: 'reporting', tags: ['Power BI', 'DAX', 'Power Query', 'Excel'] },
  { id: 'tooling',   tags: ['Python', 'Git', 'REST API', 'PowerPoint'] },
];

export interface SkillRow {
  areaKey: string;
  tools: string;
  /** Share of the widest bar. Reach, not a self-rating — see the caption. */
  depth: number;
}

export const SKILL_ROWS: readonly SkillRow[] = [
  { areaKey: 'skills.row.reporting', tools: 'Power BI, DAX',       depth: 88 },
  { areaKey: 'skills.row.databases', tools: 'SQL, T-SQL',          depth: 80 },
  { areaKey: 'skills.row.modelling', tools: 'Stjärnschema, DW',    depth: 72 },
  { areaKey: 'skills.row.etl',       tools: 'Power Query, Python', depth: 66 },
  { areaKey: 'skills.row.analysis',  tools: 'Statistik, Excel',    depth: 70 },
];

export interface TimelineRow {
  years: string;
  roleKey: string;
  employer: string;
}

export const TIMELINE: readonly TimelineRow[] = [
  { years: '2025–2027', roleKey: 'exp.student',   employer: 'Nackademin' },
  { years: '2024–2025', roleKey: 'exp.assistant',  employer: 'AdeoCare' },
  { years: '2018–2023', roleKey: 'exp.teaching',   employer: 'Vasa International School' },
  { years: '2017–2018', roleKey: 'exp.personal',   employer: 'Bestam Assistans' },
  { years: '2014–2016', roleKey: 'exp.nurse',      employer: 'The Medical City Hospital' },
  { years: '2011–2014', roleKey: 'exp.teacher',    employer: 'SDA Language Center' },
];

export type CourseStatus = 'done' | 'ongoing' | 'planned';

export interface Course {
  name: string;
  contentKey: string;
  status: CourseStatus;
  /** Shown instead of the status word when set (e.g. a start month). */
  statusLabel?: string;
}

export const COURSES: readonly Course[] = [
  { name: 'Databasdesign & modellering',         contentKey: 'edu.c.db',        status: 'done' },
  { name: 'SQL',                                 contentKey: 'edu.c.sql',       status: 'done' },
  { name: 'Datafångst, migrering & förädling',   contentKey: 'edu.c.etl',       status: 'done' },
  { name: 'Verksamhetsstödjande dashboarddesign', contentKey: 'edu.c.dash',     status: 'done' },
  { name: 'Statistisk programmering & ML',       contentKey: 'edu.c.ml',        status: 'ongoing' },
  { name: 'LIA',                                 contentKey: 'edu.c.lia',       status: 'planned', statusLabel: 'dec 2026' },
  { name: 'Examensarbete',                       contentKey: 'edu.c.thesis',    status: 'planned', statusLabel: '2027' },
];
