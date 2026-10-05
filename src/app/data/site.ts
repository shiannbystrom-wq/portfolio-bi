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

/**
 * Programme span. Progress is derived from these rather than written down: a
 * hardcoded percentage on a CV page is wrong within a term and nobody notices.
 */
export const PROGRAMME = {
  start: new Date(2025, 7, 15),   // mid-August 2025
  end: new Date(2027, 5, 15),     // graduation, June 2027
} as const;

/** Whole percent of the programme elapsed, clamped to 0–100. */
export function programmeProgress(now: Date = new Date()): number {
  const total = PROGRAMME.end.getTime() - PROGRAMME.start.getTime();
  const done = now.getTime() - PROGRAMME.start.getTime();
  return Math.round(Math.min(1, Math.max(0, done / total)) * 100);
}

/**
 * Last content change. The topbar badge is formatted from this rather than
 * written into both translation files: a "last updated" chip that is three
 * months stale reads worse than no chip at all, and one constant is easy to
 * bump when something on the page actually changes.
 */
export const LAST_UPDATED = new Date(2026, 9, 5);

/** "okt 2026" / "Oct 2026", from the active language. */
export function lastUpdatedLabel(lang: string | null, when: Date = LAST_UPDATED): string {
  // sv-SE abbreviates with a trailing period ("okt. 2026"); dropped, because
  // the chip sits next to other label text where the dot reads as a typo.
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'sv-SE', {
    month: 'short',
    year: 'numeric',
  })
    .format(when)
    .replace('.', '');
}

export interface Kpi {
  labelKey: string;
  value: string;
  unit?: string;
  subKey: string;
  tone: 'accent' | 'cat2' | 'cat3' | 'cat4';
}

export function kpis(now: Date = new Date()): Kpi[] {
  return [
    { labelKey: 'kpi.programme.label', value: '400', unit: 'YH-p', subKey: 'kpi.programme.sub', tone: 'accent' },
    { labelKey: 'kpi.progress.label',  value: String(programmeProgress(now)), unit: '%', subKey: 'kpi.progress.sub', tone: 'cat2' },
    { labelKey: 'kpi.years.label',     value: String(priorWorkingYears()), subKey: 'kpi.years.sub', tone: 'cat3' },
    { labelKey: 'kpi.lia.label',       value: 'dec 26 – apr 27', subKey: 'kpi.lia.sub', tone: 'cat4' },
  ];
}

export interface Project {
  id: string;
  year: string;
  tools: string[];
  /** Screenshot in public/img. Null renders the empty image slot. */
  image: string | null;
}

/**
 * Ordered as an argument rather than by date: the finished report first, then
 * the model underneath it, then the same job done in code. Project 1's "what
 * I'd do differently" leads directly into project 2.
 */
export const PROJECTS: readonly Project[] = [
  {
    id: 'powerbi',
    year: 'sep 2025',
    tools: ['Power BI', 'DAX', 'Power Query', 'SQL'],
    image: '/img/project-powerbi.jpg',
  },
  {
    id: 'warehouse',
    year: 'jan 2026',
    tools: ['SQL Server', 'T-SQL', 'Stjärnschema', 'draw.io'],
    image: '/img/project-warehouse.jpg',
  },
  {
    id: 'pandas',
    year: 'apr 2026',
    tools: ['Python', 'Pandas', 'VS Code', 'Git'],
    image: '/img/project-pandas.jpg',
  },
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
  /** Project id this toolset was actually used in — the evidence for the row. */
  projectId: string;
}

/**
 * Three rows, each pointing at a project on this same site. The previous
 * version carried a "depth" bar, which was a self-rating with invented widths;
 * "which project did you use it in" is the question a reader is actually
 * asking, and it can be checked two clicks away.
 *
 * Tools from the curriculum that no project used (Excel, statistics) stay in
 * SKILL_GROUPS above, where "covered in the coursework" is the honest claim.
 */
export const SKILL_ROWS: readonly SkillRow[] = [
  { areaKey: 'skills.row.reporting', tools: 'Power BI, DAX, Power Query', projectId: 'powerbi' },
  { areaKey: 'skills.row.modelling', tools: 'SQL, T-SQL, stjärnschema',   projectId: 'warehouse' },
  { areaKey: 'skills.row.code',      tools: 'Python, Pandas, Git',        projectId: 'pandas' },
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

/**
 * Years worked before the programme, summed from the timeline above so the KPI
 * tile can never drift from the table it is summarising. Studying does not
 * count, and the 2016–17 gap is not counted either — this adds the roles, it
 * does not measure the span.
 */
export function priorWorkingYears(rows: readonly TimelineRow[] = TIMELINE): number {
  return rows
    .filter((r) => r.roleKey !== 'exp.student')
    .reduce((sum, r) => {
      const [from, to] = r.years.split('–').map(Number);
      return sum + Math.max(0, to - from);
    }, 0);
}

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
