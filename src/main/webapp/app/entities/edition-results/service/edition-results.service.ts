import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEditionResults, NewEditionResults } from '../edition-results.model';

export type PartialUpdateEditionResults = Partial<IEditionResults> & Pick<IEditionResults, 'id'>;

export type EntityResponseType = HttpResponse<IEditionResults>;
export type EntityArrayResponseType = HttpResponse<IEditionResults[]>;

@Injectable({ providedIn: 'root' })
export class EditionResultsService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/edition-results');

  create(editionResults: NewEditionResults): Observable<EntityResponseType> {
    return this.http.post<IEditionResults>(this.resourceUrl, editionResults, { observe: 'response' });
  }

  update(editionResults: IEditionResults): Observable<EntityResponseType> {
    return this.http.put<IEditionResults>(`${this.resourceUrl}/${this.getEditionResultsIdentifier(editionResults)}`, editionResults, {
      observe: 'response',
    });
  }

  partialUpdate(editionResults: PartialUpdateEditionResults): Observable<EntityResponseType> {
    return this.http.patch<IEditionResults>(`${this.resourceUrl}/${this.getEditionResultsIdentifier(editionResults)}`, editionResults, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEditionResults>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEditionResults[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEditionResultsIdentifier(editionResults: Pick<IEditionResults, 'id'>): number {
    return editionResults.id;
  }

  compareEditionResults(o1: Pick<IEditionResults, 'id'> | null, o2: Pick<IEditionResults, 'id'> | null): boolean {
    return o1 && o2 ? this.getEditionResultsIdentifier(o1) === this.getEditionResultsIdentifier(o2) : o1 === o2;
  }

  addEditionResultsToCollectionIfMissing<Type extends Pick<IEditionResults, 'id'>>(
    editionResultsCollection: Type[],
    ...editionResultsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const editionResults: Type[] = editionResultsToCheck.filter(isPresent);
    if (editionResults.length > 0) {
      const editionResultsCollectionIdentifiers = editionResultsCollection.map(editionResultsItem =>
        this.getEditionResultsIdentifier(editionResultsItem),
      );
      const editionResultsToAdd = editionResults.filter(editionResultsItem => {
        const editionResultsIdentifier = this.getEditionResultsIdentifier(editionResultsItem);
        if (editionResultsCollectionIdentifiers.includes(editionResultsIdentifier)) {
          return false;
        }
        editionResultsCollectionIdentifiers.push(editionResultsIdentifier);
        return true;
      });
      return [...editionResultsToAdd, ...editionResultsCollection];
    }
    return editionResultsCollection;
  }
}
