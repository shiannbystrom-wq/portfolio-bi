import { Component, ChangeDetectionStrategy, computed, signal, viewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ChartFrameDirective, fmt } from './chart-frame';
import { SlicerComponent, SlicerOption } from './slicer';
import { PIPELINE_SOURCES, PipelineSource, slicePipeline, PIPELINE_FAILED } from '../data/chart-data';

const OPTIONS: SlicerOption[] = PIPELINE_SOURCES.map((k) => ({ key: k, labelKey: `pipe.source.${k}` }));

/**
 * Rows loaded per day over 30 days, as an area with a line on top.
 * The ringed marker is a scheduled run that failed and had to be re-run — the
 * kind of detail that makes a pipeline chart worth showing at all.
 */
@Component({
  selector: 'app-trend-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlicerComponent, ChartFrameDirective, TranslatePipe],
  template: `
    <app-slicer
      [options]="options"
      [selected]="source()"
      groupLabel="pipe.filterLabel"
      (pick)="source.set($any($event))" />

    <div class="flex flex-wrap gap-x-6 gap-y-3 mb-4" aria-live="polite">
      <div>
        <div class="text-[10px] sm:text-[11px] uppercase tracking-[0.11em] text-dim">{{ 'pipe.kpi.total' | translate }}</div>
        <div class="text-[19px] sm:text-[23px] font-semibold tnum leading-tight">{{ total() }}</div>
      </div>
      <div>
        <div class="text-[10px] sm:text-[11px] uppercase tracking-[0.11em] text-dim">{{ 'pipe.kpi.avg' | translate }}</div>
        <div class="text-[19px] sm:text-[23px] font-semibold tnum leading-tight">{{ average() }}</div>
      </div>
      <div>
        <div class="text-[10px] sm:text-[11px] uppercase tracking-[0.11em] text-dim">{{ 'pipe.kpi.ok' | translate }}</div>
        <div class="text-[19px] sm:text-[23px] font-semibold tnum leading-tight">{{ okRate }}%</div>
      </div>
    </div>

    <div class="scroller" appChartFrame #frame="chartFrame">
      @let v = view();
      <svg [attr.viewBox]="'0 0 ' + v.w + ' ' + v.h" class="block w-full h-auto overflow-visible" [style.maxWidth.px]="v.w"
           role="img" [attr.aria-label]="'pipe.alt' | translate">
        @for (y of v.grid; track $index) {
          <line [attr.x1]="8" [attr.y1]="y" [attr.x2]="v.right" [attr.y2]="y" stroke="var(--line)" stroke-width="1" />
        }
        <polygon [attr.points]="v.area" fill="var(--series-1)" fill-opacity="0.13" />
        <polyline [attr.points]="v.line" fill="none" stroke="var(--series-1)"
                  stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
        @for (dot of v.dots; track dot.i) {
          <circle [attr.cx]="dot.x" [attr.cy]="dot.y" r="2.4" fill="var(--series-1)" />
        }
        @for (f of v.failed; track f.i) {
          <circle [attr.cx]="f.x" [attr.cy]="f.y" r="5" fill="none" stroke="var(--series-2)" stroke-width="2" />
        }
        @for (t of v.ticks; track t.i) {
          <text [attr.x]="t.x" [attr.y]="v.h - 12" text-anchor="middle" font-size="10.5"
                fill="currentColor" fill-opacity="0.55">{{ t.label }}</text>
        }
        <text [attr.x]="v.w - 34" [attr.y]="v.baseline" font-size="10"
              fill="currentColor" fill-opacity="0.45">{{ 'pipe.dayUnit' | translate }}</text>
      </svg>
    </div>

    <div class="flex flex-wrap gap-3 sm:gap-4 text-[11.5px] sm:text-xs mt-3 text-dim">
      <span class="inline-flex items-center gap-1.5">
        <i class="w-2.5 h-2.5 rounded-[2px] bg-[var(--series-1)]"></i>{{ 'pipe.legend.rows' | translate }}
      </span>
      <span class="inline-flex items-center gap-1.5">
        <i class="w-2.5 h-2.5 rounded-full border-2 border-[var(--series-2)]"></i>{{ 'pipe.legend.failed' | translate }}
      </span>
    </div>

    <table class="sr-only-table">
      <caption>{{ 'pipe.alt' | translate }}</caption>
      <thead>
        <tr><th>{{ 'pipe.dayUnit' | translate }}</th><th>{{ 'pipe.legend.rows' | translate }}</th></tr>
      </thead>
      <tbody>
        @for (row of table(); track row.day) {
          <tr><td>{{ row.day }}</td><td>{{ row.rows }}</td></tr>
        }
      </tbody>
    </table>
  `,
})
export class TrendChartComponent {
  private readonly frame = viewChild(ChartFrameDirective);

  readonly options = OPTIONS;
  readonly source = signal<PipelineSource>('all');
  readonly okRate = (((30 - PIPELINE_FAILED.length) / 30) * 100).toFixed(1);

  private readonly series = computed(() => slicePipeline(this.source()));

  readonly total = computed(() => fmt(this.series().reduce((a, b) => a + b, 0)));
  readonly average = computed(() => fmt(this.series().reduce((a, b) => a + b, 0) / 30));

  readonly table = computed(() => this.series().map((v, i) => ({ day: i + 1, rows: fmt(v) })));

  readonly view = computed(() => {
    const g = this.frame()?.geometry() ?? { w: 640, h: 210, r: 40, narrow: false };
    const s = this.series();

    const L = 8, T = 12, B = 34;
    const iw = g.w - L - g.r;
    const ih = g.h - T - B;
    const max = Math.max(...s) * 1.15;
    const x = (i: number) => +(L + (iw * i) / 29).toFixed(1);
    const y = (v: number) => +(T + ih - (v / max) * ih).toFixed(1);

    const points = s.map((v, i) => `${x(i)},${y(v)}`);
    const baseline = T + ih;

    const grid = [1, 2, 3].map((n) => +(T + ih - (ih * n) / 3).toFixed(1));
    grid.push(baseline);

    const tickIdx = g.narrow ? [0, 9, 19, 29] : [0, 5, 10, 15, 20, 25, 29];

    return {
      w: g.w,
      h: g.h,
      right: L + iw,
      baseline,
      grid,
      line: points.join(' '),
      area: `${L},${baseline} ${points.join(' ')} ${L + iw},${baseline}`,
      dots: s.map((v, i) => ({ i, x: x(i), y: y(v) })).filter((_, i) => i % 5 === 0 || i === 29),
      failed: PIPELINE_FAILED.map((i) => ({ i, x: x(i), y: y(s[i]) })),
      ticks: tickIdx.map((i) => ({ i, label: String(i + 1), x: x(i) })),
    };
  });
}
