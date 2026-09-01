import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService, THEMES } from '../core/theme.service';
import { LangService, LangId } from '../core/lang.service';
import { ViewTitleService } from '../core/view-title';
import { CONTACT } from '../data/site';

/**
 * The report header: current view, language switch, theme picker, contact CTA.
 *
 * The theme picker is a real feature rather than a demo control — a BI analyst
 * changing a report theme is exactly the gesture this page is imitating.
 */
@Component({
  selector: 'app-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  template: `
    <div class="bg-card border-b border-line px-3 py-3 sm:px-[26px] sm:py-4
                flex items-center gap-2.5 sm:gap-3.5 flex-wrap">
      <h1 class="text-[17px] sm:text-[19px] font-semibold tracking-[-0.015em] m-0">
        {{ viewTitle.titleKey() | translate }}
      </h1>

      <span class="hidden sm:inline-flex chip">{{ 'site.updated' | translate }}</span>

      <div class="chip gap-0" role="group" [attr.aria-label]="'lang.label' | translate">
        @for (l of langs; track l; let first = $first) {
          @if (!first) { <span class="px-1 opacity-40" aria-hidden="true">·</span> }
          <button type="button"
                  class="uppercase cursor-pointer bg-transparent border-0 p-0 font-inherit
                         aria-pressed:font-semibold aria-pressed:text-ink"
                  [class.text-dim]="lang.current() !== l"
                  [attr.aria-pressed]="lang.current() === l"
                  (click)="lang.set(l)">{{ l }}</button>
        }
      </div>

      <span class="flex-1"></span>

      <div class="flex items-center gap-2 sm:gap-[7px] border border-line rounded-lg
                  bg-card px-[9px] sm:px-[11px] py-1.5"
           role="group" [attr.aria-label]="'theme.label' | translate">
        <span class="font-cond text-[10.5px] font-semibold tracking-[0.12em] uppercase text-dim">
          {{ 'theme.label' | translate }}
        </span>
        @for (t of themes; track t.id) {
          <button type="button"
                  class="swatch"
                  [style.background]="t.swatch"
                  [attr.aria-pressed]="theme.current() === t.id"
                  [attr.aria-label]="t.labelKey | translate"
                  [title]="t.labelKey | translate"
                  (click)="theme.set(t.id)"></button>
        }
      </div>

      <a class="bg-accent text-on-accent no-underline text-[13.5px] font-medium
                rounded-md px-4 py-2 sm:py-[9px] hover:bg-accent-hi transition-colors
                max-sm:flex-[1_1_100%] max-sm:text-center"
         [href]="mailto">{{ 'cta.contact' | translate }}</a>
    </div>
  `,
  styles: `
    .chip {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; color: var(--dim);
      background: var(--bg); border: 1px solid var(--line);
      border-radius: 6px; padding: 5px 10px;
    }
    .swatch {
      width: 22px; height: 22px; padding: 0; border-radius: 50%;
      cursor: pointer; border: 1px solid rgb(128 128 128 / 0.35);
      transition: transform .14s ease, box-shadow .14s ease;
    }
    @media (min-width: 640px) { .swatch { width: 17px; height: 17px; } }
    .swatch:hover { transform: scale(1.16); }
    .swatch[aria-pressed="true"] {
      box-shadow: 0 0 0 2px var(--card), 0 0 0 3.5px var(--ink);
    }
  `,
})
export class TopbarComponent {
  readonly theme = inject(ThemeService);
  readonly lang = inject(LangService);
  readonly viewTitle = inject(ViewTitleService);

  readonly themes = THEMES;
  readonly langs: LangId[] = ['sv', 'en'];
  readonly mailto = `mailto:${CONTACT.email}`;
}
