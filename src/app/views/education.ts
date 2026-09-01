import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CardComponent } from '../ui/card';
import { COURSES, CourseStatus } from '../data/site';

@Component({
  selector: 'app-education',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CardComponent],
  template: `
    <div class="grid gap-3 sm:gap-4">
      <app-card heading="edu.nackademin" hint="edu.nackademinSub">
        <div class="scroller">
          <table class="w-full border-collapse text-[13.5px]">
            <thead>
              <tr>
                <th class="th">{{ 'edu.col.course' | translate }}</th>
                <th class="th">{{ 'edu.col.content' | translate }}</th>
                <th class="th">{{ 'edu.col.status' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              @for (c of courses; track c.name) {
                <tr>
                  <td class="td">{{ c.name }}</td>
                  <td class="td">{{ c.contentKey | translate }}</td>
                  <td class="td">
                    <span class="text-[11px] font-semibold px-2 py-[3px] rounded-full whitespace-nowrap"
                          [class]="pill(c.status)">
                      {{ c.statusLabel ?? ('edu.status.' + c.status | translate) }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </app-card>

      <app-card heading="edu.mvc" hint="edu.mvcSub">
        <p class="text-sm text-body m-0">{{ 'edu.mvcNote' | translate }}</p>
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
export class EducationComponent {
  readonly courses = COURSES;

  pill(status: CourseStatus): string {
    return status === 'done'
      ? 'bg-good-bg text-good'
      : 'bg-warn-bg text-warn';
  }
}
