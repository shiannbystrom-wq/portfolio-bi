import { Routes } from '@angular/router';

/**
 * Real routes rather than show/hide: every view is linkable, prerenderable and
 * shows up in browser history where a visitor expects it.
 * Paths are Swedish because the audience is.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/overview').then((m) => m.OverviewComponent),
    data: { titleKey: 'nav.overview' },
  },
  {
    path: 'projekt',
    loadComponent: () => import('./views/projects').then((m) => m.ProjectsComponent),
    data: { titleKey: 'nav.projects' },
  },
  {
    path: 'kompetens',
    loadComponent: () => import('./views/skills').then((m) => m.SkillsComponent),
    data: { titleKey: 'nav.skills' },
  },
  {
    path: 'erfarenhet',
    loadComponent: () => import('./views/experience').then((m) => m.ExperienceComponent),
    data: { titleKey: 'nav.experience' },
  },
  {
    path: 'utbildning',
    loadComponent: () => import('./views/education').then((m) => m.EducationComponent),
    data: { titleKey: 'nav.education' },
  },
  {
    path: 'kontakt',
    loadComponent: () => import('./views/contact').then((m) => m.ContactComponent),
    data: { titleKey: 'nav.contact' },
  },
  { path: '**', redirectTo: '' },
];
