import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'enemApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'edition-results',
    data: { pageTitle: 'enemApp.editionResults.home.title' },
    loadChildren: () => import('./edition-results/edition-results.routes'),
  },
  {
    path: 'score',
    data: { pageTitle: 'enemApp.score.home.title' },
    loadChildren: () => import('./score/score.routes'),
  },
  {
    path: 'goal',
    data: { pageTitle: 'enemApp.goal.home.title' },
    loadChildren: () => import('./goal/goal.routes'),
  },
  {
    path: 'participant',
    data: { pageTitle: 'enemApp.participant.home.title' },
    loadChildren: () => import('./participant/participant.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
