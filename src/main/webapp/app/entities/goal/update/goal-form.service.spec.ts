import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../goal.test-samples';

import { GoalFormService } from './goal-form.service';

describe('Goal Form Service', () => {
  let service: GoalFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoalFormService);
  });

  describe('Service methods', () => {
    describe('createGoalFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGoalFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            value: expect.any(Object),
            subject: expect.any(Object),
            result: expect.any(Object),
          }),
        );
      });

      it('passing IGoal should create a new form with FormGroup', () => {
        const formGroup = service.createGoalFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            value: expect.any(Object),
            subject: expect.any(Object),
            result: expect.any(Object),
          }),
        );
      });
    });

    describe('getGoal', () => {
      it('should return NewGoal for default Goal initial value', () => {
        const formGroup = service.createGoalFormGroup(sampleWithNewData);

        const goal = service.getGoal(formGroup) as any;

        expect(goal).toMatchObject(sampleWithNewData);
      });

      it('should return NewGoal for empty Goal initial value', () => {
        const formGroup = service.createGoalFormGroup();

        const goal = service.getGoal(formGroup) as any;

        expect(goal).toMatchObject({});
      });

      it('should return IGoal', () => {
        const formGroup = service.createGoalFormGroup(sampleWithRequiredData);

        const goal = service.getGoal(formGroup) as any;

        expect(goal).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGoal should not enable id FormControl', () => {
        const formGroup = service.createGoalFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGoal should disable id FormControl', () => {
        const formGroup = service.createGoalFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
