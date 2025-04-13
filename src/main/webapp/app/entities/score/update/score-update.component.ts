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
import { ScoreService } from '../service/score.service';
import { IScore } from '../score.model';
import { ScoreFormGroup, ScoreFormService } from './score-form.service';

@Component({
  selector: 'jhi-score-update',
  templateUrl: './score-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ScoreUpdateComponent implements OnInit {
  isSaving = false;
  score: IScore | null = null;
  subjectValues = Object.keys(Subject);

  editionResultsSharedCollection: IEditionResults[] = [];

  protected scoreService = inject(ScoreService);
  protected scoreFormService = inject(ScoreFormService);
  protected editionResultsService = inject(EditionResultsService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ScoreFormGroup = this.scoreFormService.createScoreFormGroup();

  compareEditionResults = (o1: IEditionResults | null, o2: IEditionResults | null): boolean =>
    this.editionResultsService.compareEditionResults(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ score }) => {
      this.score = score;
      if (score) {
        this.updateForm(score);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const score = this.scoreFormService.getScore(this.editForm);
    if (score.id !== null) {
      this.subscribeToSaveResponse(this.scoreService.update(score));
    } else {
      this.subscribeToSaveResponse(this.scoreService.create(score));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IScore>>): void {
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

  protected updateForm(score: IScore): void {
    this.score = score;
    this.scoreFormService.resetForm(this.editForm, score);

    this.editionResultsSharedCollection = this.editionResultsService.addEditionResultsToCollectionIfMissing<IEditionResults>(
      this.editionResultsSharedCollection,
      score.result,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.editionResultsService
      .query()
      .pipe(map((res: HttpResponse<IEditionResults[]>) => res.body ?? []))
      .pipe(
        map((editionResults: IEditionResults[]) =>
          this.editionResultsService.addEditionResultsToCollectionIfMissing<IEditionResults>(editionResults, this.score?.result),
        ),
      )
      .subscribe((editionResults: IEditionResults[]) => (this.editionResultsSharedCollection = editionResults));
  }
}
