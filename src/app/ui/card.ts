import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  host: { class: 'block min-w-0' },
  template: `
    <section class="bg-card border border-line rounded-[10px] px-4 py-4 sm:px-5 sm:py-[18px] h-full">
      @if (heading()) {
        <h2 class="text-[14.5px] font-semibold tracking-[-0.01em] m-0">{{ heading()! | translate }}</h2>
      }
      @if (hint()) {
        <p class="text-[12.5px] text-dim mt-0.5 mb-4">{{ hint()! | translate }}</p>
      }
      <ng-content />
    </section>
  `,
})
export class CardComponent {
  readonly heading = input<string | null>(null);
  readonly hint = input<string | null>(null);
}
