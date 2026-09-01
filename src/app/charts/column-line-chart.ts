import { Component, ChangeDetectionStrategy, computed, signal, inject, viewChild } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ChartFrameDirective, fmt, MONTHS } from './chart-frame';
import { SlicerComponent, SlicerOption } from './slicer';
import { CARE_FILTERS, CareFilter, sliceCare } from '../data/chart-data';

const OPTIONS: SlicerOption[] = CARE_FILTERS.map((k) => ({ key: k, labelKey: `care.unit.${k}` }));

/**
 * Visits per month as columns, average waiting time as a line on its own scale.
 * Two measures with different units, which is the whole reason for the secondary axis.
 */
@Component({
  selector: 'app-column-line-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlicerComponent, ChartFrameDirective, TranslatePipe],
  template: `
    <app-slicer
      [options]="options"
      [selected]="filter()"
      groupLabel="care.filterLabel"
      (pick)="filter.set($any($event))" />

    <div class="flex flex-wrap gap-x-6 gap-y-3 mb-4" aria-live="polite">
      <div>
        <div class="text-[10px] sm:text-[11px] uppercase tracking-[0.11em] text-dim">{{ 'care.kpi.visits' | translate }}</div>
        <div class="text-[19px] sm:text-[23px] font-semibold tnum leading-tight">{{ totalVisits() }}</div>
      </div>
      <div>
        <div class="text-[10px] sm:text-[11px] uppercase tracking-[0.11em] text-dim">{{ 'care.kpi.wait' | translate }}</div>
        <div class="text-[19px] sm:text-[23px] font-semibold tnum leading-tight">{{ avgWait() }} min</div>
      </div>
      <div>
        <div class="text-[10px] sm:text-[11px] uppercase tracking-[0.11em] text-dim">{{ 'care.kpi.within' | translate }}</div>
        <div class="text-[19px] sm:text-[23px] font-semibold tnum leading-tight">{{ within() }}%</div>
      </div>
    </div>

    <div class="scroller" appChartFrame #frame="chartFrame">
      @let v = view();
      <svg [attr.viewBox]="'0 0 ' + v.w + ' ' + v.h" class="block w-full h-auto overflow-visible" [style.maxWidth.px]="v.w"
           role="img" [attr.aria-label]="'care.alt' | translate">
        @for (y of v.grid; track $index) {
          <line [attr.x1]="8" [attr.y1]="y" [attr.x2]="v.right" [attr.y2]="y" stroke="var(--line)" stroke-width="1" />
        }
        <g>
          @for (bar of v.bars; track bar.i) {
            <rect [attr.x]="bar.x" [attr.y]="bar.y" [attr.width]="bar.w" [attr.height]="bar.h"
                  rx="2" fill="var(--series-1)" fill-opacity="0.82" />
          }
        </g>
        <polyline [attr.points]="v.line" fill="none" stroke="var(--series-2)"
                  stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
        @for (dot of v.dots; track dot.i) {
          <circle [attr.cx]="dot.x" [attr.cy]="dot.y" r="2.6" fill="var(--series-2)" />
        }
        @for (m of v.months; track m.i) {
          <text [attr.x]="m.x" [attr.y]="v.h - 12" text-anchor="middle" font-size="10.5"
                fill="currentColor" fill-opacity="0.55">{{ m.label }}</text>
        }
        <text [attr.x]="v.w - 34" [attr.y]="20" font-size="10" fill="var(--series-2)">min</text>
      </svg>
    </div>

    <div class="flex flex-wrap gap-3 sm:gap-4 text-[11.5px] sm:text-xs mt-3 text-dim">
      <span class="inline-flex items-center gap-1.5">
        <i class="w-2.5 h-2.5 rounded-[2px] bg-[var(--series-1)]"></i>{{ 'care.legend.visits' | translate }}
      </span>
      <span class="inline-flex items-center gap-1.5">
        <i class="w-2.5 h-2.5 rounded-[2px] bg-[var(--series-2)]"></i>{{ 'care.legend.wait' | translate }}
      </span>
    </div>

    <!-- Same numbers, reachable by screen reader and by anyone who wants the values. -->
    <table class="sr-only-table">
      <caption>{{ 'care.alt' | translate }}</caption>
      <thead>
        <tr>
          <th>{{ 'chart.month' | translate }}</th>
          <th>{{ 'care.legend.visits' | translate }}</th>
          <th>{{ 'care.legend.wait' | translate }}</th>
        </tr>
      </thead>
      <tbody>
        @for (row of table(); track row.month) {
          <tr><td>{{ row.month }}</td><td>{{ row.visits }}</td><td>{{ row.wait }}</td></tr>
        }
      </tbody>
    </table>
  `,
})
export class ColumnLineChartComponent {
  private readonly translate = inject(TranslateService);
  private readonly frame = viewChild(ChartFrameDirective);

