import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IParticipant } from 'app/entities/participant/participant.model';
import { ParticipantService } from 'app/entities/participant/service/participant.service';
import { IEditionResults } from '../edition-results.model';
import { EditionResultsService } from '../service/edition-results.service';
import { EditionResultsFormGroup, EditionResultsFormService } from './edition-results-form.service';

@Component({
  selector: 'jhi-edition-results-update',
  templateUrl: './edition-results-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EditionResultsUpdateComponent implements OnInit {
  isSaving = false;
  editionResults: IEditionResults | null = null;

  participantsSharedCollection: IParticipant[] = [];

  protected editionResultsService = inject(EditionResultsService);
  protected editionResultsFormService = inject(EditionResultsFormService);
  protected participantService = inject(ParticipantService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EditionResultsFormGroup = this.editionResultsFormService.createEditionResultsFormGroup();

  compareParticipant = (o1: IParticipant | null, o2: IParticipant | null): boolean => this.participantService.compareParticipant(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ editionResults }) => {
      this.editionResults = editionResults;
      if (editionResults) {
        this.updateForm(editionResults);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const editionResults = this.editionResultsFormService.getEditionResults(this.editForm);
    if (editionResults.id !== null) {
      this.subscribeToSaveResponse(this.editionResultsService.update(editionResults));
    } else {
      this.subscribeToSaveResponse(this.editionResultsService.create(editionResults));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEditionResults>>): void {
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

  protected updateForm(editionResults: IEditionResults): void {
    this.editionResults = editionResults;
    this.editionResultsFormService.resetForm(this.editForm, editionResults);

    this.participantsSharedCollection = this.participantService.addParticipantToCollectionIfMissing<IParticipant>(
      this.participantsSharedCollection,
      editionResults.participant,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.participantService
      .query()
      .pipe(map((res: HttpResponse<IParticipant[]>) => res.body ?? []))
      .pipe(
        map((participants: IParticipant[]) =>
          this.participantService.addParticipantToCollectionIfMissing<IParticipant>(participants, this.editionResults?.participant),
        ),
      )
      .subscribe((participants: IParticipant[]) => (this.participantsSharedCollection = participants));
  }
}
