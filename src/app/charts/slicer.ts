import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export interface SlicerOption {
  key: string;
  labelKey: string;
}

/**
 * The filter row above a chart. Real toggle buttons with aria-pressed, so a
 * screen reader announces which slice is active — the thing chart libraries
 * that draw to canvas cannot give you.
 */
@Component({
  selector: 'app-slicer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  template: `
    <div class="flex flex-wrap gap-1.5 mb-4" role="group" [attr.aria-label]="groupLabel() | translate">
      @for (opt of options(); track opt.key) {
        <button
          type="button"
          [attr.aria-pressed]="opt.key === selected()"
          (click)="pick.emit(opt.key)"
          class="font-sans text-[12.5px] rounded-md border px-3 py-1.5 cursor-pointer
                 transition-colors border-line text-dim bg-card
                 hover:border-dim hover:text-ink
                 aria-pressed:bg-accent aria-pressed:border-accent aria-pressed:text-on-accent">
          {{ opt.labelKey | translate }}
        </button>
      }
    </div>
  `,
})
export class SlicerComponent {
  readonly options = input.required<readonly SlicerOption[]>();
  readonly selected = input.required<string>();
  readonly groupLabel = input('chart.filter');
  readonly pick = output<string>();
}
