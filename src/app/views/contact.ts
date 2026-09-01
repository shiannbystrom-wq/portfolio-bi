import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CardComponent } from '../ui/card';
import { CONTACT } from '../data/site';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, CardComponent],
  template: `
    <div class="grid gap-3 sm:gap-4 lg:grid-cols-[1.55fr_1fr] items-start">
      <app-card>
        <p class="text-lg sm:text-xl font-semibold tracking-[-0.015em] leading-snug mt-0 mb-2.5">
          {{ 'contact.ask' | translate }}
        </p>
        <p class="text-sm text-body mb-4">{{ 'contact.body' | translate }}</p>
        <a class="inline-block bg-accent text-on-accent no-underline text-[13.5px] font-medium
                  rounded-md px-4 py-[9px] hover:bg-accent-hi transition-colors"
           [href]="mailto">{{ 'contact.mail' | translate }}</a>
      </app-card>

      <app-card heading="contact.details" hint="contact.replies">
        <div class="grid">
          <a class="block py-3.5 border-b border-line no-underline text-ink text-[15px] hover:text-accent-text break-words"
             [href]="mailto">
            <span class="lbl">{{ 'contact.email' | translate }}</span>{{ email }}
          </a>
          <a class="block py-3.5 border-b border-line no-underline text-ink text-[15px] hover:text-accent-text"
             [href]="linkedin" target="_blank" rel="noopener">
            <span class="lbl">LinkedIn</span>{{ handle }}
          </a>
          <div class="block py-3.5 border-b border-line text-[15px]">
            <span class="lbl">{{ 'contact.place' | translate }}</span>{{ locality }}
          </div>
        </div>
      </app-card>
    </div>
  `,
  styles: `
    .lbl {
      display: block; margin-bottom: 3px;
      font-family: var(--font-cond); font-size: 11px; font-weight: 600;
      letter-spacing: .1em; text-transform: uppercase; color: var(--dim);
    }
  `,
})
export class ContactComponent {
  readonly email = CONTACT.email;
  readonly mailto = `mailto:${CONTACT.email}`;
  readonly linkedin = CONTACT.linkedin;
  readonly handle = CONTACT.linkedinHandle;
  readonly locality = CONTACT.locality;
}
