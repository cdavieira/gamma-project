import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEditionResults } from 'app/entities/edition-results/edition-results.model';
import { EditionResultsService } from 'app/entities/edition-results/service/edition-results.service';
import { Subject } from 'app/entities/enumerations/subject.model';
import { GoalService } from '../service/goal.service';
import { IGoal } from '../goal.model';
import { GoalFormGroup, GoalFormService } from './goal-form.service';

@Component({
  selector: 'jhi-goal-update',
  templateUrl: './goal-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GoalUpdateComponent implements OnInit {
  isSaving = false;
  goal: IGoal | null = null;
  subjectValues = Object.keys(Subject);

  editionResultsSharedCollection: IEditionResults[] = [];

  protected goalService = inject(GoalService);
  protected goalFormService = inject(GoalFormService);
  protected editionResultsService = inject(EditionResultsService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: GoalFormGroup = this.goalFormService.createGoalFormGroup();

  compareEditionResults = (o1: IEditionResults | null, o2: IEditionResults | null): boolean =>
    this.editionResultsService.compareEditionResults(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ goal }) => {
      this.goal = goal;
      if (goal) {
        this.updateForm(goal);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const goal = this.goalFormService.getGoal(this.editForm);
    if (goal.id !== null) {
      this.subscribeToSaveResponse(this.goalService.update(goal));
    } else {
      this.subscribeToSaveResponse(this.goalService.create(goal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGoal>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(goal: IGoal): void {
    this.goal = goal;
    this.goalFormService.resetForm(this.editForm, goal);

    this.editionResultsSharedCollection = this.editionResultsService.addEditionResultsToCollectionIfMissing<IEditionResults>(
      this.editionResultsSharedCollection,
      goal.result,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.editionResultsService
      .query()
      .pipe(map((res: HttpResponse<IEditionResults[]>) => res.body ?? []))
      .pipe(
        map((editionResults: IEditionResults[]) =>
          this.editionResultsService.addEditionResultsToCollectionIfMissing<IEditionResults>(editionResults, this.goal?.result),
        ),
      )
      .subscribe((editionResults: IEditionResults[]) => (this.editionResultsSharedCollection = editionResults));
  }
}
