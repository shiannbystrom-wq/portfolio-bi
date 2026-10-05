import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CardComponent } from '../ui/card';
import { TagListComponent } from '../ui/tag-list';
import { ReportSliderComponent } from '../ui/report-slider';
import { kpis as buildKpis, SKILL_ROWS, PROJECTS } from '../data/site';

@Component({
  selector: 'app-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe, CardComponent, TagListComponent, ReportSliderComponent],
  template: `
    <div class="grid gap-3 sm:gap-4">

      <!-- KPI row: two-up on phones, four-up from tablet -->
      <div class="grid gap-3 sm:gap-4 grid-cols-1 min-[380px]:grid-cols-2 lg:grid-cols-4">
        @for (kpi of kpis; track kpi.labelKey) {
          <div class="relative overflow-hidden bg-card border border-line rounded-[10px]
                      pl-[15px] pr-3 py-3 sm:pl-[18px] sm:pr-[18px] sm:py-4">
            <span class="absolute inset-y-0 left-0 w-[3px]" [class]="stripe(kpi.tone)"></span>
            <div class="font-cond text-[11px] font-semibold tracking-[0.1em] uppercase text-dim">
              {{ kpi.labelKey | translate }}
            </div>
            <div class="text-[23px] sm:text-[27px] font-semibold tracking-[-0.02em] mt-1.5 tnum leading-tight">
              {{ kpi.value }}@if (kpi.unit) {<span class="text-[13px] sm:text-sm font-medium text-dim"
                    [class.ml-1]="kpi.unit !== '%'">{{ kpi.unit }}</span>}
            </div>
            <div class="text-xs sm:text-[12.5px] text-dim mt-0.5">{{ kpi.subKey | translate }}</div>
          </div>
        }
      </div>

      <!-- About + skills. Skills gets the wider column: it is a table. -->
      <div class="grid gap-3 sm:gap-4 lg:grid-cols-[1fr_1.5fr] items-start">
        <app-card heading="about.heading" hint="about.hint">
          <p class="text-sm text-body mb-3">{{ 'about.p1' | translate }}</p>
          <p class="text-sm text-body mb-3">{{ 'about.p2' | translate }}</p>
          <p class="text-sm text-body mb-4">{{ 'about.p3' | translate }}</p>
          <app-tag-list [tags]="[
            'lang.sv' | translate,
            'lang.en' | translate,
            'Solna'
          ]" [muted]="true" />
        </app-card>

        <app-card heading="skills.heading" hint="skills.tableHint">
          <div class="scroller">
            <table class="w-full border-collapse text-[13.5px]">
              <thead>
                <tr>
                  <th class="th">{{ 'skills.col.area' | translate }}</th>
                  <th class="th">{{ 'skills.col.tool' | translate }}</th>
                  <th class="th w-[34%]">{{ 'skills.col.usedIn' | translate }}</th>
                </tr>
              </thead>
              <tbody>
                @for (row of skillRows; track row.areaKey) {
                  <tr>
                    <td class="td">{{ row.areaKey | translate }}</td>
                    <td class="td">{{ row.tools }}</td>
                    <td class="td">
                      <a routerLink="/projekt" class="text-accent-text no-underline hover:underline">
                        {{ 'project.' + row.projectId + '.title' | translate }}
                      </a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <a routerLink="/kompetens"
             class="inline-block mt-4 text-[13px] font-medium text-accent-text no-underline hover:underline">
            {{ 'skills.seeAll' | translate }}
          </a>
        </app-card>
      </div>

      <app-report-slider />

      <!-- Project teaser: titles only. The prose lives in the Projekt view. -->
      <section class="bg-card border border-line rounded-[10px] px-4 sm:px-5 pt-1.5 pb-2.5">
        <div class="flex items-baseline gap-3 pt-3 pb-1">
          <h2 class="text-[14.5px] font-semibold tracking-[-0.01em] m-0">{{ 'projects.selected' | translate }}</h2>
          <span class="flex-1"></span>
          <a routerLink="/projekt"
             class="text-[13px] font-medium text-accent-text no-underline hover:underline">
            {{ 'projects.seeAll' | translate }}
          </a>
        </div>
        <ul class="list-none m-0 p-0">
          @for (p of projects; track p.id) {
            <li class="flex items-center gap-2 sm:gap-3.5 flex-wrap py-3 border-t border-line text-sm">
              <span class="text-[12.5px] text-dim tnum min-w-[38px]">{{ p.year }}</span>
              <b class="font-semibold">{{ 'project.' + p.id + '.title' | translate }}</b>
              <span class="flex-1"></span>
              <app-tag-list [tags]="p.tools.slice(0, 3)" />
            </li>
          }
        </ul>
      </section>

    </div>
  `,
  styles: `
    .th {
      text-align: left; font-family: var(--font-cond); font-size: 11px;
      letter-spacing: .09em; text-transform: uppercase; color: var(--dim);
      font-weight: 600; padding: 0 16px 8px 0; border-bottom: 1px solid var(--line);
    }
    .td { padding: 9px 16px 9px 0; border-bottom: 1px solid var(--line); vertical-align: middle; }
    .th:last-child, .td:last-child { padding-right: 0; }
    tr:last-child .td { border-bottom: 0; }
  `,
})
export class OverviewComponent {
  /** Recomputed per load, so the progress tile is never stale. */
  readonly kpis = buildKpis();
  readonly skillRows = SKILL_ROWS;
  readonly projects = PROJECTS;

  stripe(tone: string): string {
    switch (tone) {
      case 'cat2': return 'bg-cat2';
      case 'cat3': return 'bg-cat3';
      case 'cat4': return 'bg-cat4';
      default: return 'bg-accent';
    }
  }
}
