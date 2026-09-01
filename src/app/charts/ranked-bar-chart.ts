import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { fmt } from './chart-frame';
import { SlicerComponent, SlicerOption } from './slicer';
import { QUARTERS, QuarterFilter, sliceMargin } from '../data/chart-data';

const OPTIONS: SlicerOption[] = QUARTERS.map((k) => ({
  key: k,
  labelKey: k === 'all' ? 'sales.quarter.all' : `sales.quarter.q${Number(k) + 1}`,
}));

/**
 * Margin per article, ranked. Changing the quarter recalculates and re-sorts —
 * HTML bars rather than SVG, because a ranked list is a list, and this way it
 * is readable, selectable and keyboard-navigable for free.
 */
@Component({
  selector: 'app-ranked-bar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlicerComponent, TranslatePipe],
  template: `
    <app-slicer
      [options]="options"
      [selected]="quarter()"
      groupLabel="sales.filterLabel"
      (pick)="quarter.set($any($event))" />

    <div class="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-6 gap-y-3 mb-4" aria-live="polite">
      <div>
        <div class="text-[10px] sm:text-[11px] uppercase tracking-[0.11em] text-dim">{{ 'sales.kpi.total' | translate }}</div>
        <div class="text-[19px] sm:text-[23px] font-semibold tnum leading-tight">
          {{ total() }} {{ 'sales.unit' | translate }}
        </div>
      </div>
      <div>
        <div class="text-[10px] sm:text-[11px] uppercase tracking-[0.11em] text-dim">{{ 'sales.kpi.top' | translate }}</div>
        <div class="text-[19px] sm:text-[23px] font-semibold leading-tight">{{ topName() | translate }}</div>
      </div>
      <div>
        <div class="text-[10px] sm:text-[11px] uppercase tracking-[0.11em] text-dim">{{ 'sales.kpi.share' | translate }}</div>
        <div class="text-[19px] sm:text-[23px] font-semibold tnum leading-tight">{{ topShare() }}%</div>
      </div>
    </div>

    <ul class="grid gap-[7px] list-none p-0 m-0" [attr.aria-label]="'sales.alt' | translate">
      @for (row of rows(); track row.key) {
        <li class="grid items-center gap-2 sm:gap-3 text-[12.5px] sm:text-[13px]
                   grid-cols-[104px_1fr_42px] sm:grid-cols-[130px_1fr_62px]">
          <span class="truncate opacity-85">{{ 'sales.article.' + row.key | translate }}</span>
          <span class="block h-[14px] sm:h-[15px] rounded-[2px] bg-line overflow-hidden">
            <span class="block h-full rounded-[2px] bg-accent transition-[width] duration-300"
                  [style.width.%]="row.pct" [style.opacity]="row.rank < 3 ? 1 : 0.55"></span>
          </span>
          <span class="text-right tnum opacity-75">{{ row.label }}</span>
        </li>
      }
    </ul>
  `,
})
export class RankedBarChartComponent {
  readonly options = OPTIONS;
  readonly quarter = signal<QuarterFilter>('all');

  private readonly data = computed(() => sliceMargin(this.quarter()));

  readonly total = computed(() => fmt(this.data().reduce((a, r) => a + r.value, 0)));

  readonly topName = computed(() => `sales.article.${this.data()[0].key}`);

  readonly topShare = computed(() => {
    const d = this.data();
    const sum = d.reduce((a, r) => a + r.value, 0);
    return Math.round(((d[0].value + d[1].value + d[2].value) / sum) * 100);
  });

  readonly rows = computed(() => {
    const d = this.data();
    const max = d[0].value;
    return d.map((r, rank) => ({
      key: r.key,
      rank,
      pct: (r.value / max) * 100,
      label: fmt(r.value),
    }));
  });
}
