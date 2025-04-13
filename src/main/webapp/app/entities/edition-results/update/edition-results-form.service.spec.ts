import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../edition-results.test-samples';

import { EditionResultsFormService } from './edition-results-form.service';

describe('EditionResults Form Service', () => {
  let service: EditionResultsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditionResultsFormService);
  });

  describe('Service methods', () => {
    describe('createEditionResultsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEditionResultsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            year: expect.any(Object),
            participant: expect.any(Object),
          }),
        );
      });

      it('passing IEditionResults should create a new form with FormGroup', () => {
        const formGroup = service.createEditionResultsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            year: expect.any(Object),
            participant: expect.any(Object),
          }),
        );
      });
    });

    describe('getEditionResults', () => {
      it('should return NewEditionResults for default EditionResults initial value', () => {
        const formGroup = service.createEditionResultsFormGroup(sampleWithNewData);

        const editionResults = service.getEditionResults(formGroup) as any;

        expect(editionResults).toMatchObject(sampleWithNewData);
      });

      it('should return NewEditionResults for empty EditionResults initial value', () => {
        const formGroup = service.createEditionResultsFormGroup();

        const editionResults = service.getEditionResults(formGroup) as any;

        expect(editionResults).toMatchObject({});
      });

      it('should return IEditionResults', () => {
        const formGroup = service.createEditionResultsFormGroup(sampleWithRequiredData);

        const editionResults = service.getEditionResults(formGroup) as any;

        expect(editionResults).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEditionResults should not enable id FormControl', () => {
        const formGroup = service.createEditionResultsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEditionResults should disable id FormControl', () => {
        const formGroup = service.createEditionResultsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
