import { describe, it, expect } from 'vitest';
import { sliceCare, slicePipeline, sliceMargin, CARE_UNITS } from './chart-data';

describe('sliceCare', () => {
  it('sums visits across units when nothing is filtered', () => {
    const all = sliceCare('all');
    const expected =
      CARE_UNITS['norr'].visits[0] + CARE_UNITS['soder'].visits[0] + CARE_UNITS['vast'].visits[0];
    expect(all.visits[0]).toBe(expected);
  });

  it('weights waiting time by visits rather than averaging the averages', () => {
    const all = sliceCare('all');
    const [n, s, v] = ['norr', 'soder', 'vast'].map((k) => CARE_UNITS[k]);
    const naive = (n.wait[0] + s.wait[0] + v.wait[0]) / 3;
    const weighted =
      (n.wait[0] * n.visits[0] + s.wait[0] * s.visits[0] + v.wait[0] * v.visits[0]) /
      (n.visits[0] + s.visits[0] + v.visits[0]);
    expect(all.wait[0]).toBeCloseTo(weighted, 6);
    expect(all.wait[0]).not.toBeCloseTo(naive, 6);
  });

  it('returns a single unit untouched', () => {
    expect(sliceCare('norr').visits).toEqual(CARE_UNITS['norr'].visits);
  });
});

describe('slicePipeline', () => {
  it('always returns 30 days', () => {
    expect(slicePipeline('all')).toHaveLength(30);
    expect(slicePipeline('api')).toHaveLength(30);
  });

  it('is deterministic, so the chart looks the same on every visit', () => {
    expect(slicePipeline('api')).toEqual(slicePipeline('api'));
  });

  it('dips at weekends', () => {
    const s = slicePipeline('all');
    expect(s[5]).toBeLessThan(s[4]); // Saturday below Friday
  });
});

describe('sliceMargin', () => {
  it('sorts descending so the ranked bars need no further work', () => {
    const rows = sliceMargin('all');
    const values = rows.map((r) => r.value);
    expect(values).toEqual([...values].sort((a, b) => b - a));
  });

  it('re-sorts when the quarter changes', () => {
    // The desk fan peaks in Q3 — it should climb the ranking.
    const yearRank = sliceMargin('all').findIndex((r) => r.key === 'fan');
    const q3Rank = sliceMargin('2').findIndex((r) => r.key === 'fan');
    expect(q3Rank).toBeLessThan(yearRank);
  });
});
