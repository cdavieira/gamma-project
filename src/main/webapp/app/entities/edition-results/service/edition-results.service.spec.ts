import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IEditionResults } from '../edition-results.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../edition-results.test-samples';

import { EditionResultsService } from './edition-results.service';

const requireRestSample: IEditionResults = {
  ...sampleWithRequiredData,
};

describe('EditionResults Service', () => {
  let service: EditionResultsService;
  let httpMock: HttpTestingController;
  let expectedResult: IEditionResults | IEditionResults[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EditionResultsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a EditionResults', () => {
      const editionResults = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(editionResults).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EditionResults', () => {
      const editionResults = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(editionResults).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EditionResults', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EditionResults', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EditionResults', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEditionResultsToCollectionIfMissing', () => {
      it('should add a EditionResults to an empty array', () => {
        const editionResults: IEditionResults = sampleWithRequiredData;
        expectedResult = service.addEditionResultsToCollectionIfMissing([], editionResults);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(editionResults);
      });

      it('should not add a EditionResults to an array that contains it', () => {
        const editionResults: IEditionResults = sampleWithRequiredData;
        const editionResultsCollection: IEditionResults[] = [
          {
            ...editionResults,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEditionResultsToCollectionIfMissing(editionResultsCollection, editionResults);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EditionResults to an array that doesn't contain it", () => {
        const editionResults: IEditionResults = sampleWithRequiredData;
        const editionResultsCollection: IEditionResults[] = [sampleWithPartialData];
        expectedResult = service.addEditionResultsToCollectionIfMissing(editionResultsCollection, editionResults);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(editionResults);
      });

      it('should add only unique EditionResults to an array', () => {
        const editionResultsArray: IEditionResults[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const editionResultsCollection: IEditionResults[] = [sampleWithRequiredData];
        expectedResult = service.addEditionResultsToCollectionIfMissing(editionResultsCollection, ...editionResultsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const editionResults: IEditionResults = sampleWithRequiredData;
        const editionResults2: IEditionResults = sampleWithPartialData;
        expectedResult = service.addEditionResultsToCollectionIfMissing([], editionResults, editionResults2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(editionResults);
        expect(expectedResult).toContain(editionResults2);
      });

      it('should accept null and undefined values', () => {
        const editionResults: IEditionResults = sampleWithRequiredData;
        expectedResult = service.addEditionResultsToCollectionIfMissing([], null, editionResults, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(editionResults);
      });

      it('should return initial array if no EditionResults is added', () => {
        const editionResultsCollection: IEditionResults[] = [sampleWithRequiredData];
        expectedResult = service.addEditionResultsToCollectionIfMissing(editionResultsCollection, undefined, null);
        expect(expectedResult).toEqual(editionResultsCollection);
      });
    });

    describe('compareEditionResults', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEditionResults(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 12230 };
        const entity2 = null;

        const compareResult1 = service.compareEditionResults(entity1, entity2);
        const compareResult2 = service.compareEditionResults(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 12230 };
        const entity2 = { id: 7301 };

        const compareResult1 = service.compareEditionResults(entity1, entity2);
        const compareResult2 = service.compareEditionResults(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 12230 };
        const entity2 = { id: 12230 };

        const compareResult1 = service.compareEditionResults(entity1, entity2);
        const compareResult2 = service.compareEditionResults(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
