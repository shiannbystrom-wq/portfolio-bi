import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CardComponent } from '../ui/card';
import { TIMELINE } from '../data/site';

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CardComponent],
  template: `
    <div class="grid gap-3 sm:gap-4">
      <p class="text-[13.5px] text-dim max-w-[70ch] m-0">{{ 'exp.intro' | translate }}</p>
      <app-card>
        <div class="scroller">
          <table class="w-full border-collapse text-[13.5px]">
            <thead>
              <tr>
                <th class="th w-[110px]">{{ 'exp.col.years' | translate }}</th>
                <th class="th">{{ 'exp.col.role' | translate }}</th>
                <th class="th">{{ 'exp.col.employer' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              @for (row of rows; track row.years + row.employer) {
                <tr>
                  <td class="td tnum text-dim">{{ row.years }}</td>
                  <td class="td">{{ row.roleKey | translate }}</td>
                  <td class="td">{{ row.employer }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
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
export class ExperienceComponent {
  readonly rows = TIMELINE;
}
