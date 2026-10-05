import { describe, it, expect } from 'vitest';
import {
  PROGRAMME,
  PROJECTS,
  SKILL_ROWS,
  TIMELINE,
  priorWorkingYears,
  programmeProgress,
  kpis,
  lastUpdatedLabel,
} from './site';

describe('programmeProgress', () => {
  it('reads 0 at the start and 100 at graduation', () => {
    expect(programmeProgress(PROGRAMME.start)).toBe(0);
    expect(programmeProgress(PROGRAMME.end)).toBe(100);
  });

  it('clamps outside the programme instead of going negative or past 100', () => {
    expect(programmeProgress(new Date(2020, 0, 1))).toBe(0);
    expect(programmeProgress(new Date(2030, 0, 1))).toBe(100);
  });

  it('is about halfway at the midpoint', () => {
    const mid = new Date((PROGRAMME.start.getTime() + PROGRAMME.end.getTime()) / 2);
    expect(programmeProgress(mid)).toBe(50);
  });
});

describe('priorWorkingYears', () => {
  it('ignores the studies row', () => {
    const withStudies = priorWorkingYears(TIMELINE);
    const withoutStudies = priorWorkingYears(TIMELINE.filter((r) => r.roleKey !== 'exp.student'));
    expect(withStudies).toBe(withoutStudies);
  });

  it('sums the spans of the roles rather than measuring start to end', () => {
    const rows = [
      { years: '2011–2014', roleKey: 'a', employer: 'x' },
      { years: '2017–2018', roleKey: 'b', employer: 'y' },
    ];
    // 3 + 1, not 2018 - 2011.
    expect(priorWorkingYears(rows)).toBe(4);
  });
});

describe('kpis', () => {
  it('never ships a hardcoded progress figure', () => {
    const atStart = kpis(PROGRAMME.start).find((k) => k.labelKey === 'kpi.progress.label');
    const atEnd = kpis(PROGRAMME.end).find((k) => k.labelKey === 'kpi.progress.label');
    expect(atStart?.value).toBe('0');
    expect(atEnd?.value).toBe('100');
  });
});

describe('SKILL_ROWS', () => {
  it('points every row at a project that exists, so the evidence link never 404s', () => {
    const ids = new Set(PROJECTS.map((p) => p.id));
    for (const row of SKILL_ROWS) {
      expect(ids.has(row.projectId), `${row.areaKey} → ${row.projectId}`).toBe(true);
    }
  });
});

describe('lastUpdatedLabel', () => {
  it('abbreviates the month per language without a trailing period', () => {
    const d = new Date(2026, 9, 5);
    expect(lastUpdatedLabel('sv', d)).toBe('okt 2026');
    expect(lastUpdatedLabel('en', d)).toBe('Oct 2026');
  });

  it('falls back to Swedish when the language has not resolved yet', () => {
    expect(lastUpdatedLabel(null, new Date(2026, 9, 5))).toBe('okt 2026');
  });
});
