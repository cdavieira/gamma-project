import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IScore } from '../score.model';
import { ScoreService } from '../service/score.service';

const scoreResolve = (route: ActivatedRouteSnapshot): Observable<null | IScore> => {
  const id = route.params.id;
  if (id) {
    return inject(ScoreService)
      .find(id)
      .pipe(
        mergeMap((score: HttpResponse<IScore>) => {
          if (score.body) {
            return of(score.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default scoreResolve;
