import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CONTACT } from '../data/site';

interface NavItem {
  path: string;
  key: string;
  exact: boolean;
}

const NAV: NavItem[] = [
  { path: '/',            key: 'nav.overview',   exact: true },
  { path: '/projekt',     key: 'nav.projects',   exact: false },
  { path: '/kompetens',   key: 'nav.skills',     exact: false },
  { path: '/erfarenhet',  key: 'nav.experience', exact: false },
  { path: '/utbildning',  key: 'nav.education',  exact: false },
  { path: '/kontakt',     key: 'nav.contact',    exact: false },
];

/**
 * The report navigation pane. On phones it wraps to two rows rather than
 * scrolling sideways, so every view is visible instead of hidden off-screen.
 */
@Component({
  selector: 'app-rail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  host: { class: 'block bg-rail text-rail-mut' },
  template: `
    <div class="flex flex-col gap-3 lg:gap-[26px] py-3.5 lg:py-[22px] lg:min-h-full">
      <div class="grid grid-cols-[auto_1fr] lg:block items-center gap-x-3 px-4 lg:px-5">
        <img [src]="avatar" width="44" height="44" alt=""
             class="w-11 h-11 rounded-full object-cover row-span-2 lg:mb-2.5">
        <b class="block text-rail-ink text-[14.5px] font-semibold tracking-[-0.01em]">{{ name }}</b>
        <span class="block text-xs text-rail-dim lg:mt-0.5">{{ 'site.role' | translate }}</span>
      </div>

      <nav class="flex flex-wrap lg:flex-col px-2.5 lg:px-0" [attr.aria-label]="'nav.label' | translate">
        @for (item of nav; track item.path) {
          <a [routerLink]="item.path"
             routerLinkActive="is-active"
             [routerLinkActiveOptions]="{ exact: item.exact }"
             class="no-underline text-[13.5px] text-rail-mut px-2.5 lg:px-5 py-2
                    border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-transparent whitespace-nowrap
                    hover:text-rail-ink hover:bg-[var(--rail-hover)]">
            {{ item.key | translate }}
          </a>
        }
      </nav>

      <div class="hidden lg:block mt-auto px-5 pt-3.5 text-xs text-rail-dim border-t border-[var(--rail-rule)]">
        <b class="block text-rail-good text-xs font-semibold mb-0.5">{{ 'site.available' | translate }}</b>
        <span>{{ 'site.availableWhen' | translate }}</span>
      </div>
    </div>
  `,
  styles: `
    .is-active {
      color: var(--rail-ink);
      background: var(--rail-active);
      border-color: var(--accent);
    }
  `,
})
export class RailComponent {
  readonly nav = NAV;
  readonly name = CONTACT.name;
  readonly avatar = '/img/avatar-256.jpg';
}
