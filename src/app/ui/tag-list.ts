import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-tag-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="flex flex-wrap gap-1.5 list-none p-0 m-0">
      @for (tag of tags(); track tag) {
        <li class="font-mono text-[11px] rounded-[5px] px-2 py-1"
            [class]="muted()
              ? 'text-dim bg-canvas border border-line'
              : 'text-accent-text bg-accent-soft'">{{ tag }}</li>
      }
    </ul>
  `,
})
export class TagListComponent {
  readonly tags = input.required<readonly string[]>();
  readonly muted = input(false);
}
