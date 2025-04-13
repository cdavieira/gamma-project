import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGoal, NewGoal } from '../goal.model';

export type PartialUpdateGoal = Partial<IGoal> & Pick<IGoal, 'id'>;

export type EntityResponseType = HttpResponse<IGoal>;
export type EntityArrayResponseType = HttpResponse<IGoal[]>;

@Injectable({ providedIn: 'root' })
export class GoalService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/goals');

  create(goal: NewGoal): Observable<EntityResponseType> {
    return this.http.post<IGoal>(this.resourceUrl, goal, { observe: 'response' });
  }

  update(goal: IGoal): Observable<EntityResponseType> {
    return this.http.put<IGoal>(`${this.resourceUrl}/${this.getGoalIdentifier(goal)}`, goal, { observe: 'response' });
  }

  partialUpdate(goal: PartialUpdateGoal): Observable<EntityResponseType> {
    return this.http.patch<IGoal>(`${this.resourceUrl}/${this.getGoalIdentifier(goal)}`, goal, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGoal>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGoal[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGoalIdentifier(goal: Pick<IGoal, 'id'>): number {
    return goal.id;
  }

  compareGoal(o1: Pick<IGoal, 'id'> | null, o2: Pick<IGoal, 'id'> | null): boolean {
    return o1 && o2 ? this.getGoalIdentifier(o1) === this.getGoalIdentifier(o2) : o1 === o2;
  }

  addGoalToCollectionIfMissing<Type extends Pick<IGoal, 'id'>>(
    goalCollection: Type[],
    ...goalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const goals: Type[] = goalsToCheck.filter(isPresent);
    if (goals.length > 0) {
      const goalCollectionIdentifiers = goalCollection.map(goalItem => this.getGoalIdentifier(goalItem));
      const goalsToAdd = goals.filter(goalItem => {
        const goalIdentifier = this.getGoalIdentifier(goalItem);
        if (goalCollectionIdentifiers.includes(goalIdentifier)) {
          return false;
        }
        goalCollectionIdentifiers.push(goalIdentifier);
        return true;
      });
      return [...goalsToAdd, ...goalCollection];
    }
    return goalCollection;
  }
}
