import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ColumnLineChartComponent } from '../charts/column-line-chart';
import { TrendChartComponent } from '../charts/trend-chart';
import { RankedBarChartComponent } from '../charts/ranked-bar-chart';

interface Slide {
  titleKey: string;
  hintKey: string;
  kindKey: string;
}

const SLIDES: Slide[] = [
  { titleKey: 'slide.care.title',  hintKey: 'slide.care.hint',  kindKey: 'slide.kind.interactive' },
  { titleKey: 'slide.pipe.title',  hintKey: 'slide.pipe.hint',  kindKey: 'slide.kind.interactive' },
  { titleKey: 'slide.sales.title', hintKey: 'slide.sales.hint', kindKey: 'slide.kind.interactive' },
];

/**
 * The example-report carousel.
 *
 * All three slides stay in the DOM: they are the substance of the page, and
 * keeping them mounted means the charts are already measured and the browser
 * has nothing to re-layout when you page through.
 */
@Component({
  selector: 'app-report-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, ColumnLineChartComponent, TrendChartComponent, RankedBarChartComponent],
  template: `
    <section class="bg-card border border-line rounded-[10px] px-4 py-4 sm:px-5 sm:py-[18px]">
      <div class="flex items-center gap-2 sm:gap-2.5 mb-3.5">
        <h2 class="text-[14px] sm:text-[14.5px] font-semibold tracking-[-0.01em] m-0">
          {{ 'slide.heading' | translate }}
        </h2>
        <span class="flex-1"></span>
        <button type="button" class="nav-btn" (click)="step(-1)" [attr.aria-label]="'slide.prev' | translate">‹</button>
        <span class="font-mono text-xs text-dim tnum min-w-[34px] text-center" aria-hidden="true">
          {{ index() + 1 }} / {{ slides.length }}
        </span>
        <button type="button" class="nav-btn" (click)="step(1)" [attr.aria-label]="'slide.next' | translate">›</button>
      </div>

      <div class="overflow-hidden">
        <div class="grid grid-flow-col auto-cols-[100%] transition-transform duration-[380ms] ease-out"
             [style.transform]="'translateX(' + (-100 * index()) + '%)'">
          @for (slide of slides; track slide.titleKey; let i = $index) {
            <div class="min-w-0 pr-px" [attr.aria-hidden]="i !== index() ? 'true' : null"
                 [attr.inert]="i !== index() ? '' : null">
              <h3 class="text-sm font-semibold tracking-[-0.01em] m-0">
                {{ slide.titleKey | translate }}
                <span class="font-cond text-[10.5px] font-semibold tracking-[0.11em] uppercase
                             text-accent-text bg-accent-soft rounded px-[7px] py-[3px] ml-2 align-[2px]">
                  {{ slide.kindKey | translate }}
                </span>
              </h3>
              <p class="text-[12.5px] text-dim mt-0.5 mb-3.5">{{ slide.hintKey | translate }}</p>

              @switch (i) {
                @case (0) { <app-column-line-chart /> }
                @case (1) { <app-trend-chart /> }
                @case (2) { <app-ranked-bar-chart /> }
              }
            </div>
          }
        </div>
      </div>

      <div class="flex gap-[7px] justify-center mt-4">
        @for (slide of slides; track slide.titleKey; let i = $index) {
          <button type="button"
                  class="w-[7px] h-[7px] p-0 rounded-full border-0 cursor-pointer transition-all
                         bg-dim aria-pressed:bg-accent aria-pressed:opacity-100 aria-pressed:scale-125"
                  [class.opacity-30]="i !== index()"
                  [attr.aria-pressed]="i === index()"
                  [attr.aria-label]="(slide.titleKey | translate)"
                  (click)="index.set(i)"></button>
        }
      </div>
    </section>
  `,
  styles: `
    .nav-btn {
      width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 6px; cursor: pointer; font: inherit; font-size: 16px; line-height: 1;
      border: 1px solid var(--line); background: var(--card); color: var(--dim);
      transition: border-color .16s ease, color .16s ease;
    }
    .nav-btn:hover { border-color: var(--dim); color: var(--ink); }
  `,
})
export class ReportSliderComponent {
  readonly slides = SLIDES;
  readonly index = signal(0);

  step(delta: number): void {
    const n = this.slides.length;
    this.index.set((this.index() + delta + n) % n);
  }
}
