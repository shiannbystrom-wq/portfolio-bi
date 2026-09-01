import { Injectable, inject, effect, DOCUMENT } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type LangId = 'sv' | 'en';
export const LANGS: readonly LangId[] = ['sv', 'en'] as const;

const STORAGE_KEY = 'bi-lang';

function isLangId(v: unknown): v is LangId {
  return v === 'sv' || v === 'en';
}

/**
 * Thin wrapper over TranslateService: picks the initial language, persists the
 * choice, and keeps <html lang> in step so screen readers switch voice.
 */
@Injectable({ providedIn: 'root' })
export class LangService {
  private readonly translate = inject(TranslateService);
  private readonly doc = inject(DOCUMENT);

  /** Signal — re-reads in templates and in chart labels without a subscription. */
  readonly current = this.translate.currentLang;

  constructor() {
    this.translate.use(this.initial());

    effect(() => {
      const lang = this.current();
      if (!lang) return;
      this.doc.documentElement.setAttribute('lang', lang);
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // ignore
      }
    });
  }

  set(lang: LangId): void {
    this.translate.use(lang);
  }

  private initial(): LangId {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isLangId(stored)) return stored;
    } catch {
      // ignore
    }
    // Always Swedish first. Plenty of Swedish workplaces run English-locale
    // browsers, so navigator.language would show English to exactly the
    // recruiters this page is written for. The EN toggle is one click away.
    return 'sv';
  }
}
