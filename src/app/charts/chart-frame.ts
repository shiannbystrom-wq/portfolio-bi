import {
  Directive, ElementRef, inject, signal, computed, OnDestroy, afterNextRender,
} from '@angular/core';

export interface Geometry {
  /** SVG user units across. Equals the element's CSS pixel width, so a
   *  10.5px label is really 10.5px on screen at any viewport size. */
  w: number;
  h: number;
  /** Right padding, reserving room for the secondary-axis unit label. */
  r: number;
  narrow: boolean;
}

const MIN = 280;
const MAX = 760;

/**
 * Measures the host and exposes chart geometry as a signal.
 *
 * The whole point: an SVG with a fixed viewBox scales its text down with the
 * box. Drawing at the container's real pixel width keeps 1 user unit = 1 CSS
 * pixel, so axis labels stay the size they were designed at on a phone.
 */
@Directive({ selector: '[appChartFrame]', exportAs: 'chartFrame' })
export class ChartFrameDirective implements OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private observer?: ResizeObserver;

  private readonly width = signal(640);

  readonly geometry = computed<Geometry>(() => {
    const w = Math.max(MIN, Math.min(MAX, Math.round(this.width())));
    const narrow = w < 430;
    return { w, h: narrow ? 186 : 210, r: narrow ? 26 : 40, narrow };
  });

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement as HTMLElement;
      this.measure(el);
      this.observer = new ResizeObserver(() => this.measure(el));
      this.observer.observe(el);
    });
  }

  private measure(el: HTMLElement): void {
    const w = el.clientWidth;
    // A hidden element measures 0; keep the last good width rather than
    // collapsing the chart.
    if (w > 0) this.width.set(w);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

/** Group value into 1 234 style, which is how Swedish reports show it. */
export function fmt(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export const MONTHS: Record<string, string[]> = {
  sv: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};
