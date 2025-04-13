import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IGoal } from '../goal.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../goal.test-samples';

import { GoalService } from './goal.service';

const requireRestSample: IGoal = {
  ...sampleWithRequiredData,
};

describe('Goal Service', () => {
  let service: GoalService;
  let httpMock: HttpTestingController;
  let expectedResult: IGoal | IGoal[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(GoalService);
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

    it('should create a Goal', () => {
      const goal = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(goal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Goal', () => {
      const goal = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(goal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Goal', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Goal', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Goal', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGoalToCollectionIfMissing', () => {
      it('should add a Goal to an empty array', () => {
        const goal: IGoal = sampleWithRequiredData;
        expectedResult = service.addGoalToCollectionIfMissing([], goal);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(goal);
      });

      it('should not add a Goal to an array that contains it', () => {
        const goal: IGoal = sampleWithRequiredData;
        const goalCollection: IGoal[] = [
          {
            ...goal,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGoalToCollectionIfMissing(goalCollection, goal);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Goal to an array that doesn't contain it", () => {
        const goal: IGoal = sampleWithRequiredData;
        const goalCollection: IGoal[] = [sampleWithPartialData];
        expectedResult = service.addGoalToCollectionIfMissing(goalCollection, goal);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(goal);
      });

      it('should add only unique Goal to an array', () => {
        const goalArray: IGoal[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const goalCollection: IGoal[] = [sampleWithRequiredData];
        expectedResult = service.addGoalToCollectionIfMissing(goalCollection, ...goalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const goal: IGoal = sampleWithRequiredData;
        const goal2: IGoal = sampleWithPartialData;
        expectedResult = service.addGoalToCollectionIfMissing([], goal, goal2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(goal);
        expect(expectedResult).toContain(goal2);
      });

      it('should accept null and undefined values', () => {
        const goal: IGoal = sampleWithRequiredData;
        expectedResult = service.addGoalToCollectionIfMissing([], null, goal, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(goal);
      });

      it('should return initial array if no Goal is added', () => {
        const goalCollection: IGoal[] = [sampleWithRequiredData];
        expectedResult = service.addGoalToCollectionIfMissing(goalCollection, undefined, null);
        expect(expectedResult).toEqual(goalCollection);
      });
    });

    describe('compareGoal', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGoal(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 2775 };
        const entity2 = null;

        const compareResult1 = service.compareGoal(entity1, entity2);
        const compareResult2 = service.compareGoal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 2775 };
        const entity2 = { id: 6150 };

        const compareResult1 = service.compareGoal(entity1, entity2);
        const compareResult2 = service.compareGoal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 2775 };
        const entity2 = { id: 2775 };

        const compareResult1 = service.compareGoal(entity1, entity2);
        const compareResult2 = service.compareGoal(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
