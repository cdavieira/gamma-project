import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ParticipantResolve from './route/participant-routing-resolve.service';

const participantRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/participant.component').then(m => m.ParticipantComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/participant-detail.component').then(m => m.ParticipantDetailComponent),
    resolve: {
      participant: ParticipantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/participant-update.component').then(m => m.ParticipantUpdateComponent),
    resolve: {
      participant: ParticipantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/participant-update.component').then(m => m.ParticipantUpdateComponent),
    resolve: {
      participant: ParticipantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default participantRoute;
