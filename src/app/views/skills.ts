import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CardComponent } from '../ui/card';
import { TagListComponent } from '../ui/tag-list';
import { SKILL_GROUPS, SKILL_ROWS } from '../data/site';

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe, CardComponent, TagListComponent],
  template: `
    <div class="grid gap-3 sm:gap-4">
      <div class="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (g of groups; track g.id) {
          <app-card [heading]="'skills.group.' + g.id + '.title'" [hint]="'skills.group.' + g.id + '.hint'">
            <app-tag-list [tags]="g.tags" />
          </app-card>
        }
      </div>

      <app-card heading="skills.usedHeading" hint="skills.tableHint">
        <div class="scroller">
          <table class="w-full border-collapse text-[13.5px]">
            <thead>
              <tr>
                <th class="th">{{ 'skills.col.area' | translate }}</th>
                <th class="th">{{ 'skills.col.tool' | translate }}</th>
                <th class="th w-[38%]">{{ 'skills.col.usedIn' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              @for (row of rows; track row.areaKey) {
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
      </app-card>

      <app-card heading="skills.langHeading" hint="skills.langHint">
        <app-tag-list [tags]="['lang.svLevel' | translate, 'lang.enLevel' | translate]" [muted]="true" />
      </app-card>
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
export class SkillsComponent {
  readonly groups = SKILL_GROUPS;
  readonly rows = SKILL_ROWS;
}
