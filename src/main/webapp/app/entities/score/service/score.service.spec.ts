import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IScore } from '../score.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../score.test-samples';

import { ScoreService } from './score.service';

const requireRestSample: IScore = {
  ...sampleWithRequiredData,
};

describe('Score Service', () => {
  let service: ScoreService;
  let httpMock: HttpTestingController;
  let expectedResult: IScore | IScore[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ScoreService);
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

    it('should create a Score', () => {
      const score = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(score).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Score', () => {
      const score = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(score).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Score', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Score', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Score', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addScoreToCollectionIfMissing', () => {
      it('should add a Score to an empty array', () => {
        const score: IScore = sampleWithRequiredData;
        expectedResult = service.addScoreToCollectionIfMissing([], score);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(score);
      });

      it('should not add a Score to an array that contains it', () => {
        const score: IScore = sampleWithRequiredData;
        const scoreCollection: IScore[] = [
          {
            ...score,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addScoreToCollectionIfMissing(scoreCollection, score);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Score to an array that doesn't contain it", () => {
        const score: IScore = sampleWithRequiredData;
        const scoreCollection: IScore[] = [sampleWithPartialData];
        expectedResult = service.addScoreToCollectionIfMissing(scoreCollection, score);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(score);
      });

      it('should add only unique Score to an array', () => {
        const scoreArray: IScore[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const scoreCollection: IScore[] = [sampleWithRequiredData];
        expectedResult = service.addScoreToCollectionIfMissing(scoreCollection, ...scoreArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const score: IScore = sampleWithRequiredData;
        const score2: IScore = sampleWithPartialData;
        expectedResult = service.addScoreToCollectionIfMissing([], score, score2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(score);
        expect(expectedResult).toContain(score2);
      });

      it('should accept null and undefined values', () => {
        const score: IScore = sampleWithRequiredData;
        expectedResult = service.addScoreToCollectionIfMissing([], null, score, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(score);
      });

      it('should return initial array if no Score is added', () => {
        const scoreCollection: IScore[] = [sampleWithRequiredData];
        expectedResult = service.addScoreToCollectionIfMissing(scoreCollection, undefined, null);
        expect(expectedResult).toEqual(scoreCollection);
      });
    });

    describe('compareScore', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareScore(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 4624 };
        const entity2 = null;

        const compareResult1 = service.compareScore(entity1, entity2);
        const compareResult2 = service.compareScore(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 4624 };
        const entity2 = { id: 2120 };

        const compareResult1 = service.compareScore(entity1, entity2);
        const compareResult2 = service.compareScore(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 4624 };
        const entity2 = { id: 4624 };

        const compareResult1 = service.compareScore(entity1, entity2);
        const compareResult2 = service.compareScore(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
