import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ScoreResolve from './route/score-routing-resolve.service';

const scoreRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/score.component').then(m => m.ScoreComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/score-detail.component').then(m => m.ScoreDetailComponent),
    resolve: {
      score: ScoreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/score-update.component').then(m => m.ScoreUpdateComponent),
    resolve: {
      score: ScoreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/score-update.component').then(m => m.ScoreUpdateComponent),
    resolve: {
      score: ScoreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default scoreRoute;
