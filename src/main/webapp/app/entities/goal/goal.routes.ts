import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import GoalResolve from './route/goal-routing-resolve.service';

const goalRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/goal.component').then(m => m.GoalComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/goal-detail.component').then(m => m.GoalDetailComponent),
    resolve: {
      goal: GoalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/goal-update.component').then(m => m.GoalUpdateComponent),
    resolve: {
      goal: GoalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/goal-update.component').then(m => m.GoalUpdateComponent),
    resolve: {
      goal: GoalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default goalRoute;
