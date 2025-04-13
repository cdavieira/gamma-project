import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IGoal, NewGoal } from '../goal.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGoal for edit and NewGoalFormGroupInput for create.
 */
type GoalFormGroupInput = IGoal | PartialWithRequiredKeyOf<NewGoal>;

type GoalFormDefaults = Pick<NewGoal, 'id'>;

type GoalFormGroupContent = {
  id: FormControl<IGoal['id'] | NewGoal['id']>;
  value: FormControl<IGoal['value']>;
  subject: FormControl<IGoal['subject']>;
  result: FormControl<IGoal['result']>;
};

export type GoalFormGroup = FormGroup<GoalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GoalFormService {
  createGoalFormGroup(goal: GoalFormGroupInput = { id: null }): GoalFormGroup {
    const goalRawValue = {
      ...this.getFormDefaults(),
      ...goal,
    };
    return new FormGroup<GoalFormGroupContent>({
      id: new FormControl(
        { value: goalRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      value: new FormControl(goalRawValue.value, {
        validators: [Validators.required, Validators.min(0), Validators.max(1000)],
      }),
      subject: new FormControl(goalRawValue.subject, {
        validators: [Validators.required],
      }),
      result: new FormControl(goalRawValue.result, {
        validators: [Validators.required],
      }),
    });
  }

  getGoal(form: GoalFormGroup): IGoal | NewGoal {
    return form.getRawValue() as IGoal | NewGoal;
  }

  resetForm(form: GoalFormGroup, goal: GoalFormGroupInput): void {
    const goalRawValue = { ...this.getFormDefaults(), ...goal };
    form.reset(
      {
        ...goalRawValue,
        id: { value: goalRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GoalFormDefaults {
    return {
      id: null,
    };
  }
}
