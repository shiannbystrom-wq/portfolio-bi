/**
 * Sample data for the three example reports.
 *
 * ALL OF THIS IS SIMULATED and the UI says so. Replacing it with real course
 * data means editing the arrays below — no chart code changes.
 */

/* ---------- 1. Care flow: visits and waiting time, by unit ---------- */

export interface CareUnit {
  visits: number[];   // 12 months
  wait: number[];     // minutes, 12 months
}

export const CARE_UNITS: Record<string, CareUnit> = {
  norr:  { visits: [820, 760, 910, 880, 845, 700, 540, 690, 930, 970, 1010, 880],
           wait:   [34, 31, 38, 36, 33, 28, 22, 26, 37, 39, 41, 35] },
  soder: { visits: [640, 600, 705, 690, 660, 580, 430, 545, 720, 760, 790, 700],
           wait:   [27, 25, 30, 29, 27, 24, 19, 22, 29, 31, 33, 28] },
  vast:  { visits: [410, 395, 455, 440, 430, 360, 280, 350, 470, 495, 510, 455],
           wait:   [21, 20, 24, 23, 22, 18, 15, 17, 23, 25, 26, 22] },
};

export const CARE_FILTERS = ['all', 'norr', 'soder', 'vast'] as const;
export type CareFilter = (typeof CARE_FILTERS)[number];

export function sliceCare(filter: CareFilter): CareUnit {
  const keys = filter === 'all' ? ['norr', 'soder', 'vast'] : [filter];
  const visits: number[] = [];
  const wait: number[] = [];
  for (let i = 0; i < 12; i++) {
    let v = 0;
    let weighted = 0;
    for (const k of keys) {
      v += CARE_UNITS[k].visits[i];
      weighted += CARE_UNITS[k].wait[i] * CARE_UNITS[k].visits[i];
    }
    visits.push(v);
    wait.push(v ? weighted / v : 0);
  }
  return { visits, wait };
}

/* ---------- 2. Pipeline: rows loaded per day, by source ---------- */

export const PIPELINE_SOURCES = ['all', 'api', 'xls', 'db'] as const;
export type PipelineSource = (typeof PIPELINE_SOURCES)[number];

/** Deterministic pseudo-random so the chart is identical on every load. */
function makeSeries(): { api: number[]; xls: number[]; db: number[] } {
  let seed = 20260829;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const api: number[] = [];
  const xls: number[] = [];
  const db: number[] = [];
  for (let i = 0; i < 30; i++) {
    const weekend = i % 7 === 5 || i % 7 === 6;
    api.push(Math.round((1150 + rnd() * 260) * (weekend ? 0.45 : 1)));
    xls.push(Math.round((360 + rnd() * 120) * (weekend ? 0.2 : 1)));
    db.push(Math.round((880 + rnd() * 200) * (weekend ? 0.6 : 1)));
  }
  return { api, xls, db };
}

export const PIPELINE = makeSeries();

/** Zero-based day indices where the scheduled run failed and was re-run. */
export const PIPELINE_FAILED = [16];

export function slicePipeline(source: PipelineSource): number[] {
  if (source !== 'all') return PIPELINE[source];
  return PIPELINE.api.map((v, i) => v + PIPELINE.xls[i] + PIPELINE.db[i]);
}

/* ---------- 3. Sales: margin per article, by quarter ---------- */

export interface Article {
  /** Article names are product nouns; translated per language. */
  key: string;
  quarters: [number, number, number, number];
}

export const ARTICLES: readonly Article[] = [
  { key: 'coffee',  quarters: [142, 131, 118, 196] },
  { key: 'phones',  quarters: [118, 124, 109, 171] },
  { key: 'lamp',    quarters: [96, 88, 74, 132] },
  { key: 'bag',     quarters: [81, 102, 116, 94] },
  { key: 'kettle',  quarters: [74, 66, 58, 99] },
  { key: 'thermos', quarters: [63, 52, 41, 88] },
  { key: 'fan',     quarters: [21, 58, 92, 24] },
  { key: 'clock',   quarters: [38, 35, 33, 47] },
];

export const QUARTERS = ['all', '0', '1', '2', '3'] as const;
export type QuarterFilter = (typeof QUARTERS)[number];

export function sliceMargin(q: QuarterFilter): { key: string; value: number }[] {
  return ARTICLES.map((a) => ({
    key: a.key,
    value: q === 'all' ? a.quarters.reduce((x, y) => x + y, 0) : a.quarters[Number(q)],
  })).sort((a, b) => b.value - a.value);
}
