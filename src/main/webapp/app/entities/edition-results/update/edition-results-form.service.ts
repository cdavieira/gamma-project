import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IEditionResults, NewEditionResults } from '../edition-results.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEditionResults for edit and NewEditionResultsFormGroupInput for create.
 */
type EditionResultsFormGroupInput = IEditionResults | PartialWithRequiredKeyOf<NewEditionResults>;

type EditionResultsFormDefaults = Pick<NewEditionResults, 'id'>;

type EditionResultsFormGroupContent = {
  id: FormControl<IEditionResults['id'] | NewEditionResults['id']>;
  year: FormControl<IEditionResults['year']>;
  participant: FormControl<IEditionResults['participant']>;
};

export type EditionResultsFormGroup = FormGroup<EditionResultsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EditionResultsFormService {
  createEditionResultsFormGroup(editionResults: EditionResultsFormGroupInput = { id: null }): EditionResultsFormGroup {
    const editionResultsRawValue = {
      ...this.getFormDefaults(),
      ...editionResults,
    };
    return new FormGroup<EditionResultsFormGroupContent>({
      id: new FormControl(
        { value: editionResultsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      year: new FormControl(editionResultsRawValue.year, {
        validators: [Validators.required, Validators.min(1998), Validators.max(2026)],
      }),
      participant: new FormControl(editionResultsRawValue.participant, {
        validators: [Validators.required],
      }),
    });
  }

  getEditionResults(form: EditionResultsFormGroup): IEditionResults | NewEditionResults {
    return form.getRawValue() as IEditionResults | NewEditionResults;
  }

  resetForm(form: EditionResultsFormGroup, editionResults: EditionResultsFormGroupInput): void {
    const editionResultsRawValue = { ...this.getFormDefaults(), ...editionResults };
    form.reset(
      {
        ...editionResultsRawValue,
        id: { value: editionResultsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EditionResultsFormDefaults {
    return {
      id: null,
    };
  }
}
