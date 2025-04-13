import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../score.test-samples';

import { ScoreFormService } from './score-form.service';

describe('Score Form Service', () => {
  let service: ScoreFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreFormService);
  });

  describe('Service methods', () => {
    describe('createScoreFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createScoreFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            value: expect.any(Object),
            subject: expect.any(Object),
            result: expect.any(Object),
          }),
        );
      });

      it('passing IScore should create a new form with FormGroup', () => {
        const formGroup = service.createScoreFormGroup(sampleWithRequiredData);

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

    describe('getScore', () => {
      it('should return NewScore for default Score initial value', () => {
        const formGroup = service.createScoreFormGroup(sampleWithNewData);

        const score = service.getScore(formGroup) as any;

        expect(score).toMatchObject(sampleWithNewData);
      });

      it('should return NewScore for empty Score initial value', () => {
        const formGroup = service.createScoreFormGroup();

        const score = service.getScore(formGroup) as any;

        expect(score).toMatchObject({});
      });

      it('should return IScore', () => {
        const formGroup = service.createScoreFormGroup(sampleWithRequiredData);

        const score = service.getScore(formGroup) as any;

        expect(score).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IScore should not enable id FormControl', () => {
        const formGroup = service.createScoreFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewScore should disable id FormControl', () => {
        const formGroup = service.createScoreFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