  readonly options = OPTIONS;
  readonly filter = signal<CareFilter>('all');

  private readonly data = computed(() => sliceCare(this.filter()));

  private readonly monthNames = computed(() => MONTHS[this.translate.currentLang() ?? 'sv'] ?? MONTHS['sv']);

  readonly totalVisits = computed(() => fmt(this.data().visits.reduce((a, b) => a + b, 0)));

  readonly avgWait = computed(() => {
    const d = this.data();
    const total = d.visits.reduce((a, b) => a + b, 0);
    const weighted = d.wait.reduce((acc, w, i) => acc + w * d.visits[i], 0);
    return (weighted / total).toFixed(1);
  });

  readonly within = computed(() => {
    const d = this.data();
    const total = d.visits.reduce((a, b) => a + b, 0);
    const weighted = d.wait.reduce(
      (acc, w, i) => acc + Math.max(0, Math.min(100, 100 - (w - 14) * 2.1)) * d.visits[i], 0);
    return Math.round(weighted / total);
  });

  readonly table = computed(() => {
    const d = this.data();
    const names = this.monthNames();
    return d.visits.map((v, i) => ({ month: names[i], visits: fmt(v), wait: d.wait[i].toFixed(1) }));
  });

  readonly view = computed(() => {
    // Before the view initialises there is nothing to measure; draw at the
    // desktop default and let the ResizeObserver correct it on the next tick.
    const g = this.frame()?.geometry() ?? { w: 640, h: 210, r: 40, narrow: false };
    const d = this.data();
    const names = this.monthNames();

    const L = 8, T = 12, B = 34;
    const iw = g.w - L - g.r;
    const ih = g.h - T - B;
    const maxV = Math.max(...d.visits) * 1.12;
    const maxW = Math.max(...d.wait) * 1.35;
    const band = iw / 12;
    const bw = band * 0.56;

    const grid = [1, 2, 3].map((n) => +(T + ih - (ih * n) / 3).toFixed(1));
    grid.push(T + ih);

    const bars = d.visits.map((v, i) => {
      const h = (v / maxV) * ih;
      return {
        i,
        x: +(L + band * i + (band - bw) / 2).toFixed(1),
        y: +(T + ih - h).toFixed(1),
        w: +bw.toFixed(1),
        h: +Math.max(h, 1).toFixed(1),
      };
    });

    const dots = d.wait.map((w, i) => ({
      i,
      x: +(L + band * i + band / 2).toFixed(1),
      y: +(T + ih - (w / maxW) * ih).toFixed(1),
    }));

    return {
      w: g.w,
      h: g.h,
      right: L + iw,
      grid,
      bars,
      dots,
      line: dots.map((p) => `${p.x},${p.y}`).join(' '),
      months: names
        .map((label, i) => ({ i, label, x: +(L + band * i + band / 2).toFixed(1) }))
        .filter((_, i) => !g.narrow || i % 2 === 0),
    };
  });
}
