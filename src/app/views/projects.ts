import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TagListComponent } from '../ui/tag-list';
import { PROJECTS } from '../data/site';

/**
 * Each project answers the three questions a hiring manager actually asks:
 * what was the question, what did you do, what came out of it.
 */
@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, TagListComponent],
  template: `
    <div class="grid gap-3 sm:gap-4">
      <p class="text-[13.5px] text-dim max-w-[70ch] m-0">{{ 'projects.intro' | translate }}</p>

      @for (p of projects; track p.id) {
        <article class="bg-card border border-line rounded-[10px] overflow-hidden
                        grid lg:grid-cols-[300px_1fr]">
          @if (p.image) {
            <img [src]="p.image" alt="" loading="lazy"
                 class="w-full h-full object-cover max-lg:aspect-[16/9] border-b lg:border-b-0 lg:border-r border-line">
          } @else {
            <!-- Empty slot, sized like the real screenshot so nothing shifts later. -->
            <div class="bg-canvas border-b lg:border-b-0 lg:border-r border-line
                        p-4 min-h-[150px] lg:min-h-[210px] flex flex-col justify-center gap-2">
              <div class="flex gap-1.5 items-end h-14" aria-hidden="true">
                @for (h of skeleton; track $index) {
                  <i class="flex-1 block rounded-[2px] bg-accent opacity-[0.22]" [style.height.%]="h"></i>
                }
              </div>
              <div class="flex gap-1.5" aria-hidden="true">
                <span class="h-2 flex-[2] rounded-[2px] bg-dim opacity-[0.16]"></span>
                <span class="h-2 flex-1 rounded-[2px] bg-dim opacity-[0.16]"></span>
              </div>
              <div class="font-cond text-[10.5px] font-semibold tracking-[0.1em] uppercase text-dim
                          mt-1.5 flex items-center gap-1.5">
                <i class="w-1.5 h-1.5 rounded-full bg-dim opacity-50"></i>
                {{ 'projects.imageSlot' | translate }}
              </div>
            </div>
          }

          <div class="p-4 sm:p-5 min-w-0">
            <h2 class="text-[17px] font-semibold tracking-[-0.015em] m-0">
              {{ 'project.' + p.id + '.title' | translate }}
            </h2>
            <p class="font-cond text-[11.5px] font-semibold tracking-[0.09em] uppercase text-dim mt-1 mb-4">
              {{ p.year }} · {{ p.tools.join(' · ') }}
            </p>

            <dl class="grid gap-3 mb-4">
              @for (part of parts; track part) {
                <div class="grid sm:grid-cols-[120px_1fr] gap-y-0.5 sm:gap-4 items-baseline">
                  <dt class="font-cond text-[11px] font-semibold tracking-[0.1em] uppercase text-dim">
                    {{ 'project.part.' + part | translate }}
                  </dt>
                  <dd class="m-0 text-sm text-body leading-relaxed">
                    {{ 'project.' + p.id + '.' + part | translate }}
                  </dd>
                </div>
              }
            </dl>

            <app-tag-list [tags]="p.tools" />
          </div>
        </article>
      }

      <!-- Reserved slot: the section is visibly not finished, which is honest. -->
      <article class="border border-dashed border-line rounded-[10px] grid lg:grid-cols-[300px_1fr]">
        <div class="border-b lg:border-b-0 lg:border-r border-dashed border-line p-4
                    min-h-[110px] lg:min-h-[160px] flex items-center justify-center">
          <span class="font-cond text-[10.5px] font-semibold tracking-[0.1em] uppercase text-dim">
            {{ 'projects.more' | translate }}
          </span>
        </div>
        <div class="p-4 sm:p-5">
          <h2 class="text-[17px] font-semibold tracking-[-0.015em] text-dim m-0">
            {{ 'project.thesis.title' | translate }}
          </h2>
          <p class="font-cond text-[11.5px] font-semibold tracking-[0.09em] uppercase text-dim mt-1 mb-3">
            {{ 'project.thesis.when' | translate }}
          </p>
          <p class="text-sm text-body m-0">{{ 'project.thesis.note' | translate }}</p>
        </div>
      </article>
    </div>
  `,
})
export class ProjectsComponent {
  readonly projects = PROJECTS;
  readonly parts = ['question', 'did', 'outcome'] as const;
  readonly skeleton = [46, 72, 58, 88, 64, 96];
}
