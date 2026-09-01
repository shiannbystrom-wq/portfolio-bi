import { Injectable, inject, computed, effect, signal } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { CONTACT } from '../data/site';

/**
 * Keeps one source of truth for "which view am I on": the topbar heading and
 * the browser tab title both read it, and both follow the language switch.
 */
@Injectable({ providedIn: 'root' })
export class ViewTitleService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);
  private readonly title = inject(Title);

  private readonly key = signal<string>('nav.overview');

  /** Translation key of the current view. */
  readonly titleKey = computed(() => this.key());

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.route;
        while (route.firstChild) route = route.firstChild;
        this.key.set(route.snapshot.data['titleKey'] ?? 'nav.overview');
      });

    effect(() => {
      // Re-runs on both navigation and language change.
      const key = this.key();
      this.translate.currentLang();
      const view = this.translate.instant(key);
      this.title.setTitle(`${view} · ${CONTACT.name} — Business Intelligence-analytiker`);
    });
  }
}
