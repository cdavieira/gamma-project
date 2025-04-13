import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEditionResults } from '../edition-results.model';
import { EditionResultsService } from '../service/edition-results.service';

const editionResultsResolve = (route: ActivatedRouteSnapshot): Observable<null | IEditionResults> => {
  const id = route.params.id;
  if (id) {
    return inject(EditionResultsService)
      .find(id)
      .pipe(
        mergeMap((editionResults: HttpResponse<IEditionResults>) => {
          if (editionResults.body) {
            return of(editionResults.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default editionResultsResolve;
