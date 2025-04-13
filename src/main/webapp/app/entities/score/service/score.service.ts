import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IScore, NewScore } from '../score.model';

export type PartialUpdateScore = Partial<IScore> & Pick<IScore, 'id'>;

export type EntityResponseType = HttpResponse<IScore>;
export type EntityArrayResponseType = HttpResponse<IScore[]>;

@Injectable({ providedIn: 'root' })
export class ScoreService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/scores');

  create(score: NewScore): Observable<EntityResponseType> {
    return this.http.post<IScore>(this.resourceUrl, score, { observe: 'response' });
  }

  update(score: IScore): Observable<EntityResponseType> {
    return this.http.put<IScore>(`${this.resourceUrl}/${this.getScoreIdentifier(score)}`, score, { observe: 'response' });
  }

  partialUpdate(score: PartialUpdateScore): Observable<EntityResponseType> {
    return this.http.patch<IScore>(`${this.resourceUrl}/${this.getScoreIdentifier(score)}`, score, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IScore>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IScore[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getScoreIdentifier(score: Pick<IScore, 'id'>): number {
    return score.id;
  }

  compareScore(o1: Pick<IScore, 'id'> | null, o2: Pick<IScore, 'id'> | null): boolean {
    return o1 && o2 ? this.getScoreIdentifier(o1) === this.getScoreIdentifier(o2) : o1 === o2;
  }

  addScoreToCollectionIfMissing<Type extends Pick<IScore, 'id'>>(
    scoreCollection: Type[],
    ...scoresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const scores: Type[] = scoresToCheck.filter(isPresent);
    if (scores.length > 0) {
      const scoreCollectionIdentifiers = scoreCollection.map(scoreItem => this.getScoreIdentifier(scoreItem));
      const scoresToAdd = scores.filter(scoreItem => {
        const scoreIdentifier = this.getScoreIdentifier(scoreItem);
        if (scoreCollectionIdentifiers.includes(scoreIdentifier)) {
          return false;
        }
        scoreCollectionIdentifiers.push(scoreIdentifier);
        return true;
      });
      return [...scoresToAdd, ...scoreCollection];
    }
    return scoreCollection;
  }
}
