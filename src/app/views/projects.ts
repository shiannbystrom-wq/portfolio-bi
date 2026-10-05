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
        <!--
          Image beside the text from lg up, stacked below it on phones. Two
          earlier attempts were wrong in opposite directions: a narrow
          full-height column centre-cropped every screenshot to portrait, and
          full card width made a 562px-tall image dominate the card. A fixed
          16:9 box aligned to the top keeps the card height driven by the prose.
        -->
        <article class="bg-card border border-line rounded-[10px] overflow-hidden
                        grid lg:grid-cols-[minmax(0,360px)_1fr] lg:items-start">
          @if (p.image) {
            <!--
              object-contain, not object-cover: these are screenshots, so the
              whole frame is the content. Cropping a report to fill a box cuts
              the KPI row off one edge and the legend off the other.
              The link is the "see it properly" — native zoom, no dialog code.
            -->
            <a [href]="p.image" target="_blank" rel="noopener"
               class="block border-b lg:border-b-0 lg:border-r border-line group cursor-zoom-in"
               [attr.aria-label]="('projects.openImage' | translate) + ': ' + ('project.' + p.id + '.title' | translate)">
              <img [src]="p.image" alt="" loading="lazy"
                   class="w-full aspect-[16/9] object-contain bg-canvas
                          transition-opacity group-hover:opacity-90">
              <span class="block px-3 pb-2 lg:pb-3 font-cond text-[10.5px] font-semibold
                           tracking-[0.1em] uppercase text-dim bg-canvas
                           opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100
                           transition-opacity">
                {{ 'projects.openImage' | translate }} →
              </span>
            </a>
          } @else {
            <!-- Empty slot, same 16:9 box as a real screenshot so nothing shifts later. -->
            <div class="bg-canvas border-b lg:border-b-0 lg:border-r border-line aspect-[16/9]
                        p-4 flex flex-col justify-center gap-2">
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
  /**
   * "tricky" earns its place: what someone found hard, and how they got past
   * it, is what an interviewer follows up on. It is also the part a candidate
   * can talk about for ten minutes without preparing.
   */
  readonly parts = ['question', 'did', 'tricky', 'outcome'] as const;
  readonly skeleton = [46, 72, 58, 88, 64, 96];
}
