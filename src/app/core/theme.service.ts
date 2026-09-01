import { Injectable, signal, effect, inject, DOCUMENT } from '@angular/core';

export type ThemeId = 'warm' | 'cool' | 'night';

export interface Theme {
  id: ThemeId;
  /** Swatch shown in the picker. Fixed per theme, not read from the tokens. */
  swatch: string;
  /** Translation key for the accessible name. */
  labelKey: string;
}

export const THEMES: readonly Theme[] = [
  { id: 'warm',  swatch: '#a8452b', labelKey: 'theme.warm' },
  { id: 'cool',  swatch: '#2457c5', labelKey: 'theme.cool' },
  { id: 'night', swatch: '#38a8d8', labelKey: 'theme.night' },
] as const;

const STORAGE_KEY = 'bi-theme';
const DEFAULT: ThemeId = 'warm';

function isThemeId(v: unknown): v is ThemeId {
  return v === 'warm' || v === 'cool' || v === 'night';
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);

  readonly current = signal<ThemeId>(this.read());

  constructor() {
    effect(() => {
      const id = this.current();
      this.doc.documentElement.setAttribute('data-pal', id);
      try {
        localStorage.setItem(STORAGE_KEY, id);
      } catch {
        // Private mode or blocked storage: the theme still applies for this visit.
      }
    });
  }

  set(id: ThemeId): void {
    this.current.set(id);
  }

  private read(): ThemeId {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isThemeId(stored)) return stored;
    } catch {
      // ignore
    }
    return DEFAULT;
  }
}
