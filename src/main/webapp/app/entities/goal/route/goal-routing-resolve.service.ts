import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGoal } from '../goal.model';
import { GoalService } from '../service/goal.service';

const goalResolve = (route: ActivatedRouteSnapshot): Observable<null | IGoal> => {
  const id = route.params.id;
  if (id) {
    return inject(GoalService)
      .find(id)
      .pipe(
        mergeMap((goal: HttpResponse<IGoal>) => {
          if (goal.body) {
            return of(goal.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default goalResolve;
