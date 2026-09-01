import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { RailComponent } from './layout/rail';
import { TopbarComponent } from './layout/topbar';
import { LangService } from './core/lang.service';
import { ViewTitleService } from './core/view-title';
import { CONTACT } from './data/site';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RailComponent, TopbarComponent, TranslatePipe],
  template: `
    <a href="#main" class="skip">{{ 'a11y.skip' | translate }}</a>

    <div class="grid lg:grid-cols-[212px_1fr] min-h-screen">
      <app-rail />

      <div class="min-w-0 flex flex-col">
        <app-topbar />

        <main id="main" class="flex-1 px-3 pt-3.5 pb-7 sm:px-[26px] sm:pt-[22px] sm:pb-10">
          <router-outlet />
        </main>

        <footer class="bg-card border-t border-line px-3 py-3.5 sm:px-[26px]
                       flex flex-wrap gap-3 sm:gap-[18px] text-[13px] text-dim">
          <span>{{ name }} · {{ locality }}</span>
          <a class="text-accent-text no-underline hover:underline" [href]="mailto">{{ email }}</a>
          <a class="text-accent-text no-underline hover:underline"
             [href]="linkedin" target="_blank" rel="noopener">LinkedIn</a>
        </footer>
      </div>
    </div>
  `,
  styles: `
    .skip {
      position: absolute; left: -9999px; top: 0; z-index: 50;
      background: var(--accent); color: var(--on-accent);
      padding: 10px 16px; border-radius: 0 0 8px 0; text-decoration: none;
    }
    .skip:focus { left: 0; }
  `,
})
export class App {
  // Constructed here so the language and the tab title are wired from first paint.
  private readonly lang = inject(LangService);
  private readonly viewTitle = inject(ViewTitleService);

  readonly name = CONTACT.name;
  readonly locality = CONTACT.locality;
  readonly email = CONTACT.email;
  readonly mailto = `mailto:${CONTACT.email}`;
  readonly linkedin = CONTACT.linkedin;
}
